import type {
  CloudWatchSignal,
  DeepEvalAudit,
  SelfHealingSreResult,
  SreHypothesis,
  SreIncident,
  SreIncidentStatus,
  SreRemediationPlan,
  SreSeverity,
  SreTraceStep,
} from "../types/self-healing-sre";

export const MOCK_SRE_INCIDENTS: SreIncident[] = [
  {
    id: "INC-API-2026-071",
    title: "Checkout API latency spike after release",
    service: "checkout-api",
    environment: "production",
    release: "release-2026.07.21",
    recent_change: "ECS task definition updated 14 minutes before CloudWatch p95 latency alarm.",
    runbook: "RUNBOOK-SRE-ROLLBACK-004",
    cloudwatch_signal: {
      id: "CW-ALARM-9482",
      service: "checkout-api",
      region: "us-east-1",
      metric: "p95_latency_ms",
      value: 2840,
      threshold: 950,
      unit: "ms",
      timestamp: "2026-07-21T15:42:00Z",
      log_excerpt:
        "ERROR request_timeout route=/checkout heap_used=92% deploy=release-2026.07.21 retry_budget_exhausted=true",
    },
  },
  {
    id: "INC-WORKER-2026-044",
    title: "Queue worker CPU overload and backlog growth",
    service: "fulfillment-worker",
    environment: "production",
    release: "release-2026.07.18",
    recent_change: "No release in the last 24 hours; traffic increased after promotion batch job.",
    runbook: "RUNBOOK-SRE-SCALE-011",
    cloudwatch_signal: {
      id: "CW-ALARM-3821",
      service: "fulfillment-worker",
      region: "us-east-1",
      metric: "cpu_utilization_pct",
      value: 94,
      threshold: 80,
      unit: "%",
      timestamp: "2026-07-21T15:45:00Z",
      log_excerpt:
        "WARN worker_pool_saturated queue_depth=1840 cpu=94 throttling=true downstream_ok=true scale_target=6",
    },
  },
  {
    id: "INC-DB-2026-119",
    title: "Payment database connection saturation",
    service: "payments-db",
    environment: "production",
    release: "release-2026.07.20",
    recent_change: "Connection pool size changed during payment reconciliation optimization.",
    runbook: "RUNBOOK-SRE-DATA-029",
    cloudwatch_signal: {
      id: "CW-ALARM-7710",
      service: "payments-db",
      region: "us-east-1",
      metric: "connection_utilization_pct",
      value: 98,
      threshold: 82,
      unit: "%",
      timestamp: "2026-07-21T15:47:00Z",
      log_excerpt:
        "CRITICAL connection_pool_exhausted active=392 max=400 transaction_deadlock=true payment_write_path_affected=true",
    },
  },
];

function normalize(text: string) {
  return text.toLowerCase();
}

function incidentFromCustomSignal(customSignal: string): SreIncident {
  const text = customSignal.trim();
  const lower = normalize(text);
  const service = lower.includes("db") || lower.includes("database") ? "custom-db-service" : "custom-api-service";
  const metric = lower.includes("cpu") ? "cpu_utilization_pct" : lower.includes("connection") ? "connection_utilization_pct" : "error_rate_pct";
  const threshold = metric === "cpu_utilization_pct" ? 80 : metric === "connection_utilization_pct" ? 82 : 3;
  const value = metric === "error_rate_pct" ? 8.7 : lower.includes("critical") ? 98 : 91;

  return {
    id: "INC-CUSTOM-INPUT",
    title: "Operator-submitted CloudWatch signal",
    service,
    environment: "production",
    release: lower.includes("release") || lower.includes("deploy") ? "custom-release" : "unchanged",
    recent_change: lower.includes("release") || lower.includes("deploy") ? "Operator text references a recent deploy." : "No explicit deploy reference found.",
    runbook: "RUNBOOK-SRE-CUSTOM-001",
    cloudwatch_signal: {
      id: "CW-ALARM-CUSTOM",
      service,
      region: "us-east-1",
      metric,
      value,
      threshold,
      unit: metric.endsWith("_pct") ? "%" : "count",
      timestamp: new Date().toISOString(),
      log_excerpt: text,
    },
  };
}

