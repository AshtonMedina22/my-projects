export type SreSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SreIncidentStatus =
  | "MONITOR"
  | "SCALE_OUT_READY"
  | "ROLLBACK_RECOMMENDED"
  | "HUMAN_APPROVAL_REQUIRED"
  | "REMEDIATED";

export interface CloudWatchSignal {
  id: string;
  service: string;
  region: string;
  metric: string;
  value: number;
  threshold: number;
  unit: string;
  timestamp: string;
  log_excerpt: string;
}

export interface SreIncident {
  id: string;
  title: string;
  service: string;
  environment: "production" | "staging";
  release: string;
  cloudwatch_signal: CloudWatchSignal;
  recent_change: string;
  runbook: string;
}

export interface SreHypothesis {
  id: string;
  agent: "monitor" | "diagnosis-a" | "diagnosis-b" | "remediation" | "audit";
  claim: string;
  evidence: string[];
  confidence: number;
  verdict: "accepted" | "challenger" | "rejected";
}

export interface SreRemediationPlan {
  action: "TERRAFORM_ROLLBACK" | "SCALE_OUT" | "RESTART_SERVICE" | "ESCALATE";
  terraform_target: string;
  command: string;
  blast_radius: "single-service" | "regional-service" | "database-tier";
  approval_required: boolean;
  rollback_window_minutes: number;
  validation_checks: string[];
}

export interface SreTraceStep {
  agent: string;
  label: string;
  status: "complete" | "warning" | "blocked";
  detail: string;
  duration_ms: number;
  payload: Record<string, unknown>;
}

export interface DeepEvalAudit {
  pass: boolean;
  score: number;
  checks: {
    name: string;
    result: "pass" | "warn" | "fail";
    detail: string;
  }[];
}

export interface SelfHealingSreResult {
  mode: "openai" | "demo";
  generated_at: string;
  status: SreIncidentStatus;
  severity: SreSeverity;
  incident: SreIncident;
  hypotheses: SreHypothesis[];
  selected_hypothesis: SreHypothesis;
  remediation: SreRemediationPlan;
  trace: SreTraceStep[];
  deepeval: DeepEvalAudit;
  metrics: {
    confidence: number;
    mttr_minutes: number;
    toil_reduction_pct: number;
    signals_correlated: number;
    affected_services: number;
  };
  operator_notice: string;
}
