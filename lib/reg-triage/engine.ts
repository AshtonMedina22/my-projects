import type {
  CrossBorderConflict,
  ExtractedRequirement,
  ImpactedControl,
  PolicyImpactReport,
  RegTriageTraceStep,
  RegulatoryFeedItem,
  RegulatorySeverity,
  RegulatoryTriageResult,
  TriageStatus,
} from "../types/reg-triage";

export const MOCK_REGULATORY_FEED: RegulatoryFeedItem[] = [
  {
    id: "REG-EU-AI-2026-071",
    source: "EU Commission",
    title: "EU AI Act incident reporting window tightened for high-risk systems",
    jurisdiction: ["European Union"],
    published_at: "2026-07-20",
    effective_date: "2026-10-01",
    text:
      "Providers of high-risk AI systems operating in the EU must report serious incidents within 72 hours, maintain technical documentation, and preserve model monitoring evidence for competent authorities.",
    url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
  },
  {
    id: "REG-US-PRIV-2026-044",
    source: "State Privacy Board",
    title: "US state privacy rule expands consumer opt-out and profiling disclosure",
    jurisdiction: ["United States", "California"],
    published_at: "2026-07-18",
    effective_date: "2026-09-15",
    text:
      "Businesses using automated profiling for eligibility, pricing, or service prioritization must disclose model logic categories and provide an opt-out workflow before processing consumer data.",
    url: "https://oag.ca.gov/privacy",
  },
  {
    id: "REG-XBORDER-2026-119",
    source: "Regology",
    title: "EU supplier due diligence rule conflicts with US data minimization commitments",
    jurisdiction: ["European Union", "United States"],
    published_at: "2026-07-21",
    effective_date: "2026-08-30",
    text:
      "New EU supplier due diligence guidance requires enhanced vendor documentation for high-risk suppliers, while US privacy commitments restrict unnecessary collection of workforce and contractor personal data. Firms must reconcile evidence retention, vendor risk scoring, and data minimization controls.",
    url: "https://regology.com/",
  },
];

const CONTROL_LIBRARY = [
  {
    control_id: "CTRL-AI-INC-014",
    policy: "AI Incident Response Policy",
    keywords: ["incident", "high-risk ai", "monitoring", "technical documentation"],
    current_state: "Incidents are reviewed within five business days and evidence retention is not explicitly tied to regulator access.",
    required_change:
      "Add 72-hour serious incident notification workflow, regulator evidence package, and monitoring artifact retention owner.",
    owner: "Security",
  },
  {
    control_id: "CTRL-PRIV-DSR-022",
    policy: "Consumer Privacy and Profiling Notice",
    keywords: ["profiling", "opt-out", "consumer", "model logic", "personal data"],
    current_state: "Privacy notice covers general analytics but not model-assisted eligibility or service prioritization.",
    required_change:
      "Add automated profiling disclosure, opt-out intake, and model logic category inventory for customer-facing workflows.",
    owner: "Legal Ops",
  },
  {
    control_id: "CTRL-VRM-308",
    policy: "Vendor Due Diligence Standard",
    keywords: ["supplier", "vendor", "due diligence", "documentation", "high-risk suppliers"],
    current_state: "Vendor risk review collects contract and insurance evidence but does not score workforce documentation limits.",
    required_change:
      "Add supplier evidence review with privacy-minimized collection rules and human legal approval for high-risk data requests.",
    owner: "Vendor Risk",
  },
  {
    control_id: "CTRL-DATA-RET-117",
    policy: "Data Retention and Minimization Policy",
    keywords: ["retention", "data minimization", "personal data", "evidence retention"],
    current_state: "Retention rules are system-specific and do not reconcile cross-border evidence requirements.",
    required_change:
      "Create jurisdiction-aware retention matrix that separates required compliance evidence from unnecessary personal data.",
    owner: "Compliance",
  },
];

function dayDiff(date: string) {
  const now = new Date("2026-07-21T12:00:00-05:00").getTime();
  const target = new Date(`${date}T00:00:00Z`).getTime();
  return Math.max(0, Math.ceil((target - now) / 86_400_000));
}