function getIncident(incidentId?: string, customSignal?: string) {
  if (customSignal?.trim()) return incidentFromCustomSignal(customSignal);
  return MOCK_SRE_INCIDENTS.find((incident) => incident.id === incidentId) ?? MOCK_SRE_INCIDENTS[0];
}

function detectPattern(incident: SreIncident) {
  const text = normalize(
    `${incident.title} ${incident.service} ${incident.recent_change} ${incident.cloudwatch_signal.log_excerpt}`,
  );
  const hasCapacitySignal = text.includes("cpu") || text.includes("queue") || text.includes("throttling") || text.includes("backlog");
  const hasReleaseFailureSignal =
    (text.includes("after release") || text.includes("after deploy") || text.includes("deploy=")) &&
    (text.includes("heap") || text.includes("memory") || text.includes("timeout") || text.includes("retry_budget"));

  if (text.includes("deadlock") || text.includes("connection") || text.includes("database") || text.includes("db")) {
    return "database_saturation";
  }

  if (hasReleaseFailureSignal) {
    return "bad_release";
  }

  if (hasCapacitySignal) {
    return "capacity_pressure";
  }

  return "watch_and_correlate";
}

function buildHypotheses(incident: SreIncident, pattern: string): SreHypothesis[] {
  const signal = incident.cloudwatch_signal;
  const baseEvidence = [
    `${signal.metric}=${signal.value}${signal.unit} breached threshold ${signal.threshold}${signal.unit}`,
    incident.recent_change,
  ];

  if (pattern === "bad_release") {
    return [
      {
        id: "HYP-BAD-RELEASE",
        agent: "diagnosis-a",
        claim: "Recent application release introduced latency and memory pressure.",
        evidence: [...baseEvidence, "Log excerpt references deploy, heap pressure, timeout, or exhausted retry budget."],
        confidence: 0.91,
        verdict: "accepted",
      },
      {
        id: "HYP-CAPACITY",
        agent: "diagnosis-b",
        claim: "Traffic surge caused organic capacity pressure.",
        evidence: ["No independent traffic-growth signal exceeded release correlation.", "Downstream errors appear after API timeouts."],
        confidence: 0.47,
        verdict: "challenger",
      },
    ];
  }

  if (pattern === "capacity_pressure") {
    return [
      {
        id: "HYP-CAPACITY",
        agent: "diagnosis-a",
        claim: "Worker fleet needs temporary scale-out to clear backlog.",
        evidence: [...baseEvidence, "No recent release correlation; queue depth and CPU are both elevated."],
        confidence: 0.88,
        verdict: "accepted",
      },
      {
        id: "HYP-BAD-RELEASE",
        agent: "diagnosis-b",
        claim: "Application defect caused worker saturation.",
        evidence: ["Release is older than the incident window.", "Downstream dependencies reported healthy."],
        confidence: 0.39,
        verdict: "rejected",
      },
    ];
  }

  if (pattern === "database_saturation") {
    return [
      {
        id: "HYP-DB-POOL",
        agent: "diagnosis-a",
        claim: "Payment write path is constrained by connection pool saturation and deadlocks.",
        evidence: [...baseEvidence, "Database tier is in the blast radius and payment writes are affected."],
        confidence: 0.93,
        verdict: "accepted",
      },
      {
        id: "HYP-NETWORK",
        agent: "diagnosis-b",
        claim: "Regional network instability is causing transient database failures.",
        evidence: ["No region-wide network alarm is present.", "Failures cluster around active connection count and deadlock logs."],
        confidence: 0.31,
        verdict: "rejected",
      },
    ];
  }

  return [
    {
      id: "HYP-MONITOR",
      agent: "monitor",
      claim: "Anomaly is confirmed but requires more correlated signals before remediation.",
      evidence: baseEvidence,
      confidence: 0.62,
      verdict: "accepted",
    },
  ];
}

