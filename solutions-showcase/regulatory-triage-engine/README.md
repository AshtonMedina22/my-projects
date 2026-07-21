# Real-Time Regulatory Triage

Legal operations project for reducing compliance lag between newly published regulations and internal policy/control updates.

## Live Implementation

- Portfolio route: `/live/reg-triage`
- API route: `/api/reg-triage/analyze`
- Shared deterministic engine: `lib/reg-triage/engine.ts`
- Type model: `lib/types/reg-triage.ts`
- LangGraph-style service artifact: `solutions-showcase/regulatory-triage-engine/langgraph-triage-service.py`

## Business Problem

Compliance teams often learn about a regulatory change before they know which internal policies, controls, evidence requirements, owners, and legal review paths are impacted. That delay creates avoidable exposure.

This project turns a regulatory feed item into a policy impact report with node-level trace visibility.

## Workflow

1. Ingest a regulatory update from a Regology-style feed.
2. Extract jurisdictions from the rule text.
3. Extract concrete obligations, due dates, owners, and evidence requirements.
4. Compare the rule against an internal policy/control library.
5. Detect cross-border conflicts, especially evidence collection versus privacy minimization.
6. Generate a policy impact report and Slack-ready escalation.
7. Route critical conflicts to a legal operations review gate.

## Signature Edge

The project includes cross-border conflict detection. When a new EU vendor due diligence requirement creates tension with US privacy/data minimization commitments, the workflow does not simply summarize the rule. It blocks the rollout path and opens a legal review requirement.

## Portfolio Signal

- Legal Ops and compliance automation
- LangGraph-style node trace visibility
- Regology-style feed monitoring
- Policy/control gap analysis
- Slack escalation payloads
- Human legal approval gate
- OpenAI-enhanced summary when `OPENAI_API_KEY` is available, deterministic fallback otherwise
