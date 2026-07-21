import type {
  InvoiceRecord,
  PayFlowAuditResult,
  PayFlowStatus,
  PayFlowTraceStep,
  PurchaseOrderRecord,
  ReceiptRecord,
} from "../types/payflow";

export const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: "INV-2026-X1",
    vendor: "Global Logistics Corp",
    invoice_number: "INV-772",
    po_number: "PO-8827-BC",
    receipt_id: "RCV-22091",
    amount: 14200.5,
    currency: "USD",
    due_date: "2026-08-10",
    received_date: "2026-07-21",
    terms: "2/10 Net 30",
    line_items: [
      { sku: "FRT-LTL", description: "Cross-jurisdictional freight", quantity: 1, unit_price: 11800.5 },
      { sku: "CUS-CLR", description: "Customs clearance and handling", quantity: 1, unit_price: 2400 },
    ],
  },
  {
    id: "INV-2026-CLOUD",
    vendor: "CloudStack Systems",
    invoice_number: "INV-881",
    po_number: "PO-9912-AF",
    receipt_id: "RCV-22077",
    amount: 4250,
    currency: "USD",
    due_date: "2026-08-04",
    received_date: "2026-07-20",
    terms: "Net 30",
    line_items: [{ sku: "OBS-LOG", description: "Cloud observability package", quantity: 1, unit_price: 4250 }],
  },
  {
    id: "INV-2026-OFFICE",
    vendor: "Office Depot Business",
    invoice_number: "INV-906",
    po_number: "PO-7710-SM",
    amount: 920,
    currency: "USD",
    due_date: "2026-08-02",
    received_date: "2026-07-19",
    terms: "Net 15",
    line_items: [{ sku: "OFF-KIT", description: "Workspace supply kits", quantity: 20, unit_price: 46 }],
  },
];

const PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    po_number: "PO-8827-BC",
    vendor: "Global Logistics Corp",
    authorized_total: 14200.5,
    budget_owner: "Marisol Vega",
    cost_center: "LOG-NA-443",
    status: "open",
  },
  {
    po_number: "PO-9912-AF",
    vendor: "CloudStack Systems",
    authorized_total: 3990,
    budget_owner: "DevOps Platform",
    cost_center: "ENG-CLOUD-102",
    status: "open",
  },
  {
    po_number: "PO-7710-SM",
    vendor: "Office Depot Business",
    authorized_total: 920,
    budget_owner: "Operations",
    cost_center: "OPS-GEN-001",
    status: "open",
  },
];

const RECEIPTS: ReceiptRecord[] = [
  {
    receipt_id: "RCV-22091",
    po_number: "PO-8827-BC",
    tracking_number: "1Z99-SHIP-001",
    carrier: "UPS Freight",
    delivered: true,
    signed_by: "D. Martinez",
    received_total: 14200.5,
    received_date: "2026-07-20",
  },
  {
    receipt_id: "RCV-22077",
    po_number: "PO-9912-AF",
    tracking_number: "FX-4410-OBS",
    carrier: "FedEx",
    delivered: true,
    signed_by: "A. Cho",
    received_total: 3990,
    received_date: "2026-07-19",
  },
];

export function runPayFlowAudit(invoiceId = MOCK_INVOICES[0].id): PayFlowAuditResult {
  const invoice = MOCK_INVOICES.find((item) => item.id === invoiceId) ?? MOCK_INVOICES[0];
  const po = PURCHASE_ORDERS.find((item) => item.po_number === invoice.po_number);
  const receipt = invoice.receipt_id ? RECEIPTS.find((item) => item.receipt_id === invoice.receipt_id) : undefined;
  const variancePct = po ? Math.abs(invoice.amount - po.authorized_total) / po.authorized_total : 1;
  const receiptMatched = Boolean(receipt?.delivered && receipt.received_total === invoice.amount);
  const poMatched = Boolean(po && po.vendor === invoice.vendor && po.status === "open");
  const earlyPayDiscount = invoice.terms.includes("2/10") ? Number((invoice.amount * 0.02).toFixed(2)) : 0;
  const settlementAmount = Number((invoice.amount - earlyPayDiscount).toFixed(2));
  const riskScore = calculateRiskScore({ poMatched, receiptMatched, variancePct, poBlocked: po?.status === "blocked" });
  const status = decideStatus({ poMatched, receiptMatched, variancePct });
  const requiresHumanApproval = status === "READY_FOR_APPROVAL";

  return {
    mode: "demo",
    generated_at: new Date().toISOString(),
    status,
    invoice,
    po,
    receipt,
    variance_pct: Number((variancePct * 100).toFixed(2)),
    risk_score: riskScore,
    early_pay_discount: earlyPayDiscount,
    settlement_amount: settlementAmount,
    requires_human_approval: requiresHumanApproval,
    decision: buildDecision(status, variancePct, receiptMatched, earlyPayDiscount),
    supplier_notice: buildSupplierNotice(status, invoice, settlementAmount, earlyPayDiscount),
    trace: buildTrace(invoice, po, receipt, variancePct, status),
    controls: buildControls(poMatched, receiptMatched, variancePct, requiresHumanApproval),
  };
}

export function enrichPayFlowSummary(result: PayFlowAuditResult, summary: string): PayFlowAuditResult {
  return {
    ...result,
    mode: "openai",
    decision: summary,
  };
}

