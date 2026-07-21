# Self-Healing SRE Agentic DevOps

Live portfolio route: `/live/self-healing-sre`

Backend route: `/api/self-healing-sre/diagnose`

This project demonstrates a production-style incident response workflow for cloud-native systems. It turns CloudWatch-style alerts into a governed remediation recommendation using multi-agent diagnosis, a debate pattern, DeepEval-style reasoning checks, and approval gates before risky infrastructure changes.

## Business Pain

Modern cloud systems generate more telemetry than SRE teams can manually review during an incident. The result is slower root-cause analysis, alert fatigue, inconsistent rollback decisions, and high operational toil.

## Architecture

1. CloudWatch monitor agent correlates alarm values, thresholds, log excerpts, release timing, and service metadata.
2. Diagnosis agent proposes the most likely root cause.
3. Challenger agent tests competing hypotheses to reduce overconfident rollback or scale-out decisions.
4. Remediation agent produces a Terraform/CDK-safe action plan with validation checks.
5. DeepEval-style audit scores evidence grounding, blast-radius control, and approval requirements.
6. Operator gate blocks rollback/database-tier actions until human approval is recorded.

## Live Demo Modes

- Bad release rollback: checkout API latency and heap pressure after deployment.
- Capacity pressure: worker queue growth and CPU saturation with no recent release correlation.
- Database saturation: payment write-path connection exhaustion requiring human approval.
- Custom CloudWatch signal: operator-submitted log text is converted into an incident for triage.

## Portfolio Signal

- Multi-agent incident reasoning instead of a simple rules dashboard.
- Structured typed output for status, severity, trace, hypotheses, remediation, and audit results.
- Serverless API compatible with Vercel deployment.
- Deterministic fallback for public demo reliability, with optional OpenAI operator-summary enrichment when `OPENAI_API_KEY` is present.
- Clear human-in-the-loop boundary for high-blast-radius remediation.

## Relevant Files

- `app/live/self-healing-sre/page.tsx`
- `app/live/self-healing-sre/self-healing-sre-app.tsx`
- `app/api/self-healing-sre/diagnose/route.ts`
- `lib/self-healing-sre/engine.ts`
- `lib/types/self-healing-sre.ts`
- `solutions-showcase/self-healing-sre-ops/agentic-remediation-service.py`