function normalize(text: string) {
  return text.toLowerCase();
}

function inferJurisdictions(feed: RegulatoryFeedItem, customText?: string) {
  const text = normalize(`${feed.title} ${feed.text} ${customText ?? ""}`);
  const jurisdictions = new Set(feed.jurisdiction);
  if (text.includes("eu") || text.includes("european")) jurisdictions.add("European Union");
  if (text.includes("us ") || text.includes("united states") || text.includes("california")) jurisdictions.add("United States");
  if (text.includes("global") || text.includes("cross-border")) jurisdictions.add("Global");
  return Array.from(jurisdictions);
}

function extractRequirements(feed: RegulatoryFeedItem, jurisdictions: string[]): ExtractedRequirement[] {
  const text = normalize(`${feed.title} ${feed.text}`);
  const requirements: ExtractedRequirement[] = [];

  if (text.includes("incident") || text.includes("high-risk ai")) {
    requirements.push({
      id: "REQ-AI-72H",
      obligation: "Report serious high-risk AI incidents within 72 hours and retain technical evidence.",
      owner: "Security",
      due_in_days: dayDiff(feed.effective_date),
      evidence_required: "Incident register, model monitoring snapshot, regulator-ready technical documentation.",
    });
  }

  if (text.includes("profiling") || text.includes("opt-out")) {
    requirements.push({
      id: "REQ-PRIV-OPT",
      obligation: "Disclose automated profiling categories and provide a consumer opt-out workflow.",
      owner: "Legal Ops",
      due_in_days: dayDiff(feed.effective_date),
      evidence_required: "Privacy notice diff, opt-out queue screenshot, model inventory mapping.",
    });
  }

  if (text.includes("supplier") || text.includes("vendor") || text.includes("due diligence")) {
    requirements.push({
      id: "REQ-VRM-DDQ",
      obligation: "Collect enhanced supplier due diligence evidence for high-risk vendors.",
      owner: "Vendor Risk",
      due_in_days: dayDiff(feed.effective_date),
      evidence_required: "Updated DDQ template, risk-score rationale, legal-approved evidence checklist.",
    });
  }

  if (text.includes("data minimization") || jurisdictions.length > 1) {
    requirements.push({
      id: "REQ-XBORDER-MIN",
      obligation: "Reconcile evidence retention with privacy-minimized data collection across jurisdictions.",
      owner: "Compliance",
      due_in_days: dayDiff(feed.effective_date),
      evidence_required: "Cross-border retention matrix and approved lawful-basis memo.",
    });
  }

  return requirements.length
    ? requirements
    : [
        {
          id: "REQ-MONITOR",
          obligation: "Monitor this regulatory update and confirm no current control owner is impacted.",
          owner: "Compliance",
          due_in_days: dayDiff(feed.effective_date),
          evidence_required: "Legal ops review note.",
        },
      ];
}

function scoreControl(text: string, keywords: string[]) {
  const lower = normalize(text);
  const hits = keywords.filter((keyword) => lower.includes(keyword)).length;
  return Math.min(0.96, 0.26 + hits * 0.18);
}

function mapImpactedControls(feed: RegulatoryFeedItem, requirements: ExtractedRequirement[]): ImpactedControl[] {
  const combinedText = `${feed.title} ${feed.text} ${requirements.map((requirement) => requirement.obligation).join(" ")}`;
  return CONTROL_LIBRARY.map((control) => ({
    control_id: control.control_id,
    policy: control.policy,
    current_state: control.current_state,
    required_change: control.required_change,
    owner: control.owner,
    gap_score: Number(scoreControl(combinedText, control.keywords).toFixed(2)),
  }))
    .filter((control) => control.gap_score >= 0.44)
    .sort((a, b) => b.gap_score - a.gap_score);
}

