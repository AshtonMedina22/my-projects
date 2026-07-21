# Autonomous ESG Transaction Classifier

Live MCP-style ESG audit system for mapping ERP purchase transactions to greenhouse gas emission factors.

## Business Pain

ESG teams manually audit thousands of purchase transactions to calculate carbon footprints, creating reporting lag and audit risk.

## Live Portfolio Surface

- App route: `/live/esg-classifier`
- API route: `/api/esg/classify`
- Shared classifier: `lib/esg/classifier.ts`
- Type model: `lib/types/esg.ts`
- MCP server artifact: `solutions-showcase/autonomous-esg-classifier/mcp-server.ts`

## Technical Architecture

- Dynamics 365 or SAP transaction exports
- Managed MCP Server pattern for typed ERP access
- Deterministic GHG taxonomy mapping for audit-safe totals
- Optional OpenAI executive summary when `OPENAI_API_KEY` is available
- Demo-safe fallback mode for public Vercel traffic
- Human-review queue for low-confidence or material classifications

## MCP Tools

- `fetch_erp_transactions` retrieves recent spend records from the ERP connector.
- `map_to_ghg_factor` maps spend descriptions to emission scope, factor, and framework evidence.
- `record_audit_entry` prepares auditable ledger entries and review metadata.

## Portfolio Signal

- 98% audit accuracy target
- Real-time ESG disclosure readiness
- Reviewable classification trail for finance and ESG teams
- CSRD, ISSB, and GRI framework mapping
- Double-materiality monitoring for environmental and financial impact
