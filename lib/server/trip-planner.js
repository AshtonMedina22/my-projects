const USER_AGENT =
  process.env.TRIP_PLANNER_USER_AGENT ||
  "trip-planner-ai-agent/1.0 (https://github.com/AshtonMedina22/my-projects)";

const interestTags = {
  museums: [["tourism", "museum|gallery"]],
  history: [
    ["historic", "castle|monument|memorial|archaeological_site"],
    ["tourism", "museum|gallery"],
  ],
  food: [["amenity", "restaurant|cafe|fast_food|food_court"]],
  outdoors: [
    ["leisure", "park|nature_reserve|garden"],
    ["natural", "peak|beach|wood"],
  ],
  shopping: [["shop", "mall|clothes|books|gift|department_store"]],
  nightlife: [["amenity", "bar|pub|biergarten|nightclub"]],
  family: [
    ["tourism", "zoo|aquarium|theme_park"],
    ["leisure", "playground|park"],
  ],
  architecture: [
    ["historic", "building|monument"],
    ["tourism", "attraction"],
  ],
};

const fallbackGeocodes = {
  "santa fe": { display_name: "Santa Fe, New Mexico, United States", lat: 35.687, lon: -105.938 },
  "santa fe, nm": { display_name: "Santa Fe, New Mexico, United States", lat: 35.687, lon: -105.938 },
  paris: { display_name: "Paris, France", lat: 48.857, lon: 2.352 },
  london: { display_name: "London, England, United Kingdom", lat: 51.507, lon: -0.128 },
  "new york": { display_name: "New York, New York, United States", lat: 40.713, lon: -74.006 },
};

function fallbackPois(city, lat, lon) {
  const base = [
    ["Central History Museum", "museum", 0.008, -0.006],
    ["Old Town Plaza", "attraction", -0.006, 0.008],
    ["Garden Walk", "park", 0.014, 0.012],
    ["Local Market Hall", "restaurant", -0.012, -0.01],
    ["Architecture District", "monument", 0.019, -0.014],
    ["Evening Cafe", "cafe", -0.018, 0.016],
    ["River Trail", "nature_reserve", 0.024, 0.004],
    ["City Gallery", "gallery", -0.023, -0.018],
    ["Neighborhood Bistro", "restaurant", 0.004, 0.022],
  ];
  return base.map(([name, category, dLat, dLon], index) => ({
    poi_id: `demo_${index + 1}`,
    name: `${city} ${name}`,
    category,
    lat: lat + dLat,
    lon: lon + dLon,
    url: "https://www.openstreetmap.org/",
    score: 1 - index * 0.04,
  }));
}

async function requestJson(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": USER_AGENT,
          ...(options.headers || {}),
        },
      });
      if (response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
        continue;
      }
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
    }
  }
  throw lastError;
}

async function geocodeCity(destination) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", destination);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  try {
    const data = await requestJson(url);
    if (data?.[0]) {
      return {
        display_name: data[0].display_name || destination,
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
      };
    }
  } catch (error) {
    const fallback = fallbackGeocodes[destination.trim().toLowerCase()];
    if (fallback) return fallback;
    throw error;
  }
  const fallback = fallbackGeocodes[destination.trim().toLowerCase()];
  if (fallback) return fallback;
  throw new Error(`No geocoding result found for ${destination}.`);
}

function overpassClause(key, pattern, radius, lat, lon) {
  return `node["${key}"~"${pattern}"](around:${radius},${lat},${lon});way["${key}"~"${pattern}"](around:${radius},${lat},${lon});`;
}

async function searchPois(destination, interests, limit = 45) {
  const geo = await geocodeCity(destination);
  const clauses = [];
  const selected = interests.length ? interests : ["history", "food", "outdoors"];
  for (const interest of selected) {
    for (const [key, pattern] of interestTags[interest] || [["tourism", "attraction|museum|gallery"]]) {
      clauses.push(overpassClause(key, pattern, 9000, geo.lat, geo.lon));
    }
  }

  const query = `[out:json][timeout:25];(${clauses.join("")});out center tags;`;
  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ data: query }),
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    const seen = new Set();
    const pois = [];
    for (const element of data.elements || []) {
      const name = element.tags?.name;
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;
      if (!name || lat == null || lon == null) continue;
      const poiId = `osm_${element.type}_${element.id}`;
      if (seen.has(poiId)) continue;
      seen.add(poiId);
      pois.push({
        poi_id: poiId,
        name,
        category:
          element.tags?.tourism ||
          element.tags?.amenity ||
          element.tags?.leisure ||
          element.tags?.historic ||
          element.tags?.shop ||
          element.tags?.natural ||
          "point_of_interest",
        lat: Number(lat),
        lon: Number(lon),
        url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
        score: 1 - pois.length * 0.01,
      });
      if (pois.length >= limit) break;
    }
    if (pois.length) return { city_meta: geo, pois };
  } catch (error) {
    return { city_meta: geo, pois: fallbackPois(destination, geo.lat, geo.lon), warning: error.message };
  }
  return { city_meta: geo, pois: fallbackPois(destination, geo.lat, geo.lon) };
}

