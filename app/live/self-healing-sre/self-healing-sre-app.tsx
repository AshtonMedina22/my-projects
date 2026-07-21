"use client";

import { useMemo, useState } from "react";
import type { SelfHealingSreResult } from "../../../lib/types/self-healing-sre";

const INCIDENT_QUEUE = [
  {
    id: "INC-API-2026-071",
    service: "checkout-api",
    title: "Checkout API latency spike after release",
    badge: "Rollback",
  },
  {
    id: "INC-WORKER-2026-044",
    service: "fulfillment-worker",
    title: "Queue worker CPU overload and backlog growth",
    badge: "Scale",
  },
  {
    id: "INC-DB-2026-119",
    service: "payments-db",
    title: "Payment database connection saturation",
    badge: "DB Gate",
  },
];

const DEFAULT_CUSTOM_SIGNAL =
  "CloudWatch alarm: checkout-api p95 latency 2840ms above 950ms threshold after release-2026.07.21. Logs show heap_used=92%, request_timeout, and retry_budget_exhausted=true.";

export default function SelfHealingSreApp() {
  const [incidentId, setIncidentId] = useState(INCIDENT_QUEUE[0].id);
  const [useCustomSignal, setUseCustomSignal] = useState(false);
  const [customSignal, setCustomSignal] = useState(DEFAULT_CUSTOM_SIGNAL);
  const [operatorPrompt, setOperatorPrompt] = useState(
    "Find root cause, compare rollback versus scale-out, and preserve human approval for risky infrastructure changes.",
  );
  const [result, setResult] = useState<SelfHealingSreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");

  const selectedIncident = useMemo(
    () => INCIDENT_QUEUE.find((incident) => incident.id === incidentId) ?? INCIDENT_QUEUE[0],
    [incidentId],
  );

  async function runDiagnosis() {
    setLoading(true);
    setError("");
    setApproved(false);

    try {
      const response = await fetch("/api/self-healing-sre/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId,
          customSignal: useCustomSignal ? customSignal : undefined,
          operatorPrompt,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Self-healing SRE diagnosis failed.");
      }
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Self-healing SRE diagnosis failed.");
    } finally {
      setLoading(false);
    }
  }

  const approvalRequired = result?.remediation.approval_required ?? false;
  const statusLabel = result?.status.replaceAll("_", " ") ?? selectedIncident.badge;

  return (
    <section className="sre-workspace">
      <aside className="sre-incident-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">CloudWatch Queue</p>
            <h2>Incident intake</h2>
          </div>
          <span className="mode-pill">3 active</span>
        </div>

        <div className="sre-incident-list">
          {INCIDENT_QUEUE.map((incident) => (
            <button
              className={`sre-incident-card ${incident.id === incidentId ? "active" : ""}`}
              key={incident.id}
              type="button"
              onClick={() => {
                setIncidentId(incident.id);
                setResult(null);
                setApproved(false);
              }}
            >
              <span>
                <strong>{incident.title}</strong>
                <em>{incident.service}</em>
              </span>
              <small>{incident.badge}</small>
            </button>
          ))}
        </div>

        <label className="toggle-line">
          <input
            checked={useCustomSignal}
            type="checkbox"
            onChange={(event) => setUseCustomSignal(event.target.checked)}
          />
          Use custom CloudWatch signal
        </label>

        {useCustomSignal ? (
          <label className="field-label">
            CloudWatch log excerpt
            <textarea value={customSignal} onChange={(event) => setCustomSignal(event.target.value)} />
          </label>
        ) : null}

        <label className="field-label">
          Operator instruction
          <textarea value={operatorPrompt} onChange={(event) => setOperatorPrompt(event.target.value)} />
        </label>

        <button className="button primary wide-button" type="button" onClick={runDiagnosis} disabled={loading}>
          {loading ? "Running SRE agents..." : "Run SRE Diagnosis"}
        </button>

        {error ? <p className="error-text">{error}</p> : null}
      </aside>

      <section className="sre-main-panel">
        <div className="sre-readout-grid">
          <Readout label="Incident" value={result?.incident.id.replace("INC-", "") ?? selectedIncident.id.replace("INC-", "")} />
          <Readout label="Status" value={statusLabel} />
          <Readout label="Confidence" value={result ? `${Math.round(result.metrics.confidence * 100)}%` : "--"} />
          <Readout label="MTTR Target" value={result ? `${result.metrics.mttr_minutes}m` : "--"} />
        </div>

        <article className="sre-decision-card">
          <div>
            <p className="eyebrow">Incident Decision</p>
            <h2>{result?.selected_hypothesis.claim ?? "Ready for multi-agent root-cause debate"}</h2>
            <p>
              {result?.operator_notice ??
                "Choose an incident and run the SRE workflow to correlate alarms, challenge hypotheses, and produce a governed remediation plan."}
            </p>
          </div>
          <div className={`sre-approval-box ${approvalRequired ? "hold" : ""}`}>
            <span>Execution gate</span>
            <strong>{approved ? "APPROVED" : approvalRequired ? "HUMAN APPROVAL" : result ? "AUTO-ELIGIBLE" : "PENDING"}</strong>
            <button
              className="button secondary"
              type="button"
              disabled={!result || !approvalRequired || approved}
              onClick={() => setApproved(true)}
            >
              Approve Action
            </button>
          </div>
        </article>

        <div className="sre-grid">
          <article className="sre-card">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Topology</p>
                <h2>Blast-radius map</h2>
              </div>
              <span className="mode-pill">{result?.severity ?? "standby"}</span>
            </div>
            <div className="sre-topology" aria-label="Incident topology">
              {["alb", "checkout-api", "fulfillment-worker", "payments-db", "terraform-gate"].map((node) => {
                const active =
                  result?.incident.service === node ||
                  (node === "terraform-gate" && result?.remediation.approval_required) ||
                  (!result && node === selectedIncident.service);
                return (
                  <div className={`sre-node ${active ? "active" : ""}`} key={node}>
                    <span>{node}</span>
                  </div>
                );
              })}
              <div className="sre-path" />
            </div>
          </article>

          <article className="sre-card">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Remediation</p>
                <h2>Terraform/CDK action</h2>
              </div>
              <span className="mode-pill">guarded</span>
            </div>
            {result ? (
              <div className="sre-remediation-card">
                <span>{result.remediation.action}</span>
                <strong>{result.remediation.terraform_target}</strong>
                <pre>{result.remediation.command}</pre>
                <ul>
                  {result.remediation.validation_checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="empty-state">
                <strong>No remediation plan yet.</strong>
                <span>Run the agent workflow to generate the gated action plan.</span>
              </div>
            )}
          </article>
        </div>

        <div className="sre-grid lower">
          <article className="sre-card">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Debate Pattern</p>
                <h2>Root-cause hypotheses</h2>
              </div>
              <span className="mode-pill">multi-agent</span>
            </div>
            {result ? (
              <div className="sre-hypothesis-list">
                {result.hypotheses.map((hypothesis) => (
                  <section className={`sre-hypothesis-card ${hypothesis.verdict}`} key={hypothesis.id}>
                    <div>
                      <strong>{hypothesis.id}</strong>
                      <span>{Math.round(hypothesis.confidence * 100)}%</span>
                    </div>
                    <h3>{hypothesis.claim}</h3>
                    <ul>
                      {hypothesis.evidence.map((evidence) => (
                        <li key={evidence}>{evidence}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <strong>No hypotheses yet.</strong>
                <span>Investigator and challenger agents populate here.</span>
              </div>
            )}
          </article>

          <article className="sre-card">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">DeepEval Audit</p>
                <h2>Reasoning checks</h2>
              </div>
              <span className="mode-pill">{result ? `${Math.round(result.deepeval.score * 100)}%` : "audit"}</span>
            </div>
            {result ? (
              <div className="sre-audit-list">
                {result.deepeval.checks.map((check) => (
                  <section className={`sre-audit-card ${check.result}`} key={check.name}>
                    <strong>{check.name}</strong>
                    <span>{check.result}</span>
                    <p>{check.detail}</p>
                  </section>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <strong>No audit trace yet.</strong>
                <span>Safety checks run after remediation planning.</span>
              </div>
            )}
          </article>
        </div>

        <article className="sre-card">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Execution Trace</p>
              <h2>Agent handoff log</h2>
            </div>
            <span className="mode-pill">{result?.mode ?? "demo"}</span>
          </div>
          {result ? (
            <div className="sre-trace-list">
              {result.trace.map((step) => (
                <section className={`sre-trace-step ${step.status}`} key={step.agent}>
                  <div>
                    <strong>{step.agent}</strong>
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
              <strong>No handoff log yet.</strong>
              <span>CloudWatch, diagnosis, remediation, and audit steps appear here.</span>
            </div>
          )}
        </article>
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
