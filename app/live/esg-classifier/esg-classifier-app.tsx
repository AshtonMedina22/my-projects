"use client";

import { useMemo, useState } from "react";
import type { ESGClassificationResponse, RawERPTransaction } from "../../../lib/types/esg";

const INITIAL_TRANSACTIONS: RawERPTransaction[] = [
  {
    id: "TXN-001",
    source_system: "Dynamics365",
    vendor_name: "Shell Aviation",
    description: "Regional Jet Fuel - Jet A1 refill for field operations",
    amount: 5000,
    currency: "L",
    transaction_date: "2026-07-15",
  },
  {
    id: "TXN-002",
    source_system: "Dynamics365",
    vendor_name: "Amazon Web Services",
    description: "EC2 Instance Usage - US-East-1 production workloads",
    amount: 1200,
    currency: "hr",
    transaction_date: "2026-07-20",
  },
  {
    id: "TXN-003",
    source_system: "Dynamics365",
    vendor_name: "Staples",
    description: "Recycled Paper Reams and general office supplies",
    amount: 450,
    currency: "USD",
    transaction_date: "2026-07-18",
  },
  {
    id: "TXN-004",
    source_system: "SAP",
    vendor_name: "North Texas Electric",
    description: "Purchased electricity for warehouse distribution center",
    amount: 18800,
    currency: "kWh",
    transaction_date: "2026-07-12",
  },
];

