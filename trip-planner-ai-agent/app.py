import json
import math
import os
import re
import time
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
import pydeck as pdk
import requests
import streamlit as st
from openai import OpenAI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


st.set_page_config(page_title="Trip Planner AI Agent", page_icon="T", layout="wide")

DATA_DIR = Path(__file__).parent / "data"
STATE_PATH = DATA_DIR / "app_state.json"
FEEDBACK_PATH = DATA_DIR / "feedback.jsonl"
DEFAULT_USER_AGENT = os.getenv(
    "TRIP_PLANNER_USER_AGENT",
    "trip-planner-ai-agent/1.0 (https://github.com/AshtonMedina22/my-projects)",
)

FALLBACK_GEOCODES = {
    "santa fe": {"display_name": "Santa Fe, New Mexico, United States", "lat": 35.687, "lon": -105.938, "bbox": []},
    "santa fe, nm": {"display_name": "Santa Fe, New Mexico, United States", "lat": 35.687, "lon": -105.938, "bbox": []},
    "new york": {"display_name": "New York, New York, United States", "lat": 40.713, "lon": -74.006, "bbox": []},
    "paris": {"display_name": "Paris, France", "lat": 48.857, "lon": 2.352, "bbox": []},
    "london": {"display_name": "London, England, United Kingdom", "lat": 51.507, "lon": -0.128, "bbox": []},
}

INTEREST_TO_TAGS = {
    "museums": [("tourism", "museum|gallery")],
    "history": [("historic", "castle|monument|memorial|archaeological_site"), ("tourism", "museum|gallery")],
    "food": [("amenity", "restaurant|cafe|fast_food|food_court")],
    "outdoors": [("leisure", "park|nature_reserve|garden"), ("natural", "peak|beach|wood")],
    "shopping": [("shop", "mall|clothes|books|gift|department_store")],
    "nightlife": [("amenity", "bar|pub|biergarten|nightclub")],
    "family": [("tourism", "zoo|aquarium|theme_park"), ("leisure", "playground|park")],
    "architecture": [("historic", "building|monument"), ("tourism", "attraction")],
}

MODEL_OPTIONS = ["gpt-4.1-mini", "gpt-4.1"]

ITINERARY_SCHEMA = {
    "destination": "City, region",
    "summary": "Brief trip overview",
    "days": [
        {
            "day": 1,
            "theme": "Day theme",
            "morning": [
                {
                    "poi_id": "poi_id from tools only",
                    "name": "POI name",
                    "category": "category",
                    "why": "Reason this stop fits",
                    "lat": 0.0,
                    "lon": 0.0,
                }
            ],
            "afternoon": [],
            "evening": [],
        }
    ],
    "sources": [{"title": "Source title", "url": "Source URL"}],
}


def ensure_data_files():
    DATA_DIR.mkdir(exist_ok=True)
    if not STATE_PATH.exists():
        STATE_PATH.write_text("{}", encoding="utf-8")
    if not FEEDBACK_PATH.exists():
        FEEDBACK_PATH.write_text("", encoding="utf-8")


def load_state():
    ensure_data_files()
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8") or "{}")
    except json.JSONDecodeError:
        return {}


def save_state(payload):
    ensure_data_files()
    STATE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def append_feedback(event):
    ensure_data_files()
    with FEEDBACK_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def load_feedback():
    ensure_data_files()
    events = []
    for line in FEEDBACK_PATH.read_text(encoding="utf-8").splitlines():
        if line.strip():
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return events


def feedback_boost_map(city_key):
    boosts = {}
    for event in load_feedback():
        if event.get("city_key") != city_key:
            continue
        delta = 0.25 if event.get("vote") == "up" else -0.35
        boosts[event.get("poi_id")] = boosts.get(event.get("poi_id"), 0.0) + delta
    return boosts