function buildRemediation(pattern: string, incident: SreIncident): SreRemediationPlan {
  if (pattern === "bad_release") {
    return {
      action: "TERRAFORM_ROLLBACK",
      terraform_target: `module.${incident.service.replaceAll("-", "_")}.aws_ecs_service.this`,
      command: `terraform apply -target=module.${incident.service.replaceAll("-", "_")}.aws_ecs_service.this -var image_tag=previous`,
      blast_radius: "single-service",
      approval_required: true,
      rollback_window_minutes: 4,
      validation_checks: [
        "Confirm current error budget burn rate is above rollback threshold.",
        "Verify previous task definition passed smoke tests.",
        "Watch p95 latency, 5xx rate, and checkout conversion for 15 minutes after rollback.",
      ],
    };
  }

  if (pattern === "capacity_pressure") {
    return {
      action: "SCALE_OUT",
      terraform_target: `module.${incident.service.replaceAll("-", "_")}.aws_appautoscaling_target.this`,
      command: "aws application-autoscaling register-scalable-target --min-capacity 6 --max-capacity 18",
      blast_radius: "regional-service",
      approval_required: false,
      rollback_window_minutes: 3,
      validation_checks: [
        "Verify queue depth decreases for three consecutive intervals.",
        "Confirm downstream services remain below saturation threshold.",
        "Restore normal desired capacity after backlog clears.",
      ],
    };
  }

  if (pattern === "database_saturation") {
    return {
      action: "ESCALATE",
      terraform_target: "module.payments_database.aws_rds_cluster.this",
      command: "create change request: increase pool limit or rollback payment write-path optimization",
      blast_radius: "database-tier",
      approval_required: true,
      rollback_window_minutes: 8,
      validation_checks: [
        "Require DBA approval before database-tier change.",
        "Confirm payment write queue is paused or draining safely.",
        "Run read/write smoke test after mitigation.",
      ],
    };
  }

  return {
    action: "RESTART_SERVICE",
    terraform_target: `module.${incident.service.replaceAll("-", "_")}.aws_ecs_service.this`,
    command: `aws ecs update-service --service ${incident.service} --force-new-deployment`,
    blast_radius: "single-service",
    approval_required: true,
    rollback_window_minutes: 5,
    validation_checks: ["Collect one more CloudWatch signal.", "Escalate if anomaly persists after restart."],
  };
}

function statusFrom(pattern: string, remediation: SreRemediationPlan): SreIncidentStatus {
  if (pattern === "bad_release") return "ROLLBACK_RECOMMENDED";
  if (pattern === "capacity_pressure") return "SCALE_OUT_READY";
  if (pattern === "database_saturation" || remediation.approval_required) return "HUMAN_APPROVAL_REQUIRED";
  return "MONITOR";
}

function severityFrom(pattern: string, signal: CloudWatchSignal): SreSeverity {
  if (pattern === "database_saturation") return "CRITICAL";
  const ratio = signal.value / Math.max(signal.threshold, 1);
  if (ratio >= 2.5) return "CRITICAL";
  if (ratio >= 1.5) return "HIGH";
  if (ratio >= 1.1) return "MEDIUM";
  return "LOW";
}

function buildAudit(remediation: SreRemediationPlan, hypothesis: SreHypothesis): DeepEvalAudit {
  const checks: DeepEvalAudit["checks"] = [
    {
      name: "Evidence grounded",
      result: hypothesis.evidence.length >= 2 ? "pass" : "warn",
      detail: "Root-cause claim cites CloudWatch metric breach and change/log correlation.",
    },
    {
      name: "Blast radius bounded",
      result: remediation.blast_radius === "database-tier" ? "warn" : "pass",
      detail: `Remediation is scoped to ${remediation.blast_radius}.`,
    },
    {
      name: "Approval gate",
      result: remediation.approval_required ? "warn" : "pass",
      detail: remediation.approval_required
        ? "Human approval is required before executing infrastructure changes."
        : "Action is within automated scale policy and can execute immediately.",
    },
  ];
  const failing = checks.filter((check) => check.result === "fail").length;
  const warnings = checks.filter((check) => check.result === "warn").length;

  return {
    pass: failing === 0,
    score: Number(Math.max(0.5, 0.96 - warnings * 0.08 - failing * 0.3).toFixed(2)),
    checks,
  };
}

