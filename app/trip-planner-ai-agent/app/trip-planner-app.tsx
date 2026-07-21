"use client";

import { Activity, Download, MapPin, Route, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
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
  const [status, setStatus] = useState("Ready. Configure a trip and generate an itinerary.");
  const [loading, setLoading] = useState(false);
  const [dayFilter, setDayFilter] = useState("all");

  async function generateTrip() {
    setLoading(true);
    setStatus("Planning route, retrieving POIs, and validating itinerary output...");
    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, pace, interests, constraints }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Trip planner failed.");
      setResult(data);
      setStatus(`Generated ${data.itinerary.days.length} day itinerary in ${data.mode} mode.`);
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

  const totalStops = result?.itinerary.days.reduce((count, day) => {
    return count + day.morning.length + day.afternoon.length + day.evening.length;
  }, 0);

  return (
    <section className="trip-product">
      <aside className="trip-control-panel">
        <div className="panel-title-row">
          <Route size={19} />
          <div>
            <p className="eyebrow">Planner Controls</p>
            <h2>Build a trip</h2>
          </div>
        </div>

        <div className="stack-form">
          <label>
            Destination
            <input value={destination} onChange={(event) => setDestination(event.target.value)} />
          </label>

          <div className="form-grid-two">
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
          </div>

          <fieldset className="interest-fieldset">
            <legend>Interests</legend>
            <div className="interest-grid">
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
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            Constraints
            <textarea value={constraints} onChange={(event) => setConstraints(event.target.value)} />
          </label>

          <button className="button primary wide-button" type="button" onClick={generateTrip} disabled={loading}>
            <Sparkles size={17} />
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>
      </aside>

      <section className="trip-main-panel">
        <div className="trip-status-bar">
          <div>
            <span>Status</span>
            <strong>{status}</strong>
          </div>
          <div>
            <span>Stops</span>
            <strong>{totalStops ?? 0}</strong>
          </div>
          <div>
            <span>Trace steps</span>
            <strong>{result?.trace?.length ?? 0}</strong>
          </div>
        </div>

        {result ? (
          <>
            <div className="trip-toolbar">
              <div>
                <p className="eyebrow">Generated itinerary</p>
                <h2>{result.itinerary.destination}</h2>
              </div>
              <div className="toolbar-actions">
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
                  <Download size={16} />
                  JSON
                </a>
              </div>
            </div>

            <MapPreview points={points} />

            <div className="trip-summary">
              <p>{result.itinerary.summary}</p>
            </div>

            <div className="trip-days">
              {filteredDays.map((day) => (
                <DayCard key={day.day} day={day} />
              ))}
            </div>

            <section className="sources-list">
              <h2>Sources</h2>
              {result.itinerary.sources?.map((source) => (
                <a key={`${source.title}-${source.url}`} href={source.url}>
                  {source.title}
                </a>
              ))}
            </section>
          </>
        ) : (
          <div className="trip-empty-state">
            <MapPin size={30} />
            <h2>No itinerary generated yet</h2>
            <p>Use the controls to generate a route-backed trip plan. Results, sources, and trace output stay visible here.</p>
          </div>
        )}
      </section>

      <aside className="trip-trace-panel">
        <div className="panel-title-row">
          <Activity size={19} />
          <div>
            <p className="eyebrow">Agent Trace</p>
            <h2>Execution</h2>
          </div>
        </div>
        {result?.trace?.map((trace, index) => (
          <div className="trace-card" key={`${trace.step}-${index}`}>
            <div>
              <strong>{trace.step}</strong>
              <span>{trace.ms} ms</span>
            </div>
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
    <div className="live-map trip-map">
      <div className="live-map-grid">
        <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points={points
              .map((point) => {
                const x = ((point.lon - minLon) / Math.max(maxLon - minLon, 0.0001)) * 78 + 11;
                const y = 89 - ((point.lat - minLat) / Math.max(maxLat - minLat, 0.0001)) * 78;
                return `${x},${y}`;
              })
              .join(" ")}
          />
        </svg>
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
      <div className="live-map-caption">{points.length} itinerary stops shown in visit order.</div>
    </div>
  );
}

function DayCard({ day }: { day: ItineraryDay }) {
  return (
    <article className="trip-day-card">
      <div className="day-heading">
        <span>Day {day.day}</span>
        <h2>{day.theme}</h2>
      </div>
      <div className="trip-block-grid">
        {(["morning", "afternoon", "evening"] as const).map((block) => (
          <section key={block} className="trip-block">
            <h3>{block}</h3>
            {day[block].map((item) => (
              <div className="poi-card" key={`${block}-${item.poi_id}`}>
                <strong>{item.name}</strong>
                <span>{item.category}</span>
                <p>{item.why}</p>
                <a href={item.url}>Open source</a>
                <div className="vote-row" aria-label={`Feedback for ${item.name}`}>
                  <button type="button" aria-label="Upvote">
                    <ThumbsUp size={14} />
                  </button>
                  <button type="button" aria-label="Downvote">
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