export default function EsgClassifierApp() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedId, setSelectedId] = useState(INITIAL_TRANSACTIONS[0].id);
  const [analystPrompt, setAnalystPrompt] = useState(
    "Prioritize audit risk and identify the largest emissions exposure.",
  );
  const [result, setResult] = useState<ESGClassificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTransaction = useMemo(
    () => transactions.find((transaction) => transaction.id === selectedId) ?? transactions[0],
    [selectedId, transactions],
  );

  async function runClassification() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/esg/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions, analystPrompt }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "ESG classification failed.");
      }

      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ESG classification failed.");
    } finally {
      setLoading(false);
    }
  }

  function updateSelected(field: keyof RawERPTransaction, value: string) {
    setTransactions((current) =>
      current.map((transaction) => {
        if (transaction.id !== selectedTransaction.id) return transaction;
        if (field === "amount") return { ...transaction, amount: Number(value) || 0 };
        return { ...transaction, [field]: value };
      }),
    );
  }

  return (
    <section className="esg-workspace">
      <aside className="esg-control-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">ERP Intake</p>
            <h2>Transaction stream</h2>
          </div>
          <span className="mode-pill">MCP mock</span>
        </div>

        <label className="field-label">
          Active transaction
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {transactions.map((transaction) => (
              <option key={transaction.id} value={transaction.id}>
                {transaction.id} / {transaction.vendor_name}
              </option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Vendor
          <input value={selectedTransaction.vendor_name} onChange={(event) => updateSelected("vendor_name", event.target.value)} />
        </label>

        <label className="field-label">
          Description
          <textarea
            value={selectedTransaction.description}
            onChange={(event) => updateSelected("description", event.target.value)}
          />
        </label>

        <div className="esg-form-grid">
          <label className="field-label">
            Amount
            <input
              inputMode="decimal"
              value={selectedTransaction.amount}
              onChange={(event) => updateSelected("amount", event.target.value)}
            />
          </label>
          <label className="field-label">
            Unit
            <select
              value={selectedTransaction.currency}
              onChange={(event) => updateSelected("currency", event.target.value)}
            >
              {["USD", "L", "kWh", "hr", "kg"].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field-label">
          Analyst instruction
          <textarea value={analystPrompt} onChange={(event) => setAnalystPrompt(event.target.value)} />
        </label>

        <button className="button primary wide-button" type="button" onClick={runClassification} disabled={loading}>
          {loading ? "Running audit..." : "Run ESG Classification"}
        </button>

        {error ? <p className="error-text">{error}</p> : null}
      </aside>

      <section className="esg-results-panel">
        <div className="esg-readout-grid">
          <Readout label="Mode" value={result?.mode === "openai" ? "OpenAI" : "Demo"} />
          <Readout label="Classified" value={String(result?.audit_readiness.classified_count ?? transactions.length)} />
          <Readout
            label="kgCO2e"
            value={formatNumber(result?.audit_readiness.total_kg_co2e ?? 0)}
          />
          <Readout label="Review flags" value={String(result?.audit_readiness.high_risk_count ?? 0)} />
        </div>

        <article className="esg-summary-card">
          <p className="eyebrow">Executive Summary</p>
          <h2>{result ? "Audit-ready classification output" : "Ready to classify ERP spend"}</h2>
          <p>
            {result?.summary ??
              "Run the classifier to map spend descriptions into Scope 1, 2, and 3 categories with reasoning traces and framework mappings."}
          </p>
        </article>

        <div className="esg-output-grid">
          <section className="esg-table-card">
            <div className="panel-title-row">
              <h2>Classification ledger</h2>
              <span className="mode-pill">audit trail</span>
            </div>
            <div className="esg-ledger">
              {(result?.classifications ?? []).map((item) => (
                <article className="esg-ledger-row" key={item.id}>
                  <div>
                    <strong>{item.id}</strong>
                    <span>{item.vendor_name}</span>
                  </div>
                  <div>
                    <strong>{item.classification.category}</strong>
                    <span>{item.classification.scope}</span>
                  </div>
                  <div>
                    <strong>{formatNumber(item.classification.calculated_footprint)} kgCO2e</strong>
                    <span>{item.classification.ghg_factor} {item.classification.factor_unit}</span>
                  </div>
                  <div>
                    <strong>{Math.round(item.audit_metadata.reasoning_trace.confidence_score * 100)}%</strong>
                    <span>{item.audit_metadata.is_verified ? "Verified" : "Review"}</span>
                  </div>
                </article>
              ))}
              {!result ? (
                <div className="empty-state">
                  <strong>No ledger output yet.</strong>
                  <span>Click Run ESG Classification to generate audit entries.</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="esg-table-card">
            <div className="panel-title-row">
              <h2>MCP tool trace</h2>
              <span className="mode-pill">agent ops</span>
            </div>
            <div className="trace-stack">
              {(result?.tool_trace ?? [
                {
                  tool: "fetch_erp_transactions",
                  status: "complete",
                  details: "Waiting for run.",
                  duration_ms: 0,
                },
                {
                  tool: "get_ghg_emission_factor",
                  status: "complete",
                  details: "Waiting for run.",
                  duration_ms: 0,
                },
                {
                  tool: "record_audit_entry",
                  status: "review",
                  details: "Waiting for run.",
                  duration_ms: 0,
                },
              ]).map((trace) => (
                <article className="trace-card" key={trace.tool}>
                  <div>
                    <strong>{trace.tool}</strong>
                    <span>{trace.duration_ms}ms</span>
                  </div>
                  <p>{trace.details}</p>
                  <em>{trace.status}</em>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="esg-materiality-card">
          <div className="panel-title-row">
            <h2>Double materiality monitor</h2>
            <span className="mode-pill">CSRD lens</span>
          </div>
          <div className="materiality-grid">
            {(result?.materiality ?? []).map((metric) => (
              <article className="architecture-card" key={metric.metric_name}>
                <h3>{metric.metric_name}</h3>
                <p>{metric.description}</p>
                <div className="mini-bars">
                  <span style={{ width: `${metric.financial_impact_score * 10}%` }} />
                  <span style={{ width: `${metric.environmental_impact_score * 10}%` }} />
                </div>
                <strong>{metric.status}</strong>
              </article>
            ))}
            {!result ? (
              <article className="architecture-card">
                <h3>Awaiting classification</h3>
                <p>Materiality scores populate after the serverless classifier returns validated ESG records.</p>
                <strong>READY</strong>
              </article>
            ) : null}
          </div>
        </section>
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}
