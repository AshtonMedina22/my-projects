"use client";

import { useMemo, useState } from "react";

type ItineraryItem = {
  poi_id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  url: string;
  why: string;
};

type ItineraryDay = {
  day: number;
  theme: string;
  morning: ItineraryItem[];
  afternoon: ItineraryItem[];
  evening: ItineraryItem[];
};

type TripResponse = {
  mode: string;
  itinerary: {
    destination: string;
    summary: string;
    days: ItineraryDay[];
    sources: { title: string; url: string }[];
  };
  pois: ItineraryItem[];
  trace: { step: string; count: number; ms: number; warning?: string | null }[];
};

const interestOptions = ["history", "museums", "food", "outdoors", "architecture", "nightlife"];

export default function TripPlannerApp() {
  const [destination, setDestination] = useState("Santa Fe, NM");
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState("balanced");
  const [interests, setInterests] = useState(["history", "museums", "food", "outdoors"]);
  const [constraints, setConstraints] = useState("Prefer walkable neighborhoods and one relaxed coffee break each day.");
  const [result, setResult] = useState<TripResponse | null>(null);
  const [status, setStatus] = useState("Choose a destination and generate a live itinerary.");
  const [loading, setLoading] = useState(false);
  const [dayFilter, setDayFilter] = useState("all");

  async function generateTrip() {
    setLoading(true);
    setStatus("Calling the trip planner API...");
    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, pace, interests, constraints }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Trip planner failed.");
      setResult(data);
      setStatus(`Generated ${data.itinerary.days.length} days using ${data.mode} planning mode.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Trip planner failed.");
    } finally {
      setLoading(false);
    }
  }

  const filteredDays = useMemo(() => {
    if (!result) return [];
    return dayFilter === "all"
      ? result.itinerary.days
      : result.itinerary.days.filter((day) => String(day.day) === dayFilter);
  }, [result, dayFilter]);

  const points = useMemo(() => {
    return filteredDays.flatMap((day) =>
      ["morning", "afternoon", "evening"].flatMap((block) =>
        (day[block as keyof ItineraryDay] as ItineraryItem[]).map((item) => ({
          ...item,
          day: day.day,
          block,
        })),
      ),
    );
  }, [filteredDays]);

  return (
    <section className="trip-live-layout">
      <aside className="tool-sidebar">
        <h2>Trip Inputs</h2>
        <div className="stack-form">
          <label>
            Destination
            <input value={destination} onChange={(event) => setDestination(event.target.value)} />
          </label>
          <label>
            Days
            <input
              type="number"
              min={1}
              max={7}
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            />
          </label>
          <label>
            Pace
            <select value={pace} onChange={(event) => setPace(event.target.value)}>
              <option>relaxed</option>
              <option>balanced</option>
              <option>packed</option>
            </select>
          </label>
          <fieldset>
            <legend>Interests</legend>
            {interestOptions.map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() =>
                    setInterests((current) =>
                      current.includes(interest)
                        ? current.filter((item) => item !== interest)
                        : [...current, interest],
                    )
                  }
                />{" "}
                {interest}
              </label>
            ))}
          </fieldset>
          <label>
            Constraints
            <textarea value={constraints} onChange={(event) => setConstraints(event.target.value)} />
          </label>
          <button className="button primary" type="button" onClick={generateTrip} disabled={loading}>
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>
      </aside>

      <section className="trip-results">
        <div className="case-callout">
          <p>{status}</p>
        </div>

        {result ? (
          <>
            <div className="trip-download-row">
              <select className="live-select" value={dayFilter} onChange={(event) => setDayFilter(event.target.value)}>
                <option value="all">All days</option>
                {result.itinerary.days.map((day) => (
                  <option key={day.day} value={day.day}>
                    Day {day.day}
                  </option>
                ))}
              </select>
              <a
                className="button secondary"
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result.itinerary, null, 2))}`}
                download="trip-itinerary.json"
              >
                Download JSON
              </a>
            </div>
            <MapPreview points={points} />
            <div className="case-callout">
              <p>{result.itinerary.summary}</p>
            </div>
            {filteredDays.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
            <section className="sources-list">
              <h2>Sources</h2>
              {result.itinerary.sources?.map((source) => (
                <a key={`${source.title}-${source.url}`} href={source.url}>
                  {source.title}
                </a>
              ))}
            </section>
          </>
        ) : null}
      </section>

      <aside className="manual-preview">
        <h2>Agent Trace</h2>
        {result?.trace?.map((trace) => (
          <div className="manual-section" key={trace.step}>
            <h3>{trace.step}</h3>
            <pre>{JSON.stringify(trace, null, 2)}</pre>
          </div>
        )) ?? <p className="muted-note">Trace appears after itinerary generation.</p>}
      </aside>
    </section>
  );
}

function MapPreview({ points }: { points: (ItineraryItem & { day: number; block: string })[] }) {
  if (!points.length) {
    return <div className="live-map empty-map">Map appears after itinerary generation.</div>;
  }
  const minLat = Math.min(...points.map((point) => point.lat));
  const maxLat = Math.max(...points.map((point) => point.lat));
  const minLon = Math.min(...points.map((point) => point.lon));
  const maxLon = Math.max(...points.map((point) => point.lon));

  return (
    <div className="live-map">
      <div className="live-map-grid">
        {points.map((point, index) => {
          const left = ((point.lon - minLon) / Math.max(maxLon - minLon, 0.0001)) * 78 + 11;
          const top = 89 - ((point.lat - minLat) / Math.max(maxLat - minLat, 0.0001)) * 78;
          return (
            <span
              className="live-map-pin"
              key={`${point.poi_id}-${point.day}-${point.block}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              title={`${point.name} - Day ${point.day} ${point.block}`}
            >
              {index + 1}
            </span>
          );
        })}
      </div>
      <div className="live-map-caption">{points.length} itinerary stops shown on a normalized coordinate map.</div>
    </div>
  );
}

function DayCard({ day }: { day: ItineraryDay }) {
  return (
    <article className="trip-day-card">
      <h2>
        Day {day.day}: {day.theme}
      </h2>
      <div className="trip-block-grid">
        {(["morning", "afternoon", "evening"] as const).map((block) => (
          <section key={block}>
            <h3>{block}</h3>
            {day[block].map((item) => (
              <div className="poi-card" key={`${block}-${item.poi_id}`}>
                <strong>{item.name}</strong>
                <span>{item.category}</span>
                <p>{item.why}</p>
                <a href={item.url}>Open source</a>
                <div className="vote-row">
                  <button type="button">Upvote</button>
                  <button type="button">Downvote</button>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