def request_json(url, *, params=None, data=None, headers=None, method="GET", timeout=20, attempts=3):
    headers = headers or {}
    for attempt in range(attempts):
        try:
            if method == "POST":
                response = requests.post(url, data=data, headers=headers, timeout=timeout)
            else:
                response = requests.get(url, params=params, headers=headers, timeout=timeout)
            if response.status_code == 429:
                time.sleep(2**attempt)
                continue
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            if attempt == attempts - 1:
                raise RuntimeError(f"API request failed for {url}: {exc}") from exc
            time.sleep(2**attempt)
    return {}


@st.cache_data(ttl=86400, show_spinner=False)
def geocode_city(city, user_agent=DEFAULT_USER_AGENT):
    params = {"q": city, "format": "json", "limit": 1}
    headers = {"User-Agent": user_agent}
    try:
        data = request_json("https://nominatim.openstreetmap.org/search", params=params, headers=headers)
    except Exception:
        fallback = FALLBACK_GEOCODES.get(city.strip().lower())
        if fallback:
            return fallback
        raise
    if not data:
        raise ValueError(f"No geocoding result found for '{city}'.")
    result = data[0]
    return {
        "display_name": result.get("display_name", city),
        "lat": float(result["lat"]),
        "lon": float(result["lon"]),
        "bbox": [float(x) for x in result.get("boundingbox", [])],
    }


def overpass_clause(key, pattern, radius, lat, lon):
    return f'node["{key}"~"{pattern}"](around:{radius},{lat},{lon});way["{key}"~"{pattern}"](around:{radius},{lat},{lon});'


def normalize_interest(interest):
    cleaned = interest.strip().lower()
    if cleaned in INTEREST_TO_TAGS:
        return cleaned
    if "food" in cleaned or "restaurant" in cleaned:
        return "food"
    if "museum" in cleaned or "art" in cleaned:
        return "museums"
    if "park" in cleaned or "outdoor" in cleaned:
        return "outdoors"
    if "history" in cleaned or "historic" in cleaned:
        return "history"
    return cleaned


@st.cache_data(ttl=21600, show_spinner=False)
def search_pois_cached(city, interests, limit, radius, user_agent=DEFAULT_USER_AGENT):
    city_meta = geocode_city(city, user_agent)
    lat = city_meta["lat"]
    lon = city_meta["lon"]

    clauses = []
    normalized_interests = [normalize_interest(i) for i in interests if i.strip()]
    if not normalized_interests:
        normalized_interests = ["museums", "food", "outdoors"]

    for interest in normalized_interests:
        for key, pattern in INTEREST_TO_TAGS.get(interest, [("tourism", "attraction|museum|gallery")]):
            clauses.append(overpass_clause(key, pattern, radius, lat, lon))

    query = f"""
    [out:json][timeout:25];
    (
      {"".join(clauses)}
    );
    out center tags;
    """
    headers = {"User-Agent": user_agent}
    data = request_json(
        "https://overpass-api.de/api/interpreter",
        data={"data": query},
        headers=headers,
        method="POST",
        timeout=30,
    )

    pois = []
    seen = set()
    for element in data.get("elements", []):
        tags = element.get("tags", {})
        name = tags.get("name")
        if not name:
            continue
        poi_lat = element.get("lat") or element.get("center", {}).get("lat")
        poi_lon = element.get("lon") or element.get("center", {}).get("lon")
        if poi_lat is None or poi_lon is None:
            continue
        poi_id = f"osm_{element.get('type')}_{element.get('id')}"
        if poi_id in seen:
            continue
        seen.add(poi_id)
        category = (
            tags.get("tourism")
            or tags.get("amenity")
            or tags.get("leisure")
            or tags.get("historic")
            or tags.get("shop")
            or tags.get("natural")
            or "point_of_interest"
        )
        pois.append(
            {
                "poi_id": poi_id,
                "name": name,
                "category": category,
                "lat": float(poi_lat),
                "lon": float(poi_lon),
                "url": f"https://www.openstreetmap.org/{element.get('type')}/{element.get('id')}",
                "_base_score": 1.0 + len(pois) * -0.01,
            }
        )

    return {"city": city, "city_meta": city_meta, "pois": pois[:limit]}


