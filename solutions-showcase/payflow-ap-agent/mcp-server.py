"""
PayFlow MCP Server Artifact

This local server mirrors the live Next.js PayFlow project. In production,
the same tool boundaries would connect to Oracle ERP or Sage Intacct, a
receiving system, and a payment approval workflow.
"""

from typing import Any

from fastmcp import FastMCP
from pydantic import BaseModel, Field


mcp = FastMCP("PayFlow-AP-Agent", version="2026.07.21")


class AuditResult(BaseModel):
    status: str = Field(description="READY_FOR_APPROVAL, FLAGGED, or ON_HOLD")
    variance_pct: float = Field(description="Invoice-to-PO variance percentage")
    risk_score: float = Field(ge=0, le=1, description="AP operational risk score")
    human_approval_required: bool = Field(description="True before any remittance action")
    trace: list[str] = Field(description="Reasoning trace for AP auditability")


ERP_RECORDS: list[dict[str, Any]] = [
    {
        "invoice_id": "INV-2026-X1",
        "vendor": "Global Logistics Corp",
        "po": "PO-8827-BC",
        "invoice_total": 14200.50,
        "po_total": 14200.50,
        "receipt_total": 14200.50,
        "receipt_confirmed": True,
        "terms": "2/10 Net 30",
    },
    {
        "invoice_id": "INV-2026-CLOUD",
        "vendor": "CloudStack Systems",
        "po": "PO-9912-AF",
        "invoice_total": 4250.00,
        "po_total": 3990.00,
        "receipt_total": 3990.00,
        "receipt_confirmed": True,
        "terms": "Net 30",
    },
]


@mcp.tool()
async def get_invoice_audit(invoice_id: str) -> dict[str, Any]:
    """Fetch invoice, PO, and receipt records from the mock ERP ledger."""
    record = next((item for item in ERP_RECORDS if item["invoice_id"] == invoice_id), None)
    if not record:
        return {"status": "not_found", "invoice_id": invoice_id}
    return record


@mcp.tool()
async def run_audit_loop(invoice_id: str) -> AuditResult:
    """Run autonomous 3-way matching with discrepancy detection."""
    record = next((item for item in ERP_RECORDS if item["invoice_id"] == invoice_id), None)
    if not record:
        return AuditResult(
            status="FLAGGED",
            variance_pct=100,
            risk_score=0.98,
            human_approval_required=False,
            trace=[f"{invoice_id} not found in ERP ledger."],
        )

    variance = abs(record["invoice_total"] - record["po_total"]) / record["po_total"]
    trace = [
        f"Invoice {invoice_id} loaded for {record['vendor']}.",
        f"PO {record['po']} variance: {variance:.2%}.",
        f"Receipt confirmed: {record['receipt_confirmed']}.",
    ]

    if variance > 0.05:
        return AuditResult(
            status="FLAGGED",
            variance_pct=round(variance * 100, 2),
            risk_score=0.86,
            human_approval_required=False,
            trace=trace + ["Blocked because variance exceeds 5% tolerance."],
        )

    if not record["receipt_confirmed"]:
        return AuditResult(
            status="ON_HOLD",
            variance_pct=round(variance * 100, 2),
            risk_score=0.48,
            human_approval_required=False,
            trace=trace + ["Held because receiving evidence is missing."],
        )

    return AuditResult(
        status="READY_FOR_APPROVAL",
        variance_pct=round(variance * 100, 2),
        risk_score=0.08,
        human_approval_required=True,
        trace=trace + ["Prepared for human approval; no funds remitted by agent."],
    )


if __name__ == "__main__":
    mcp.run()
