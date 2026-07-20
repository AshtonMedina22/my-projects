# Trip Planner AI Agent

This is a portfolio-ready Streamlit capstone project that combines agentic AI workflows, live travel data, retrieval, interactive maps, persistent state, and feedback loops.

## Features

- OpenAI Responses API agent loop with strict tool schemas.
- Live city geocoding through OpenStreetMap Nominatim.
- Live point-of-interest search through Overpass API.
- Optional Wikivoyage retrieval with TF-IDF chunk search.
- PyDeck itinerary map with day filters and route paths.
- Persistent itinerary state in `data/app_state.json`.
- Feedback collection in `data/feedback.jsonl`.
- Local deterministic fallback when no OpenAI API key is configured.

## Run Locally

```bash
pip install -r requirements.txt
set OPENAI_API_KEY=your_key_here
streamlit run app.py
```

For public deployment, configure `OPENAI_API_KEY` in Streamlit secrets or let visitors paste their own key into the sidebar. Never commit keys.

## External APIs

- OpenStreetMap Nominatim: geocoding, no key required, valid User-Agent required.
- Overpass API: point-of-interest data, no key required.
- Wikivoyage/Wikimedia API: optional RAG context, no key required.

## Architecture

User input -> Streamlit session state -> Responses API agent -> tool calls -> live POI/RAG data -> itinerary JSON -> validation -> map, cards, download, feedback.

## Suggested Demo

Destination: `Santa Fe, NM`

Interests: `history`, `museums`, `food`, `outdoors`

Constraints: `Prefer walkable neighborhoods and one relaxed coffee break each day.`
