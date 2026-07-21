"use client";

import { useMemo, useState } from "react";
import type { PayFlowAuditResult } from "../../../lib/types/payflow";

const INVOICE_QUEUE = [
  {
    id: "INV-2026-X1",
    vendor: "Global Logistics Corp",
    amount: 14200.5,
    po: "PO-8827-BC",
    badge: "Ready",
  },
  {
    id: "INV-2026-CLOUD",
    vendor: "CloudStack Systems",
    amount: 4250,
    po: "PO-9912-AF",
    badge: "Anomaly",
  },
  {
    id: "INV-2026-OFFICE",
    vendor: "Office Depot Business",
    amount: 920,
    po: "PO-7710-SM",
    badge: "Receipt hold",
  },
];

export default function PayFlowApp() {
  const [invoiceId, setInvoiceId] = useState(INVOICE_QUEUE[0].id);
  const [analystPrompt, setAnalystPrompt] = useState(
    "Show whether this invoice can move to approval and draft the supplier response.",
  );
  const [result, setResult] = useState<PayFlowAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [approvalRecorded, setApprovalRecorded] = useState(false);
  const [error, setError] = useState("");

  const selectedInvoice = useMemo(
    () => INVOICE_QUEUE.find((invoice) => invoice.id === invoiceId) ?? INVOICE_QUEUE[0],
    [invoiceId],
  );

  async function runAudit() {
    setLoading(true);
    setError("");
    setApprovalRecorded(false);

    try {
      const response = await fetch("/api/payflow/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, analystPrompt }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "PayFlow audit failed.");
      }
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "PayFlow audit failed.");
    } finally {
      setLoading(false);
    }
  }

  const statusLabel = result?.status.replaceAll("_", " ") ?? selectedInvoice.badge;

  return (
    <section className="payflow-workspace">
      <aside className="payflow-queue-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Inbound Queue</p>
            <h2>Invoice feed</h2>
          </div>
          <span className="mode-pill">3 active</span>
        </div>

        <div className="payflow-invoice-list">
          {INVOICE_QUEUE.map((invoice) => (
            <button
              className={`payflow-invoice-card ${invoice.id === invoiceId ? "active" : ""}`}
              key={invoice.id}
              type="button"
              onClick={() => {
                setInvoiceId(invoice.id);
                setResult(null);
                setApprovalRecorded(false);
              }}
            >
              <span>
                <strong>{invoice.vendor}</strong>
                <em>{invoice.po}</em>
              </span>
              <span>
                <strong>{formatCurrency(invoice.amount)}</strong>
                <em>{invoice.badge}</em>
              </span>
            </button>
          ))}
        </div>

        <label className="field-label">
          Audit instruction
          <textarea value={analystPrompt} onChange={(event) => setAnalystPrompt(event.target.value)} />
        </label>

        <button className="button primary wide-button" type="button" onClick={runAudit} disabled={loading}>
          {loading ? "Executing toolchain..." : "Execute Verification"}
        </button>

        {error ? <p className="error-text">{error}</p> : null}
      </aside>

      <section className="payflow-main-panel">
        <div className="payflow-readout-grid">
          <Readout label="Invoice" value={selectedInvoice.id.replace("INV-2026-", "")} />
          <Readout label="Status" value={statusLabel} />
          <Readout label="Risk" value={result ? `${Math.round(result.risk_score * 100)}%` : "--"} />
          <Readout label="Settlement" value={result ? formatCurrency(result.settlement_amount) : formatCurrency(selectedInvoice.amount)} />
        </div>

        <article className="payflow-decision-card">
          <div>
            <p className="eyebrow">Agent Decision</p>
            <h2>{result ? result.status.replaceAll("_", " ") : "Ready to run AP controls"}</h2>
            <p>
              {result?.decision ??
                "Select an invoice and execute verification to run PO matching, receipt validation, variance checks, and supplier notice drafting."}
            </p>
          </div>
          <div className="payflow-approval-box">
            <span>Human approval gate</span>
            <strong>
              {approvalRecorded
                ? "APPROVED"
                : result?.requires_human_approval
                  ? "REQUIRED"
                  : result
                    ? "BLOCKED"
                    : "WAITING"}
            </strong>
            <button
              className="button"
              type="button"
              disabled={!result?.requires_human_approval || approvalRecorded}
              onClick={() => setApprovalRecorded(true)}
            >
              Record Approval
            </button>
          </div>
        </article>

        <div className="payflow-grid">
          <section className="payflow-card">
            <div className="panel-title-row">
              <h2>Autonomous reasoning trace</h2>
              <span className="mode-pill">MCP tools</span>
            </div>
            <div className="payflow-trace-list">
              {(result?.trace ?? []).map((step) => (
                <article className={`payflow-trace-step ${step.status}`} key={step.tool}>
                  <div>
                    <strong>{step.tool}</strong>
                    <span>{step.duration_ms}ms</span>
                  </div>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                  <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                </article>
              ))}
              {!result ? (
                <div className="empty-state">
                  <strong>No trace yet.</strong>
                  <span>Run verification to inspect the tool calls.</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="payflow-card">
            <div className="panel-title-row">
              <h2>Controls and supplier comms</h2>
              <span className="mode-pill">AP ops</span>
            </div>

            <div className="control-list">
              {(result?.controls ?? []).map((control) => (
                <article className={`control-card ${control.result}`} key={control.control_id}>
                  <strong>{control.control_id}</strong>
                  <h3>{control.name}</h3>
                  <p>{control.evidence}</p>
                  <span>{control.result}</span>
                </article>
              ))}
              {!result ? (
                <article className="control-card review">
                  <strong>AP-READY</strong>
                  <h3>Waiting for audit</h3>
                  <p>Controls populate after the serverless PayFlow agent runs.</p>
                  <span>ready</span>
                </article>
              ) : null}
            </div>

            <div className="supplier-notice">
              <p className="eyebrow">Supplier Notice Draft</p>
              <p>{result?.supplier_notice ?? "Supplier communication will be drafted from the audit decision."}</p>
            </div>
          </section>
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
