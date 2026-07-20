# Trip Planner AI Agent Capstone

## Objective

Build a production-style AI travel planner that demonstrates agent architecture, tool calling, real-time API integration, retrieval-augmented context, Streamlit UX, map visualization, persistence, refinement, and feedback loops.

## Engineering Highlights

- Tool schemas constrain the model to real functions.
- The app validates generated itineraries against POIs returned by tools.
- External API calls include timeouts, retries, caching, and User-Agent headers.
- Feedback is scoped by city and POI, then used to rerank future POI results.
- The app remains demoable without an API key through deterministic itinerary generation.

## Portfolio Value

This project shows practical AI engineering beyond a basic chatbot: real APIs, local state, UI state management, validation, error handling, and observable agent traces.
