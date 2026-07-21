"""
Reference implementation sketch for the Self-Healing SRE portfolio project.

This file is intentionally framework-light so the workflow can be reviewed
outside the Next.js app. The live implementation uses TypeScript under
lib/self-healing-sre/engine.ts and app/api/self-healing-sre/diagnose/route.ts.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Literal


class Action(str, Enum):
    TERRAFORM_ROLLBACK = "TERRAFORM_ROLLBACK"
    SCALE_OUT = "SCALE_OUT"
    ESCALATE = "ESCALATE"


@dataclass(frozen=True)
class CloudWatchSignal:
    service: str
    metric: str
    value: float
    threshold: float
    log_excerpt: str
    recent_change: str


@dataclass(frozen=True)
class Hypothesis:
    claim: str
    confidence: float
    evidence: list[str]


@dataclass(frozen=True)
class RemediationPlan:
    action: Action
    command: str
    approval_required: bool
    validation_checks: list[str]


def classify_incident(signal: CloudWatchSignal) -> Literal["bad_release", "capacity_pressure", "database_saturation"]:
    text = f"{signal.log_excerpt} {signal.recent_change}".lower()
    if "deadlock" in text or "connection" in text or "database" in text:
        return "database_saturation"
    if "release" in text or "deploy" in text or "heap" in text or "timeout" in text:
        return "bad_release"
    return "capacity_pressure"


def debate_root_cause(signal: CloudWatchSignal) -> Hypothesis:
    pattern = classify_incident(signal)
    base = [
        f"{signal.metric}={signal.value} breached threshold {signal.threshold}",
        signal.recent_change,
    ]

    if pattern == "bad_release":
        return Hypothesis(
            claim="Recent application release introduced latency and memory pressure.",
            confidence=0.91,
            evidence=base + ["Log excerpt references deploy, heap pressure, timeout, or exhausted retry budget."],
        )

    if pattern == "database_saturation":
        return Hypothesis(
            claim="Payment write path is constrained by connection pool saturation and deadlocks.",
            confidence=0.93,
            evidence=base + ["Database tier is in the blast radius and payment writes are affected."],
        )

    return Hypothesis(
        claim="Worker fleet needs temporary scale-out to clear backlog.",
        confidence=0.88,
        evidence=base + ["No recent release correlation; queue depth and CPU are both elevated."],
    )


def plan_remediation(signal: CloudWatchSignal, hypothesis: Hypothesis) -> RemediationPlan:
    pattern = classify_incident(signal)

    if pattern == "bad_release":
        service_module = signal.service.replace("-", "_")
        return RemediationPlan(
            action=Action.TERRAFORM_ROLLBACK,
            command=f"terraform apply -target=module.{service_module}.aws_ecs_service.this -var image_tag=previous",
            approval_required=True,
            validation_checks=[
                "Confirm current error budget burn rate is above rollback threshold.",
                "Verify previous task definition passed smoke tests.",
                "Watch latency and 5xx rate after rollback.",
            ],
        )

    if pattern == "database_saturation":
        return RemediationPlan(
            action=Action.ESCALATE,
            command="create change request: rollback payment write-path optimization or adjust pool limits",
            approval_required=True,
            validation_checks=[
                "Require DBA approval before database-tier change.",
                "Confirm payment write queue is paused or draining safely.",
                "Run read/write smoke test after mitigation.",
            ],
        )

    return RemediationPlan(
        action=Action.SCALE_OUT,
        command="aws application-autoscaling register-scalable-target --min-capacity 6 --max-capacity 18",
        approval_required=False,
        validation_checks=[
            "Verify queue depth decreases for three consecutive intervals.",
            "Confirm downstream services remain healthy.",
            "Restore normal capacity after backlog clears.",
        ],
    )


def audit_plan(hypothesis: Hypothesis, plan: RemediationPlan) -> dict[str, object]:
    warnings = int(plan.approval_required)
    score = round(max(0.5, 0.96 - warnings * 0.08), 2)
    return {
        "pass": True,
        "score": score,
        "checks": [
            {"name": "evidence_grounded", "result": "pass", "detail": hypothesis.evidence},
            {"name": "approval_gate", "result": "warn" if plan.approval_required else "pass"},
        ],
    }


def run_agentic_sre(signal: CloudWatchSignal) -> dict[str, object]:
    hypothesis = debate_root_cause(signal)
    plan = plan_remediation(signal, hypothesis)
    audit = audit_plan(hypothesis, plan)
    return {
        "service": signal.service,
        "hypothesis": hypothesis,
        "remediation": plan,
        "audit": audit,
        "ready_for_execution": audit["pass"] and not plan.approval_required,
    }