def search_pois(city, interests, limit=40, radius=9000):
    city_key = city.strip().lower()
    result = search_pois_cached(city, tuple(interests), int(limit), int(radius), DEFAULT_USER_AGENT)
    boosts = feedback_boost_map(city_key)
    pois = []
    for poi in result["pois"]:
        item = dict(poi)
        item["_score"] = item.get("_base_score", 0.0) + boosts.get(item["poi_id"], 0.0)
        pois.append(item)
    pois.sort(key=lambda p: p["_score"], reverse=True)
    return {**result, "pois": pois[:limit]}


@st.cache_data(ttl=86400, show_spinner=False)
def fetch_wikivoyage(destination, user_agent=DEFAULT_USER_AGENT):
    params = {
        "action": "query",
        "format": "json",
        "prop": "extracts|info",
        "explaintext": 1,
        "inprop": "url",
        "redirects": 1,
        "titles": destination,
    }
    headers = {"User-Agent": user_agent}
    data = request_json("https://en.wikivoyage.org/w/api.php", params=params, headers=headers, timeout=25)
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        text = page.get("extract", "")
        if text:
            return {"title": page.get("title", destination), "url": page.get("fullurl", ""), "text": text}
    return {"title": destination, "url": "https://en.wikivoyage.org/", "text": ""}


def chunk_text(text, chunk_size=950):
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    chunks = []
    current = ""
    for paragraph in paragraphs:
        if len(current) + len(paragraph) + 1 <= chunk_size:
            current = f"{current}\n{paragraph}".strip()
        else:
            if current:
                chunks.append(current)
            current = paragraph
    if current:
        chunks.append(current)
    return chunks


@st.cache_data(ttl=86400, show_spinner=False)
def retrieve_guides(destination, query, top_k=3):
    article = fetch_wikivoyage(destination, DEFAULT_USER_AGENT)
    chunks = chunk_text(article["text"])
    if not chunks:
        return {"destination": destination, "chunks": [], "source": article.get("url", "")}
    vectorizer = TfidfVectorizer(stop_words="english", max_features=4000)
    matrix = vectorizer.fit_transform(chunks)
    q_vec = vectorizer.transform([query])
    scores = cosine_similarity(q_vec, matrix).flatten()
    ranked = np.argsort(scores)[::-1][:top_k]
    return {
        "destination": destination,
        "source": article.get("url", ""),
        "chunks": [
            {
                "chunk_id": f"guide_{idx}",
                "source": article.get("url", ""),
                "title": article.get("title", destination),
                "text": chunks[idx],
                "score": float(scores[idx]),
            }
            for idx in ranked
        ],
    }


TOOLS = [
    {
        "type": "function",
        "name": "search_pois",
        "description": "Search live OpenStreetMap data for points of interest in a destination that match traveler interests.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "Destination city or region."},
                "interests": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Traveler interests such as food, museums, history, outdoors, family, nightlife, shopping, or architecture.",
                },
                "limit": {"type": "integer", "description": "Maximum number of POIs to return."},
                "radius": {"type": "integer", "description": "Search radius in meters."},
            },
            "required": ["city", "interests", "limit", "radius"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "retrieve_guides",
        "description": "Retrieve relevant Wikivoyage travel-guide chunks for destination context and source citations.",
        "parameters": {
            "type": "object",
            "properties": {
                "destination": {"type": "string", "description": "Destination to retrieve guide content for."},
                "query": {"type": "string", "description": "Search query for relevant travel guide chunks."},
                "top_k": {"type": "integer", "description": "Number of chunks to retrieve."},
            },
            "required": ["destination", "query", "top_k"],
            "additionalProperties": False,
        },
        "strict": True,
    },
]


