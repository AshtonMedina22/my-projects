import TripPlannerApp from "./trip-planner-app";

export const metadata = {
  title: "Trip Planner AI Agent | Live App",
  description: "Generate a grounded itinerary using live OpenStreetMap data, guide retrieval, and agent trace output.",
};

export default function TripPlannerPage() {
  return (
    <main className="app-shell trip-app">
      <section className="app-header">
        <div>
          <p className="eyebrow">Main capstone live app</p>
          <h1>Trip Planner AI Agent</h1>
          <p>
            Generate a grounded itinerary from live OpenStreetMap POIs and travel guide context. The API can use
            OpenAI when configured, and falls back to deterministic planning so the public demo stays usable.
          </p>
        </div>
        <div className="status-panel">
          <span>Runtime: Vercel Function</span>
          <span>Data: OpenStreetMap + Wikivoyage</span>
          <span>State: Browser session</span>
        </div>
      </section>
      <TripPlannerApp />
    </main>
  );
}
