# PayFlow Accounts Payable Agent

## Portfolio Intent

An accounts payable agent that answers supplier payment questions by checking invoice status, matching receipts, retrieving delivery context, and drafting supplier notifications after validation.

## Business Pain

Supplier relationships suffer when payment inquiries are handled manually and invoice, purchase order, and receipt records do not align.

## Target Workflow

1. Receive supplier or AP team inquiry.
2. Look up invoice status in Oracle ERP or Sage Intacct.
3. Match invoice lines against purchase order and buyer receipt records.
4. Retrieve shipment or delivery evidence when available.
5. Draft a payment ETA or exception message.
6. Require human approval before any remittance-sensitive action.

## Integration Stack

- Oracle ERP or Sage Intacct
- Receipt and PO matching tools
- Validation loop for finance approval
- Notification drafting through email or supplier portal

## Safety Controls

- The agent cannot remit funds directly.
- Payment-impacting outputs require approval.
- Receipt mismatches are escalated instead of auto-resolved.