function detectConflicts(feed: RegulatoryFeedItem, jurisdictions: string[]): CrossBorderConflict[] {
  const text = normalize(`${feed.title} ${feed.text}`);
  const hasEu = jurisdictions.includes("European Union");
  const hasUs = jurisdictions.includes("United States") || jurisdictions.includes("California");
  const evidenceVsPrivacy =
    (text.includes("due diligence") || text.includes("documentation") || text.includes("retention")) &&
    (text.includes("privacy") || text.includes("data minimization") || text.includes("personal data"));

  if (!hasEu || !hasUs || !evidenceVsPrivacy) return [];

  return [
    {
      conflict_id: "XBC-PRIV-VRM-001",
      jurisdictions: ["European Union", "United States"],
      policy_area: "Vendor evidence retention vs privacy minimization",
      description:
        "EU supplier evidence expectations can pressure teams to collect workforce or contractor data that US privacy commitments classify as unnecessary personal information.",
      severity: "CRITICAL",
      recommended_action:
        "Open legal review ticket, require privacy-minimized vendor evidence checklist, and block high-risk supplier onboarding until approved.",
    },
  ];
}

function severityFromScore(score: number, conflicts: CrossBorderConflict[]): RegulatorySeverity {
  if (conflicts.some((conflict) => conflict.severity === "CRITICAL")) return "CRITICAL";
  if (score >= 0.78) return "HIGH";
  if (score >= 0.52) return "MEDIUM";
  return "LOW";
}

function statusFrom(severity: RegulatorySeverity, conflicts: CrossBorderConflict[], controls: ImpactedControl[]): TriageStatus {
  if (conflicts.length) return "CROSS_BORDER_CONFLICT";
  if (severity === "CRITICAL" || severity === "HIGH") return "LEGAL_REVIEW_REQUIRED";
  if (controls.length) return "POLICY_UPDATE_REQUIRED";
  return "MONITOR";
}

function buildReport(
  feed: RegulatoryFeedItem,
  severity: RegulatorySeverity,
  status: TriageStatus,
  requirements: ExtractedRequirement[],
  controls: ImpactedControl[],
  conflicts: CrossBorderConflict[],
): PolicyImpactReport {
  const priority = severity === "CRITICAL" ? "P0" : severity === "HIGH" ? "P1" : severity === "MEDIUM" ? "P2" : "P3";
  const topControl = controls[0];
  const summary =
    conflicts.length > 0
      ? `${feed.title} creates a cross-border conflict that requires legal review before vendor evidence collection or policy rollout.`
      : topControl
        ? `${feed.title} impacts ${topControl.policy}; ${topControl.owner} should update the control before the effective date.`
        : `${feed.title} should remain on the compliance watchlist; no control delta is currently material.`;

  return {
    title: `Policy Impact Report / ${feed.id}`,
    executive_summary: summary,
    proposed_policy_changes: controls.length
      ? controls.slice(0, 4).map((control) => `${control.policy}: ${control.required_change}`)
      : ["Record legal review note and continue monitoring for implementation guidance."],
    required_approvals: Array.from(
      new Set([
        ...requirements.map((requirement) => requirement.owner),
        ...(status === "CROSS_BORDER_CONFLICT" ? ["General Counsel", "Privacy Officer"] : []),
      ]),
    ),
    slack_channel: status === "CROSS_BORDER_CONFLICT" ? "#legal-ops-critical" : "#compliance-alerts",
    ticket_priority: priority,
  };
}

