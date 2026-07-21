export type PayFlowStatus = "READY_FOR_APPROVAL" | "FLAGGED" | "ON_HOLD";

export interface InvoiceRecord {
  id: string;
  vendor: string;
  invoice_number: string;
  po_number: string;
  receipt_id?: string;
  amount: number;
  currency: "USD";
  due_date: string;
  received_date: string;
  terms: string;
  line_items: Array<{
    sku: string;
    description: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface PurchaseOrderRecord {
  po_number: string;
  vendor: string;
  authorized_total: number;
  budget_owner: string;
  cost_center: string;
  status: "open" | "closed" | "blocked";
}

export interface ReceiptRecord {
  receipt_id: string;
  po_number: string;
  tracking_number: string;
  carrier: "UPS Freight" | "FedEx" | "DHL" | "Internal Receiving";
  delivered: boolean;
  signed_by?: string;
  received_total: number;
  received_date: string;
}

export interface PayFlowTraceStep {
  tool: string;
  label: string;
  status: "complete" | "warning" | "blocked";
  detail: string;
  payload: Record<string, unknown>;
  duration_ms: number;
}

export interface PayFlowAuditResult {
  mode: "openai" | "demo";
  generated_at: string;
  status: PayFlowStatus;
  invoice: InvoiceRecord;
  po?: PurchaseOrderRecord;
  receipt?: ReceiptRecord;
  variance_pct: number;
  risk_score: number;
  early_pay_discount: number;
  settlement_amount: number;
  requires_human_approval: boolean;
  decision: string;
  supplier_notice: string;
  trace: PayFlowTraceStep[];
  controls: Array<{
    control_id: string;
    name: string;
    result: "pass" | "review" | "fail";
    evidence: string;
  }>;
}
