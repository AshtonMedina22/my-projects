export type RegulatorySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TriageStatus =
  | "MONITOR"
  | "POLICY_UPDATE_REQUIRED"
  | "LEGAL_REVIEW_REQUIRED"
  | "CROSS_BORDER_CONFLICT";

export interface RegulatoryFeedItem {
  id: string;
  source: "Regology" | "SEC" | "EU Commission" | "State Privacy Board";
  title: string;
  jurisdiction: string[];
  published_at: string;
  effective_date: string;
  text: string;
  url: string;
}

export interface ExtractedRequirement {
  id: string;
  obligation: string;
  owner: "Legal Ops" | "Compliance" | "Security" | "Finance" | "Vendor Risk";
  due_in_days: number;
  evidence_required: string;
}

export interface ImpactedControl {
  control_id: string;
  policy: string;
  current_state: string;
  required_change: string;
  owner: string;
  gap_score: number;
}

export interface CrossBorderConflict {
  conflict_id: string;
  jurisdictions: string[];
  policy_area: string;
  description: string;
  severity: RegulatorySeverity;
  recommended_action: string;
}

export interface RegTriageTraceStep {
  node: string;
  label: string;
  status: "complete" | "warning" | "blocked";
  detail: string;
  duration_ms: number;
  payload: Record<string, unknown>;
}

export interface PolicyImpactReport {
  title: string;
  executive_summary: string;
  proposed_policy_changes: string[];
  required_approvals: string[];
  slack_channel: string;
  ticket_priority: "P3" | "P2" | "P1" | "P0";
}

export interface RegulatoryTriageResult {
  mode: "openai" | "demo";
  generated_at: string;
  status: TriageStatus;
  severity: RegulatorySeverity;
  feed_item: RegulatoryFeedItem;
  requirements: ExtractedRequirement[];
  impacted_controls: ImpactedControl[];
  conflicts: CrossBorderConflict[];
  report: PolicyImpactReport;
  slack_alert: string;
  trace: RegTriageTraceStep[];
  metrics: {
    impact_score: number;
    requirements_found: number;
    controls_impacted: number;
    conflicts_found: number;
    days_until_effective: number;
  };
}
