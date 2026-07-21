# Self-Healing SRE Agentic DevOps

## Portfolio Intent

A multi-agent SRE workflow where one agent monitors cloud logs, another diagnoses root cause with a debate pattern, and a guarded executor proposes rollback or autoscaling actions.

## Business Pain

Cloud-native systems generate large log volumes, increasing operational toil and slowing incident response.

## Target Workflow

1. Monitor AWS CloudWatch alarms and log anomalies.
2. Cluster likely incident signals by service, release, and metric.
3. Run a debate-pattern diagnosis between competing root cause hypotheses.
4. Generate a remediation proposal: rollback, autoscale, feature flag, or escalation.
5. Validate the proposal against infrastructure-as-code constraints.
6. Require approval or policy clearance before execution.

## Integration Stack

- AWS CloudWatch
- Terraform or AWS CDK
- DeepEval for agentic reasoning audit
- Deployment and rollback pipeline hooks

## Safety Controls

- Production rollback is gated by policy and approval.
- The diagnosis trace is retained for post-incident review.
- The executor can only use approved IaC actions.

