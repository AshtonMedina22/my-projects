# PayFlow Accounts Payable Agent

Agentic AP workflow for invoice status, receipt matching, supplier communication, and approval-gated remittance support.

## Business Pain

Manual payment inquiries and mismatched receipts cost organizations more per invoice and strain supplier relationships.

## Technical Architecture

- Live app route: `/live/payflow`
- Serverless audit route: `/api/payflow/audit`
- Shared deterministic AP control logic: `lib/payflow/agent.ts`
- Type model: `lib/types/payflow.ts`
- MCP server artifact: `solutions-showcase/payflow-ap-agent/mcp-server.py`
- Oracle ERP or Sage Intacct-style hooks
- Pydantic-style validation model in the MCP artifact
- Human-in-the-loop approval before remittance-sensitive actions
- Supplier notification drafting from audit state

## Workflow

1. Fetch invoice data from the ERP connector.
2. Match invoice vendor and total against the purchase order.
3. Verify receiving evidence and carrier tracking.
4. Calculate variance, early-payment discount, and operational risk.
5. Draft supplier communication.
6. Stop at a human approval gate before payment.

## Portfolio Signal

- 95% straight-through processing target
- 80% reduction in inquiry volume
- Clear separation between autonomous status checks and approval-required payment actions
- SOX-style segregation of duties guardrail
- Audit trace for every tool call and decision