function decideStatus(input: { poMatched: boolean; receiptMatched: boolean; variancePct: number }): PayFlowStatus {
  if (!input.poMatched || input.variancePct > 0.05) return "FLAGGED";
  if (!input.receiptMatched) return "ON_HOLD";
  return "READY_FOR_APPROVAL";
}

function calculateRiskScore(input: {
  poMatched: boolean;
  receiptMatched: boolean;
  variancePct: number;
  poBlocked: boolean;
}) {
  let score = 0.08;
  if (!input.poMatched) score += 0.42;
  if (!input.receiptMatched) score += 0.28;
  if (input.variancePct > 0.05) score += 0.36;
  if (input.poBlocked) score += 0.22;
  return Number(Math.min(0.98, score).toFixed(2));
}

function buildDecision(status: PayFlowStatus, variancePct: number, receiptMatched: boolean, discount: number) {
  if (status === "FLAGGED") {
    return `Invoice requires AP review because the PO variance is ${(variancePct * 100).toFixed(2)}%, above the 5% tolerance. Do not approve payment.`;
  }
  if (status === "ON_HOLD") {
    return "Invoice is on hold because receiving evidence is missing or does not match the invoice total.";
  }
  return `3-way match passed${receiptMatched ? " with confirmed delivery" : ""}. Route to human approval before remittance; early-pay discount available: $${discount.toFixed(2)}.`;
}

function buildSupplierNotice(status: PayFlowStatus, invoice: InvoiceRecord, settlementAmount: number, discount: number) {
  if (status === "FLAGGED") {
    return `Draft to ${invoice.vendor}: We are reviewing invoice ${invoice.invoice_number} because the amount differs from the purchase order. We will follow up after AP validation.`;
  }
  if (status === "ON_HOLD") {
    return `Draft to ${invoice.vendor}: Invoice ${invoice.invoice_number} is received, but payment is pending receiving confirmation for ${invoice.po_number}.`;
  }
  return `Draft to ${invoice.vendor}: Invoice ${invoice.invoice_number} has passed AP matching and is queued for approval. Expected settlement is $${settlementAmount.toFixed(2)}${discount ? ` after a $${discount.toFixed(2)} early-pay discount` : ""}.`;
}

function buildTrace(
  invoice: InvoiceRecord,
  po: PurchaseOrderRecord | undefined,
  receipt: ReceiptRecord | undefined,
  variancePct: number,
  status: PayFlowStatus,
): PayFlowTraceStep[] {
  return [
    {
      tool: "MCP.Oracle.get_invoice",
      label: "Invoice ingestion",
      status: "complete",
      detail: `Parsed ${invoice.invoice_number} from ${invoice.vendor} and linked it to ${invoice.po_number}.`,
      payload: { invoice_id: invoice.id, invoice_total: invoice.amount, terms: invoice.terms },
      duration_ms: 188,
    },
    {
      tool: "MCP.Oracle.get_purchase_order",
      label: "PO validation",
      status: po && variancePct <= 0.05 ? "complete" : "warning",
      detail: po
        ? `Matched PO owner ${po.budget_owner}; variance is ${(variancePct * 100).toFixed(2)}%.`
        : "No purchase order record found.",
      payload: po ? { ...po } : { po_number: invoice.po_number, status: "not_found" },
      duration_ms: 231,
    },
    {
      tool: "MCP.Receiving.verify_receipt",
      label: "Receipt confirmation",
      status: receipt?.delivered && receipt.received_total === invoice.amount ? "complete" : "warning",
      detail: receipt
        ? `Delivery ${receipt.tracking_number} was ${receipt.delivered ? "confirmed" : "not confirmed"} by ${receipt.signed_by ?? "unknown receiver"}.`
        : "No receiving record attached to this invoice.",
      payload: receipt ? { ...receipt } : { receipt_id: invoice.receipt_id ?? "missing" },
      duration_ms: 274,
    },
    {
      tool: "Agent.ValidationLoop.route_decision",
      label: "Human approval gate",
      status: status === "FLAGGED" ? "blocked" : status === "ON_HOLD" ? "warning" : "complete",
      detail:
        status === "READY_FOR_APPROVAL"
          ? "Remittance-sensitive action is prepared but requires human authorization."
          : "Workflow stopped before remittance approval.",
      payload: { status, human_approval_required: status === "READY_FOR_APPROVAL" },
      duration_ms: 116,
    },
  ];
}

function buildControls(poMatched: boolean, receiptMatched: boolean, variancePct: number, approvalRequired: boolean) {
  return [
    {
      control_id: "AP-3WAY-001",
      name: "Three-way match",
      result: poMatched && receiptMatched && variancePct <= 0.05 ? ("pass" as const) : ("review" as const),
      evidence: "Invoice, purchase order, and receiving record compared through MCP tool calls.",
    },
    {
      control_id: "SOX-404-AP",
      name: "Remittance approval segregation",
      result: approvalRequired ? ("review" as const) : ("pass" as const),
      evidence: approvalRequired
        ? "Agent prepared recommendation but did not execute payment."
        : "No remittance action is available while the invoice is blocked or on hold.",
    },
    {
      control_id: "VAR-005",
      name: "Price variance tolerance",
      result: variancePct <= 0.05 ? ("pass" as const) : ("fail" as const),
      evidence: `Variance measured at ${(variancePct * 100).toFixed(2)}% against the authorized PO total.`,
    },
  ];
}
