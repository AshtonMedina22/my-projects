# Autonomous ESG Transaction Classifier

## Portfolio Intent

An MCP-connected ESG audit agent that reads ERP purchase transactions, normalizes spend descriptions, and maps each transaction to greenhouse gas emission factors for finance and sustainability review.

## Business Pain

ESG teams manually audit thousands of purchase transactions to estimate carbon impact. The work is slow, inconsistent, and difficult to trace back to source records.

## Target Workflow

1. Ingest transaction exports from Dynamics 365 or SAP.
2. Normalize supplier, GL account, commodity, memo, and amount fields.
3. Use a managed MCP connector to expose transaction records to the agent through typed tools.
4. Classify each spend line into an ESG spend taxonomy.
5. Map the taxonomy result to a GHG emission factor.
6. Return a reviewer-ready explanation with confidence and audit notes.

## Integration Stack

- Dynamics 365 or SAP transaction logs
- Managed MCP Server
- OpenAI or Claude for taxonomy mapping
- ESG/GHG factor reference data

## Safety Controls

- Low-confidence classifications route to human review.
- Agent output must include the source transaction identifier.
- Emission factor mappings remain editable by ESG administrators.