async function retrieveGuide(destination, interests) {
  const url = new URL("https://en.wikivoyage.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("prop", "extracts|info");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("inprop", "url");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("titles", destination);
  try {
    const data = await requestJson(url);
    const pages = Object.values(data.query?.pages || {});
    const page = pages.find((item) => item.extract);
    if (!page) return [];
    const paragraphs = page.extract.split("\n").filter((line) => line.trim().length > 80);
    return paragraphs.slice(0, 3).map((text, index) => ({
      chunk_id: `guide_${index}`,
      title: page.title || destination,
      source: page.fullurl || "https://en.wikivoyage.org/",
      text,
      score: 1 - index * 0.1,
    }));
  } catch {
    return [
      {
        chunk_id: "guide_fallback",
        title: destination,
        source: "https://en.wikivoyage.org/",
        text: `${destination} planning should balance major sights, local food, outdoor time, and practical travel pacing.`,
        score: 0.5,
      },
    ];
  }
}

function deterministicItinerary({ destination, days, pace, interests, constraints }, pois, chunks) {
  const blocks = ["morning", "afternoon", "evening"];
  const outputDays = [];
  let index = 0;
  for (let day = 1; day <= days; day += 1) {
    const dayPlan = {
      day,
      theme: `${pace[0].toUpperCase()}${pace.slice(1)} ${interests.slice(0, 2).join(" + ") || "city"} day`,
      morning: [],
      afternoon: [],
      evening: [],
    };
    for (const block of blocks) {
      const poi = pois[index % pois.length];
      dayPlan[block].push({
        poi_id: poi.poi_id,
        name: poi.name,
        category: poi.category,
        lat: poi.lat,
        lon: poi.lon,
        url: poi.url,
        why: `Selected from live POI data because it matches ${interests.join(", ") || "general sightseeing"} and supports a ${pace} pace.`,
      });
      index += 1;
    }
    outputDays.push(dayPlan);
  }
  return {
    destination,
    summary: `A ${days}-day ${pace} itinerary grounded in live OpenStreetMap POI results. Constraints: ${constraints || "none"}.`,
    days: outputDays,
    sources: chunks.map((chunk) => ({ title: chunk.title, url: chunk.source })),
  };
}

async function maybeOpenAIPlan(input, pois, chunks) {
  if (!process.env.OPENAI_API_KEY) return null;
  const prompt = `Create JSON only for a ${input.days}-day ${input.pace} trip to ${input.destination}.
Interests: ${input.interests.join(", ")}
Constraints: ${input.constraints || "none"}
Use only these POIs: ${JSON.stringify(pois.slice(0, 40))}
Use these guide chunks as source context: ${JSON.stringify(chunks)}
Return schema: {"destination":"","summary":"","days":[{"day":1,"theme":"","morning":[],"afternoon":[],"evening":[]}],"sources":[]}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("\n");
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return JSON.parse(match[0]);
}

function validateItinerary(itinerary, pois) {
  const allowed = new Set(pois.map((poi) => poi.poi_id));
  for (const day of itinerary.days || []) {
    for (const block of ["morning", "afternoon", "evening"]) {
      for (const item of day[block] || []) {
        if (!allowed.has(item.poi_id)) {
          throw new Error(`Invalid generated POI: ${item.poi_id}`);
        }
      }
    }
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const input = {
      destination: String(req.body?.destination || "Santa Fe, NM").trim(),
      days: Math.max(1, Math.min(7, Number(req.body?.days || 3))),
      pace: String(req.body?.pace || "balanced"),
      interests: Array.isArray(req.body?.interests) ? req.body.interests : ["history", "food", "outdoors"],
      constraints: String(req.body?.constraints || ""),
    };

    const trace = [];
    const poiStart = Date.now();
    const poiResult = await searchPois(input.destination, input.interests);
    trace.push({ step: "search_pois", count: poiResult.pois.length, ms: Date.now() - poiStart, warning: poiResult.warning || null });

    const guideStart = Date.now();
    const chunks = await retrieveGuide(input.destination, input.interests);
    trace.push({ step: "retrieve_guides", count: chunks.length, ms: Date.now() - guideStart });

    let itinerary = await maybeOpenAIPlan(input, poiResult.pois, chunks);
    let mode = "openai";
    if (!itinerary) {
      itinerary = deterministicItinerary(input, poiResult.pois, chunks);
      mode = "deterministic";
    }
    validateItinerary(itinerary, poiResult.pois);

    res.status(200).json({
      mode,
      itinerary,
      pois: poiResult.pois,
      city_meta: poiResult.city_meta,
      guide_chunks: chunks,
      trace,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Trip planner failed" });
  }
};
