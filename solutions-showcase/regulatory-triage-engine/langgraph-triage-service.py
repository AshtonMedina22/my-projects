"""
Real-Time Regulatory Triage - LangGraph-style service artifact.

This Python file documents the production shape of the workflow represented by
the live Next.js demo. It keeps every node output observable so Legal Ops can
debug why a regulation was routed, escalated, or blocked.
"""

from typing import Literal

from pydantic import BaseModel, Field


Severity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
Status = Literal["MONITOR", "POLICY_UPDATE_REQUIRED", "LEGAL_REVIEW_REQUIRED", "CROSS_BORDER_CONFLICT"]


class RegulatoryUpdate(BaseModel):
    update_id: str
    source: str = "Regology"
    title: str
    jurisdictions: list[str]
    text: str
    effective_date: str


class Requirement(BaseModel):
    requirement_id: str
    obligation: str
    owner: str
    evidence_required: str


class PolicyImpactReport(BaseModel):
    status: Status
    severity: Severity
    jurisdictions: list[str]
    requirements: list[Requirement]
    impacted_controls: list[str]
    conflicts: list[str]
    slack_channel: str
    executive_summary: str
    trace: list[dict] = Field(default_factory=list)


def extract_jurisdictions(update: RegulatoryUpdate) -> list[str]:
    text = f"{update.title} {update.text}".lower()
    jurisdictions = set(update.jurisdictions)
    if "eu" in text or "european" in text:
        jurisdictions.add("European Union")
    if "us " in text or "united states" in text or "california" in text:
        jurisdictions.add("United States")
    return sorted(jurisdictions)


def extract_requirements(update: RegulatoryUpdate) -> list[Requirement]:
    text = update.text.lower()
    requirements: list[Requirement] = []
    if "incident" in text or "high-risk ai" in text:
        requirements.append(
            Requirement(
                requirement_id="REQ-AI-72H",
                obligation="Report serious high-risk AI incidents within 72 hours.",
                owner="Security",
                evidence_required="Incident register and technical documentation package.",
            )
        )
    if "supplier" in text or "vendor" in text:
        requirements.append(
            Requirement(
                requirement_id="REQ-VRM-DDQ",
                obligation="Collect enhanced supplier due diligence evidence.",
                owner="Vendor Risk",
                evidence_required="Updated DDQ and legal-approved evidence checklist.",
            )
        )
    if "privacy" in text or "data minimization" in text:
        requirements.append(
            Requirement(
                requirement_id="REQ-XBORDER-MIN",
                obligation="Reconcile evidence retention with privacy-minimized collection.",
                owner="Compliance",
                evidence_required="Cross-border retention matrix.",
            )
        )
    return requirements


def detect_cross_border_conflicts(update: RegulatoryUpdate, jurisdictions: list[str]) -> list[str]:
    text = update.text.lower()
    has_eu = "European Union" in jurisdictions
    has_us = "United States" in jurisdictions
    evidence_pressure = "documentation" in text or "due diligence" in text or "retention" in text
    privacy_limit = "privacy" in text or "data minimization" in text or "personal data" in text
    if has_eu and has_us and evidence_pressure and privacy_limit:
        return ["EU supplier evidence expectations conflict with US data minimization commitments."]
    return []


def run_triage_graph(update: RegulatoryUpdate) -> PolicyImpactReport:
    trace: list[dict] = []

    jurisdictions = extract_jurisdictions(update)
    trace.append({"node": "extract_jurisdictions", "output": jurisdictions})

    requirements = extract_requirements(update)
    trace.append({"node": "extract_requirements", "output": [item.model_dump() for item in requirements]})

    conflicts = detect_cross_border_conflicts(update, jurisdictions)
    trace.append({"node": "detect_cross_border_conflicts", "output": conflicts})

    impacted_controls = [
        "AI Incident Response Policy" if req.requirement_id == "REQ-AI-72H" else
        "Vendor Due Diligence Standard" if req.requirement_id == "REQ-VRM-DDQ" else
        "Data Retention and Minimization Policy"
        for req in requirements
    ]
    trace.append({"node": "compare_policy_controls", "output": impacted_controls})

    status: Status = "CROSS_BORDER_CONFLICT" if conflicts else "POLICY_UPDATE_REQUIRED"
    severity: Severity = "CRITICAL" if conflicts else "HIGH"

    return PolicyImpactReport(
        status=status,
        severity=severity,
        jurisdictions=jurisdictions,
        requirements=requirements,
        impacted_controls=impacted_controls,
        conflicts=conflicts,
        slack_channel="#legal-ops-critical" if conflicts else "#compliance-alerts",
        executive_summary=(
            "Cross-border legal review is required before collecting supplier evidence."
            if conflicts
            else "Policy control owners must update procedures before the effective date."
        ),
        trace=trace,
    )
