"use client";

import { useMemo, useState } from "react";
import type { RegulatoryTriageResult } from "../../../lib/types/reg-triage";

const FEED_QUEUE = [
  {
    id: "REG-EU-AI-2026-071",
    source: "EU Commission",
    title: "EU AI Act incident reporting window",
    badge: "AI risk",
  },
  {
    id: "REG-US-PRIV-2026-044",
    source: "State Privacy Board",
    title: "Consumer opt-out and profiling disclosure",
    badge: "Privacy",
  },
  {
    id: "REG-XBORDER-2026-119",
    source: "Regology",
    title: "EU supplier diligence vs US minimization",
    badge: "Conflict",
  },
];

const DEFAULT_CUSTOM_TEXT =
  "New EU supplier due diligence guidance requires enhanced vendor documentation for high-risk suppliers, while US privacy commitments restrict unnecessary collection of workforce and contractor personal data.";

export default function RegTriageApp() {
  const [feedId, setFeedId] = useState(FEED_QUEUE[2].id);
  const [useCustomText, setUseCustomText] = useState(false);
  const [customText, setCustomText] = useState(DEFAULT_CUSTOM_TEXT);
  const [analystPrompt, setAnalystPrompt] = useState(
    "Prioritize cross-border conflicts and draft the legal operations escalation.",
  );
  const [result, setResult] = useState<RegulatoryTriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewRecorded, setReviewRecorded] = useState(false);
  const [error, setError] = useState("");

  const selectedFeed = useMemo(() => FEED_QUEUE.find((item) => item.id === feedId) ?? FEED_QUEUE[0], [feedId]);

  async function runTriage() {
    setLoading(true);
    setError("");
    setReviewRecorded(false);

    try {
      const response = await fetch("/api/reg-triage/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedId,
          customText: useCustomText ? customText : undefined,
          analystPrompt,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Regulatory triage failed.");
      }
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Regulatory triage failed.");
    } finally {
      setLoading(false);
    }
  }

  const statusLabel = result?.status.replaceAll("_", " ") ?? selectedFeed.badge;
  const legalHold = result?.status === "CROSS_BORDER_CONFLICT" || result?.status === "LEGAL_REVIEW_REQUIRED";

  return (
    <section className="reg-workspace">
      <aside className="reg-feed-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Regulatory Feed</p>
            <h2>Live intake queue</h2>
          </div>
          <span className="mode-pill">3 active</span>
        </div>

        <div className="reg-feed-list">
          {FEED_QUEUE.map((item) => (
            <button
              className={`reg-feed-card ${item.id === feedId ? "active" : ""}`}
              key={item.id}
              type="button"
              onClick={() => {
                setFeedId(item.id);
                setResult(null);
                setReviewRecorded(false);
              }}
            >
              <span>
                <strong>{item.title}</strong>
                <em>{item.source}</em>
              </span>
              <small>{item.badge}</small>
            </button>
          ))}
        </div>

        <label className="toggle-line">
          <input checked={useCustomText} type="checkbox" onChange={(event) => setUseCustomText(event.target.checked)} />
          Use analyst-submitted regulatory text
        </label>

        {useCustomText ? (
          <label className="field-label">
            Regulatory text
            <textarea value={customText} onChange={(event) => setCustomText(event.target.value)} />
          </label>
        ) : null}

        <label className="field-label">
          Triage instruction
          <textarea value={analystPrompt} onChange={(event) => setAnalystPrompt(event.target.value)} />
        </label>

        <button className="button primary wide-button" type="button" onClick={runTriage} disabled={loading}>
          {loading ? "Running triage graph..." : "Run Regulatory Triage"}
        </button>

        {error ? <p className="error-text">{error}</p> : null}
      </aside>

      <section className="reg-main-panel">
        <div className="reg-readout-grid">
          <Readout label="Feed" value={selectedFeed.id.replace("REG-", "")} />
          <Readout label="Status" value={statusLabel} />
          <Readout label="Impact" value={result ? `${Math.round(result.metrics.impact_score * 100)}%` : "--"} />
          <Readout label="Conflict" value={result ? String(result.metrics.conflicts_found) : "--"} />
        </div>

        <article className="reg-report-card">
          <div>
            <p className="eyebrow">Policy Impact Report</p>
            <h2>{result?.report.title ?? "Ready to analyze compliance lag"}</h2>
            <p>
              {result?.report.executive_summary ??
                "Select a regulatory feed item and run the triage graph to extract requirements, compare controls, detect conflicts, and prepare legal operations escalation."}
            </p>
          </div>
          <div className={`reg-review-box ${legalHold ? "hold" : ""}`}>
            <span>Legal ops gate</span>
            <strong>{reviewRecorded ? "REVIEW RECORDED" : legalHold ? "REVIEW REQUIRED" : "MONITOR"}</strong>
            <button
              className="button secondary"
              type="button"
              disabled={!result || !legalHold || reviewRecorded}
              onClick={() => setReviewRecorded(true)}
            >
              Record Review
            </button>
          </div>
        </article>

        <div className="reg-grid">
          <article className="reg-card">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">LangGraph Trace</p>
                <h2>Node-level execution</h2>
              </div>
              <span className="mode-pill">trace</span>
            </div>
            {result ? (
              <div className="reg-trace-list">
                {result.trace.map((step) => (
                  <section className={`reg-trace-step ${step.status}`} key={step.node}>
                    <div>
                      <strong>{step.node}</strong>
                      <span>{step.duration_ms}ms</span>
                    </div>
                    <h3>{step.label}</h3>
                    <p>{step.detail}</p>
                    <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                  </section>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <strong>No triage trace yet.</strong>
                <span>Run the workflow to inspect every node output.</span>
              </div>
            )}
          </article>

          <aside className="reg-card">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Escalation</p>
                <h2>Controls and Slack</h2>
              </div>
              <span className="mode-pill">legal ops</span>
            </div>

            {result ? (
              <>
                <div className="reg-alert-card">
                  <span>{result.report.ticket_priority}</span>
                  <p>{result.slack_alert}</p>
                </div>

                {result.conflicts.length ? (
                  <div className="reg-conflict-card">
                    <span>Cross-border conflict</span>
                    <strong>{result.conflicts[0].policy_area}</strong>
                    <p>{result.conflicts[0].recommended_action}</p>
                  </div>
                ) : null}

                <div className="reg-control-list">
                  {result.impacted_controls.map((control) => (
                    <article className="reg-control-card" key={control.control_id}>
                      <span>{control.control_id}</span>
                      <h3>{control.policy}</h3>
                      <p>{control.required_change}</p>
                      <strong>{Math.round(control.gap_score * 100)}% gap</strong>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="reg-alert-card">
                <span>PENDING</span>
                <p>Slack alert, impacted controls, and legal review tickets populate after triage.</p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <article className="signal-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