function buildTrace(
  feed: RegulatoryFeedItem,
  jurisdictions: string[],
  requirements: ExtractedRequirement[],
  controls: ImpactedControl[],
  conflicts: CrossBorderConflict[],
  status: TriageStatus,
): RegTriageTraceStep[] {
  return [
    {
      node: "RegologyFeed.ingest",
      label: "Feed ingestion",
      status: "complete",
      detail: `Loaded ${feed.id} from ${feed.source} with effective date ${feed.effective_date}.`,
      duration_ms: 142,
      payload: { id: feed.id, source: feed.source, url: feed.url },
    },
    {
      node: "LangGraph.extract_jurisdiction",
      label: "Jurisdiction extraction",
      status: jurisdictions.length > 1 ? "warning" : "complete",
      detail: jurisdictions.length > 1 ? "Multi-jurisdictional update detected." : `Routed to ${jurisdictions[0]} legal queue.`,
      duration_ms: 216,
      payload: { jurisdictions },
    },
    {
      node: "LangGraph.extract_requirements",
      label: "Requirement extraction",
      status: requirements.length > 1 ? "warning" : "complete",
      detail: `${requirements.length} obligation${requirements.length === 1 ? "" : "s"} extracted for owner routing.`,
      duration_ms: 305,
      payload: { requirements: requirements.map((requirement) => requirement.id) },
    },
    {
      node: "PolicyGraph.compare_controls",
      label: "Control gap analysis",
      status: controls.some((control) => control.gap_score > 0.75) ? "warning" : "complete",
      detail: `${controls.length} policy/control record${controls.length === 1 ? "" : "s"} require review.`,
      duration_ms: 337,
      payload: { controls: controls.map((control) => ({ id: control.control_id, gap_score: control.gap_score })) },
    },
    {
      node: "ConflictDetector.cross_border",
      label: "Cross-border conflict detection",
      status: conflicts.length ? "blocked" : "complete",
      detail: conflicts.length ? conflicts[0].description : "No direct jurisdictional contradiction detected.",
      duration_ms: 264,
      payload: { conflicts: conflicts.map((conflict) => conflict.conflict_id) },
    },
    {
      node: "SlackWebhook.route_alert",
      label: "Compliance alert routing",
      status: status === "CROSS_BORDER_CONFLICT" ? "blocked" : "complete",
      detail:
        status === "CROSS_BORDER_CONFLICT"
          ? "Routed to critical legal operations channel with review hold."
          : "Prepared compliance alert with policy impact report.",
      duration_ms: 198,
      payload: { status },
    },
  ];
}

export function runRegulatoryTriage(feedId?: string, customText?: string): RegulatoryTriageResult {
  const baseFeed = MOCK_REGULATORY_FEED.find((item) => item.id === feedId) ?? MOCK_REGULATORY_FEED[0];
  const feed = customText?.trim()
    ? {
        ...baseFeed,
        id: `${baseFeed.id}-CUSTOM`,
        title: "Custom regulatory update submitted by analyst",
        text: customText.trim(),
        source: "Regology" as const,
      }
    : baseFeed;

  const jurisdictions = inferJurisdictions(feed, customText);
  const requirements = extractRequirements(feed, jurisdictions);
  const impacted_controls = mapImpactedControls(feed, requirements);
  const conflicts = detectConflicts(feed, jurisdictions);
  const impactScore = Number(
    Math.min(
      0.99,
      0.22 +
        requirements.length * 0.13 +
        impacted_controls.reduce((sum, control) => sum + control.gap_score, 0) / Math.max(4, impacted_controls.length * 3) +
        conflicts.length * 0.25,
    ).toFixed(2),
  );
  const severity = severityFromScore(impactScore, conflicts);
  const status = statusFrom(severity, conflicts, impacted_controls);
  const report = buildReport(feed, severity, status, requirements, impacted_controls, conflicts);

  return {
    mode: "demo",
    generated_at: new Date().toISOString(),
    status,
    severity,
    feed_item: { ...feed, jurisdiction: jurisdictions },
    requirements,
    impacted_controls,
    conflicts,
    report,
    slack_alert: `[${report.ticket_priority}] ${report.slack_channel}: ${report.executive_summary}`,
    trace: buildTrace(feed, jurisdictions, requirements, impacted_controls, conflicts, status),
    metrics: {
      impact_score: impactScore,
      requirements_found: requirements.length,
      controls_impacted: impacted_controls.length,
      conflicts_found: conflicts.length,
      days_until_effective: dayDiff(feed.effective_date),
    },
  };
}

export function enrichRegulatorySummary(result: RegulatoryTriageResult, summary: string): RegulatoryTriageResult {
  return {
    ...result,
    mode: "openai",
    report: {
      ...result.report,
      executive_summary: summary,
    },
    slack_alert: `[${result.report.ticket_priority}] ${result.report.slack_channel}: ${summary}`,
  };
}