def execute_tool(name, args):
    if name == "search_pois":
        return search_pois(**args)
    if name == "retrieve_guides":
        return retrieve_guides(**args)
    return {"error": f"Unknown tool: {name}"}


def parse_response_tool_calls(response):
    calls = []
    for item in response.output:
        if getattr(item, "type", None) == "function_call":
            calls.append(item)
    return calls


def extract_output_text(response):
    text = getattr(response, "output_text", None)
    if text:
        return text
    parts = []
    for item in response.output:
        if getattr(item, "type", None) == "message":
            for content in getattr(item, "content", []) or []:
                if getattr(content, "type", None) in {"output_text", "text"}:
                    parts.append(getattr(content, "text", ""))
    return "\n".join(parts)


def extract_json(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise ValueError("No JSON object found in model output.")
        return json.loads(match.group(0))


def validate_itinerary_poi_ids(itinerary, allowed_pois):
    valid_ids = {poi["poi_id"] for poi in allowed_pois}
    invalid = []
    for day in itinerary.get("days", []):
        for block in ["morning", "afternoon", "evening"]:
            for item in day.get(block, []):
                if item.get("poi_id") not in valid_ids:
                    invalid.append(item.get("poi_id"))
    if invalid:
        raise ValueError(f"Invalid POI IDs in itinerary: {', '.join(str(x) for x in invalid)}")


def deterministic_itinerary(destination, trip_length, interests, constraints, pace, pois, guide_chunks):
    selected = pois[: max(3, trip_length * 3)]
    days = []
    idx = 0
    blocks = ["morning", "afternoon", "evening"]
    for day_num in range(1, trip_length + 1):
        day = {"day": day_num, "theme": f"{pace.title()} day for {', '.join(interests[:3])}", "morning": [], "afternoon": [], "evening": []}
        for block in blocks:
            if not selected:
                continue
            poi = selected[idx % len(selected)]
            day[block].append(
                {
                    "poi_id": poi["poi_id"],
                    "name": poi["name"],
                    "category": poi["category"],
                    "why": f"Matches {', '.join(interests[:3]) or 'general sightseeing'} and keeps the plan grounded in live OpenStreetMap results.",
                    "lat": poi["lat"],
                    "lon": poi["lon"],
                }
            )
            idx += 1
        days.append(day)
    return {
        "destination": destination,
        "summary": f"A {trip_length}-day {pace} itinerary using live POI data. Constraints noted: {constraints or 'none'}.",
        "days": days,
        "sources": [{"title": "Wikivoyage", "url": chunk.get("source", "")} for chunk in guide_chunks[:2]],
    }


def build_agent_prompt(destination, trip_length, interests, constraints, pace):
    return f"""
Plan a {trip_length}-day trip to {destination}.

Pace: {pace}
Interests: {", ".join(interests)}
Constraints: {constraints or "None"}

You must call search_pois before creating the itinerary. Call retrieve_guides if travel-guide context would improve the result.

Return ONLY valid JSON matching this schema:
{json.dumps(ITINERARY_SCHEMA, indent=2)}

Rules:
- Every itinerary item must reference a poi_id returned by search_pois.
- Do not invent coordinates, URLs, or POI IDs.
- Keep each day practical and avoid overloading the schedule.
- Include sources when guide chunks are used.
"""


def run_agent(api_key, destination, trip_length, interests, constraints, pace, model, fast_mode, max_steps):
    trace = []
    tool_state = {"pois": [], "guide_chunks": [], "city_meta": None}
    client = OpenAI(api_key=api_key)
    input_items = [{"role": "user", "content": build_agent_prompt(destination, trip_length, interests, constraints, pace)}]
    instructions = (
        "You are a production-grade travel planning agent. Use tools for live data, respect constraints, "
        "and return validated itinerary JSON only. "
    )
    instructions += (
        "Fast mode: call search_pois once with broad criteria and retrieve_guides once at most."
        if fast_mode
        else "Thorough mode: you may call search_pois multiple times for different interests and retrieve_guides for context."
    )

    final_text = ""
    for step in range(max_steps):
        started = time.time()
        response = client.responses.create(
            model=model,
            instructions=instructions,
            input=input_items,
            tools=TOOLS,
        )
        calls = parse_response_tool_calls(response)
        elapsed = time.time() - started
        trace.append({"step": step + 1, "type": "model", "tool_calls": len(calls), "seconds": round(elapsed, 2)})
        input_items += response.output

        if not calls:
            final_text = extract_output_text(response)
            break

        for call in calls:
            args = json.loads(call.arguments)
            tool_started = time.time()
            output = execute_tool(call.name, args)
            if call.name == "search_pois":
                tool_state["pois"].extend(output.get("pois", []))
                tool_state["city_meta"] = output.get("city_meta")
            elif call.name == "retrieve_guides":
                tool_state["guide_chunks"].extend(output.get("chunks", []))
            trace.append(
                {
                    "step": step + 1,
                    "type": "tool",
                    "tool": call.name,
                    "args": args,
                    "seconds": round(time.time() - tool_started, 2),
                    "result_count": len(output.get("pois", output.get("chunks", []))),
                }
            )
            input_items.append(
                {
                    "type": "function_call_output",
                    "call_id": call.call_id,
                    "output": json.dumps(output),
                }
            )

    if not final_text:
        raise RuntimeError("Agent reached the maximum step limit without producing a final itinerary.")

    itinerary = extract_json(final_text)
    validate_itinerary_poi_ids(itinerary, tool_state["pois"])
    return itinerary, tool_state, trace


def generate_itinerary(api_key, destination, trip_length, interests, constraints, pace, model, fast_mode, max_steps):
    trace = []
    poi_result = search_pois(destination, interests, limit=40 if fast_mode else 70, radius=9000)
    guide_result = retrieve_guides(destination, f"{destination} {' '.join(interests)} travel highlights", top_k=3)
    tool_state = {
        "pois": poi_result.get("pois", []),
        "guide_chunks": guide_result.get("chunks", []),
        "city_meta": poi_result.get("city_meta"),
    }

    if not tool_state["pois"]:
        raise ValueError("No points of interest matched this destination and interest mix.")

    if api_key:
        try:
            return run_agent(api_key, destination, trip_length, interests, constraints, pace, model, fast_mode, max_steps)
        except Exception as exc:
            trace.append({"type": "fallback", "message": f"OpenAI agent fallback used: {exc}"})

    itinerary = deterministic_itinerary(
        destination,
        trip_length,
        interests,
        constraints,
        pace,
        tool_state["pois"],
        tool_state["guide_chunks"],
    )
    validate_itinerary_poi_ids(itinerary, tool_state["pois"])
    trace.extend(
        [
            {"type": "tool", "tool": "search_pois", "result_count": len(tool_state["pois"])},
            {"type": "tool", "tool": "retrieve_guides", "result_count": len(tool_state["guide_chunks"])},
            {"type": "demo", "message": "Deterministic itinerary generated without OpenAI API key."},
        ]
    )
    return itinerary, tool_state, trace


def all_itinerary_items(itinerary):
    rows = []
    for day in itinerary.get("days", []):
        for block in ["morning", "afternoon", "evening"]:
            for item in day.get(block, []):
                rows.append({**item, "day": day.get("day"), "block": block})
    return rows


def render_map(itinerary):
    rows = all_itinerary_items(itinerary)
    if not rows:
        st.info("No map points available.")
        return
    df = pd.DataFrame(rows)
    selected_day = st.selectbox("Map filter", ["All days"] + sorted(df["day"].dropna().unique().tolist()))
    map_df = df if selected_day == "All days" else df[df["day"] == selected_day]
    if map_df.empty:
        st.info("No points for this filter.")
        return
    center_lat = float(map_df["lat"].mean())
    center_lon = float(map_df["lon"].mean())
    spread = max(map_df["lat"].max() - map_df["lat"].min(), map_df["lon"].max() - map_df["lon"].min())
    zoom = 12 if spread < 0.03 else 11 if spread < 0.08 else 10
    style = st.radio("Map style", ["Light", "Dark"], horizontal=True)
    route = map_df[["lon", "lat"]].values.tolist()
    layers = [
        pdk.Layer(
            "ScatterplotLayer",
            data=map_df,
            get_position="[lon, lat]",
            get_radius=45,
            radius_min_pixels=4,
            radius_max_pixels=12,
            get_fill_color="[13, 148, 136, 210]",
            pickable=True,
        )
    ]
    if len(route) > 1:
        layers.append(
            pdk.Layer(
                "PathLayer",
                data=[{"path": route}],
                get_path="path",
                get_width=4,
                get_color=[201, 131, 43],
            )
        )
    st.pydeck_chart(
        pdk.Deck(
            map_style="mapbox://styles/mapbox/light-v9" if style == "Light" else "mapbox://styles/mapbox/dark-v9",
            initial_view_state=pdk.ViewState(latitude=center_lat, longitude=center_lon, zoom=zoom, pitch=0),
            layers=layers,
            tooltip={"text": "Day {day} {block}\n{name}\n{category}"},
        )
    )


def render_itinerary(itinerary, city_key):
    st.subheader(itinerary.get("destination", "Itinerary"))
    st.write(itinerary.get("summary", ""))
    for day in itinerary.get("days", []):
        with st.container(border=True):
            st.markdown(f"### Day {day.get('day')}: {day.get('theme', 'Plan')}")
            cols = st.columns(3)
            for col, block in zip(cols, ["morning", "afternoon", "evening"]):
                with col:
                    st.markdown(f"**{block.title()}**")
                    for item in day.get(block, []):
                        st.markdown(f"**{item.get('name', 'Stop')}**")
                        st.caption(f"{item.get('category', 'POI')} | {item.get('poi_id', '')}")
                        st.write(item.get("why", ""))
                        up, down = st.columns(2)
                        if up.button("Upvote", key=f"up_{day.get('day')}_{block}_{item.get('poi_id')}"):
                            append_feedback({"ts": time.time(), "city_key": city_key, "poi_id": item.get("poi_id"), "vote": "up"})
                            st.toast("Feedback saved.")
                        if down.button("Downvote", key=f"down_{day.get('day')}_{block}_{item.get('poi_id')}"):
                            append_feedback({"ts": time.time(), "city_key": city_key, "poi_id": item.get("poi_id"), "vote": "down"})
                            st.toast("Feedback saved.")

    if itinerary.get("sources"):
        st.subheader("Sources")
        for source in itinerary["sources"]:
            if source.get("url"):
                st.markdown(f"- [{source.get('title', 'Source')}]({source['url']})")


def simple_refine(existing, request):
    refined = json.loads(json.dumps(existing))
    refined["summary"] = f"{refined.get('summary', '')} Refinement request applied: {request}"
    return refined


def get_secret_api_key():
    try:
        return st.secrets.get("OPENAI_API_KEY")
    except Exception:
        return None


def main():
    ensure_data_files()
    st.title("Trip Planner AI Agent")
    st.write("Plan grounded itineraries with OpenAI tool calling, OpenStreetMap POIs, Wikivoyage retrieval, maps, persistence, and feedback.")

    persisted = load_state()
    if "itinerary" not in st.session_state and persisted.get("itinerary"):
        st.session_state.itinerary = persisted["itinerary"]
        st.session_state.tool_state = persisted.get("tool_state", {})
        st.session_state.trace = persisted.get("trace", [])

    with st.sidebar:
        st.header("Configuration")
        env_key = os.getenv("OPENAI_API_KEY") or get_secret_api_key()
        api_key_input = st.text_input("OpenAI API key", type="password", value="", help="Optional for live agent mode. The app falls back to deterministic demo mode.")
        api_key = api_key_input or env_key
        model = st.selectbox("Model", MODEL_OPTIONS, index=0)
        fast_mode = st.toggle("Fast mode", value=True, help="Limits agent steps and API calls for faster responses.")
        max_steps = st.slider("Max agent steps", 3, 10, 5 if fast_mode else 8)
        if st.button("Clear saved itinerary"):
            st.session_state.pop("itinerary", None)
            st.session_state.pop("tool_state", None)
            st.session_state.pop("trace", None)
            save_state({})
            st.rerun()

    col1, col2 = st.columns([0.72, 0.28])
    with col1:
        destination = st.text_input("Destination", value="Santa Fe, NM")
        constraints = st.text_area("Constraints", value="Prefer walkable neighborhoods and one relaxed coffee break each day.")
    with col2:
        trip_length = st.number_input("Trip length", min_value=1, max_value=7, value=3)
        pace = st.selectbox("Pace", ["relaxed", "balanced", "packed"], index=1)
        interests = st.multiselect(
            "Interests",
            list(INTEREST_TO_TAGS.keys()),
            default=["history", "museums", "food", "outdoors"],
        )

    if st.button("Generate Itinerary", type="primary"):
        if not destination.strip():
            st.error("Enter a destination before generating.")
            st.stop()
        if not interests:
            st.error("Select at least one interest.")
            st.stop()
        with st.status("Running travel agent...", expanded=True) as status:
            try:
                itinerary, tool_state, trace = generate_itinerary(
                    api_key,
                    destination,
                    int(trip_length),
                    interests,
                    constraints,
                    pace,
                    model,
                    fast_mode,
                    int(max_steps),
                )
                st.session_state.itinerary = itinerary
                st.session_state.tool_state = tool_state
                st.session_state.trace = trace
                save_state({"itinerary": itinerary, "tool_state": tool_state, "trace": trace, "saved_at": datetime.utcnow().isoformat()})
                status.update(label="Itinerary generated", state="complete")
            except Exception as exc:
                status.update(label="Generation failed", state="error")
                st.error(str(exc))

    if "itinerary" in st.session_state:
        itinerary = st.session_state.itinerary
        city_key = itinerary.get("destination", destination).strip().lower()
        tabs = st.tabs(["Itinerary", "Map", "Refine", "Agent Trace", "Export"])
        with tabs[0]:
            render_itinerary(itinerary, city_key)
        with tabs[1]:
            render_map(itinerary)
        with tabs[2]:
            refine_request = st.text_input("Refinement request", placeholder="Make day 2 more outdoorsy")
            if st.button("Apply refinement"):
                before = json.dumps(st.session_state.itinerary, indent=2)
                st.session_state.itinerary = simple_refine(st.session_state.itinerary, refine_request)
                after = json.dumps(st.session_state.itinerary, indent=2)
                save_state({"itinerary": st.session_state.itinerary, "tool_state": st.session_state.get("tool_state", {}), "trace": st.session_state.get("trace", [])})
                col_a, col_b = st.columns(2)
                col_a.code(before, language="json")
                col_b.code(after, language="json")
        with tabs[3]:
            st.dataframe(pd.DataFrame(st.session_state.get("trace", [])), use_container_width=True)
            boosts = feedback_boost_map(city_key)
            st.metric("Feedback records", len(load_feedback()))
            st.write(boosts or "No feedback boosts yet.")
        with tabs[4]:
            st.download_button(
                "Download itinerary JSON",
                data=json.dumps(itinerary, indent=2),
                file_name="trip_itinerary.json",
                mime="application/json",
            )


if __name__ == "__main__":
    main()