function buildTrace(
  incident: SreIncident,
  pattern: string,
  status: SreIncidentStatus,
  selected: SreHypothesis,
  remediation: SreRemediationPlan,
  audit: DeepEvalAudit,
): SreTraceStep[] {
  return [
    {
      agent: "CloudWatch.monitor",
      label: "Alarm correlation",
      status: "complete",
      detail: `${incident.cloudwatch_signal.metric} breached on ${incident.service} in ${incident.cloudwatch_signal.region}.`,
      duration_ms: 128,
      payload: { ...incident.cloudwatch_signal },
    },
    {
      agent: "AgentA.root_cause",
      label: "Primary diagnosis",
      status: "complete",
      detail: selected.claim,
      duration_ms: 244,
      payload: { hypothesis: selected.id, evidence: selected.evidence },
    },
    {
      agent: "AgentB.debate",
      label: "Challenge alternative",
      status: pattern === "watch_and_correlate" ? "warning" : "complete",
      detail: "Challenger agent tested competing explanations before accepting remediation path.",
      duration_ms: 219,
      payload: { accepted_confidence: selected.confidence },
    },
    {
      agent: "Terraform.remediation",
      label: "Safe action plan",
      status: remediation.approval_required ? "blocked" : "complete",
      detail: remediation.approval_required
        ? "Execution is blocked until an operator approves the change."
        : "Action is eligible for automated execution under runbook policy.",
      duration_ms: 302,
      payload: {
        action: remediation.action,
        command: remediation.command,
        approval_required: remediation.approval_required,
      },
    },
    {
      agent: "DeepEval.audit",
      label: "Reasoning audit",
      status: audit.checks.some((check) => check.result === "warn") ? "warning" : "complete",
      detail: `Audit score ${Math.round(audit.score * 100)}%; final status ${status}.`,
      duration_ms: 181,
      payload: { checks: audit.checks },
    },
  ];
}

function operatorNotice(status: SreIncidentStatus, incident: SreIncident, remediation: SreRemediationPlan) {
  if (status === "SCALE_OUT_READY") {
    return `${incident.service} appears capacity-bound. The agent recommends immediate scale-out, then queue-depth validation before restoring normal limits.`;
  }

  if (status === "ROLLBACK_RECOMMENDED") {
    return `${incident.service} is strongly correlated with ${incident.release}. Prepare the Terraform rollback and require operator approval before execution.`;
  }

  if (status === "HUMAN_APPROVAL_REQUIRED") {
    return `${incident.service} touches a high-blast-radius path. Hold automation, route approval, and execute only after the validation checklist is accepted.`;
  }

  return `${incident.service} should remain under observation until additional CloudWatch signals confirm a safe remediation path.`;
}

export function runSelfHealingSre(incidentId?: string, customSignal?: string): SelfHealingSreResult {
  const incident = getIncident(incidentId, customSignal);
  const pattern = detectPattern(incident);
  const hypotheses = buildHypotheses(incident, pattern);
  const selected_hypothesis = hypotheses.find((hypothesis) => hypothesis.verdict === "accepted") ?? hypotheses[0];
  const remediation = buildRemediation(pattern, incident);
  const status = statusFrom(pattern, remediation);
  const severity = severityFrom(pattern, incident.cloudwatch_signal);
  const deepeval = buildAudit(remediation, selected_hypothesis);
  const trace = buildTrace(incident, pattern, status, selected_hypothesis, remediation, deepeval);

  return {
    mode: "demo",
    generated_at: new Date().toISOString(),
    status,
    severity,
    incident,
    hypotheses,
    selected_hypothesis,
    remediation,
    trace,
    deepeval,
    metrics: {
      confidence: selected_hypothesis.confidence,
      mttr_minutes: remediation.rollback_window_minutes,
      toil_reduction_pct: pattern === "watch_and_correlate" ? 18 : 34,
      signals_correlated: pattern === "watch_and_correlate" ? 2 : 5,
      affected_services: remediation.blast_radius === "database-tier" ? 3 : 1,
    },
    operator_notice: operatorNotice(status, incident, remediation),
  };
}

export function enrichSreSummary(result: SelfHealingSreResult, operatorNoticeText: string): SelfHealingSreResult {
  return {
    ...result,
    mode: "openai",
    operator_notice: operatorNoticeText,
  };
}
