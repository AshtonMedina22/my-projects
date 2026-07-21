import { EmissionScope, type ESGTransaction, type MaterialityMetric, type RawERPTransaction } from "../types/esg";

type FactorMatch = {
  spendType: string;
  category: string;
  scope: EmissionScope;
  factor: number;
  factorUnit: string;
  source: string;
  frameworks: ESGTransaction["audit_metadata"]["framework_mappings"];
  confidence: number;
  keywords: string[];
};

const FACTOR_LIBRARY: FactorMatch[] = [
  {
    spendType: "JET_FUEL",
    category: "Business Travel - Air / Jet Fuel",
    scope: EmissionScope.Scope1,
    factor: 2.52,
    factorUnit: "kgCO2e/L",
    source: "GHG Protocol mobile combustion factor set",
    frameworks: ["CSRD", "ISSB", "GRI"],
    confidence: 0.94,
    keywords: ["jet", "fuel", "aviation", "airlines", "flight", "a-1", "a1"],
  },
  {
    spendType: "CLOUD_COMPUTE",
    category: "Cloud Infrastructure",
    scope: EmissionScope.Scope3,
    factor: 0.015,
    factorUnit: "kgCO2e/hr",
    source: "Cloud workload emissions factor library",
    frameworks: ["CSRD", "ISSB", "SASB"],
    confidence: 0.88,
    keywords: ["aws", "cloud", "compute", "ec2", "hosting", "server", "usage"],
  },
  {
    spendType: "OFFICE_SUPPLIES",
    category: "Purchased Goods - Office Supplies",
    scope: EmissionScope.Scope3,
    factor: 1.2,
    factorUnit: "kgCO2e/USD",
    source: "Spend-based purchased goods benchmark",
    frameworks: ["CSRD", "GRI"],
    confidence: 0.83,
    keywords: ["paper", "staples", "supplies", "office", "reams", "recycled"],
  },
  {
    spendType: "ELECTRICITY_TX",
    category: "Purchased Electricity",
    scope: EmissionScope.Scope2,
    factor: 0.45,
    factorUnit: "kgCO2e/kWh",
    source: "Grid electricity location-based factor",
    frameworks: ["CSRD", "ISSB", "TCFD"],
    confidence: 0.86,
    keywords: ["electricity", "utility", "power", "kwh", "energy"],
  },
];

export const MOCK_ESG_TRANSACTIONS: RawERPTransaction[] = [
  {
    id: "TXN-001",
    source_system: "Dynamics365",
    vendor_name: "Shell Aviation",
    description: "Regional Jet Fuel - Jet A1 refill for field operations",
    amount: 5000,
    currency: "L",
    transaction_date: "2026-07-15",
  },
  {
    id: "TXN-002",
    source_system: "Dynamics365",
    vendor_name: "Amazon Web Services",
    description: "EC2 Instance Usage - US-East-1 production workloads",
    amount: 1200,
    currency: "hr",
    transaction_date: "2026-07-20",
  },
  {
    id: "TXN-003",
    source_system: "Dynamics365",
    vendor_name: "Staples",
    description: "Recycled Paper Reams and general office supplies",
    amount: 450,
    currency: "USD",
    transaction_date: "2026-07-18",
  },
  {
    id: "TXN-004",
    source_system: "SAP",
    vendor_name: "North Texas Electric",
    description: "Purchased electricity for warehouse distribution center",
    amount: 18800,
    currency: "kWh",
    transaction_date: "2026-07-12",
  },
];

export function classifyTransactions(transactions: RawERPTransaction[] = MOCK_ESG_TRANSACTIONS): ESGTransaction[] {
  return transactions.map((transaction) => classifyTransaction(transaction));
}

export function classifyTransaction(transaction: RawERPTransaction): ESGTransaction {
  const match = findFactor(transaction);
  const footprint = calculateFootprint(transaction.amount, match);
  const reviewRequired = match.confidence < 0.8 || match.spendType === "UNCLASSIFIED";

  return {
    ...transaction,
    classification: {
      category: match.category,
      scope: match.scope,
      ghg_factor: match.factor,
      factor_unit: match.factorUnit,
      unit: "kgCO2e",
      calculated_footprint: footprint,
    },
    audit_metadata: {
      is_verified: !reviewRequired,
      reasoning_trace: {
        model_id: "deterministic-esg-mapper-v1 + optional OpenAI executive summary",
        confidence_score: match.confidence,
        reasoning_path: [
          `Fetched transaction ${transaction.id} from ${transaction.source_system}.`,
          `Normalized vendor and description: ${transaction.vendor_name} / ${transaction.description}.`,
          `Matched spend type ${match.spendType} using keyword taxonomy.`,
          `Applied ${match.factorUnit} from ${match.source}.`,
          reviewRequired ? "Routed to human review because confidence is below audit threshold." : "Marked verified for ESG audit queue.",
        ],
        source_factor_url: "https://ghgprotocol.org/corporate-standard",
        timestamp: new Date().toISOString(),
      },
      framework_mappings: match.frameworks,
    },
  };
}

export function buildMaterialityMetrics(classifications: ESGTransaction[]): MaterialityMetric[] {
  const totalFootprint = classifications.reduce((sum, item) => sum + item.classification.calculated_footprint, 0);
  const scope3 = classifications
    .filter((item) => item.classification.scope === EmissionScope.Scope3)
    .reduce((sum, item) => sum + item.classification.calculated_footprint, 0);
  const unverified = classifications.filter((item) => !item.audit_metadata.is_verified).length;

  return [
    {
      metric_name: "Carbon Exposure",
      financial_impact_score: Math.min(10, Math.max(4, Math.round(totalFootprint / 2200))),
      environmental_impact_score: Math.min(10, Math.max(5, Math.round(totalFootprint / 1600))),
      description: `${formatNumber(totalFootprint)} kgCO2e classified from the current ERP sample.`,
      status: totalFootprint > 10000 ? "Critical" : "Monitor",
    },
    {
      metric_name: "Scope 3 Dependency",
      financial_impact_score: Math.min(10, Math.max(3, Math.round((scope3 / Math.max(totalFootprint, 1)) * 10))),
      environmental_impact_score: Math.min(10, Math.max(3, Math.round((scope3 / Math.max(totalFootprint, 1)) * 10))),
      description: `${Math.round((scope3 / Math.max(totalFootprint, 1)) * 100)}% of classified footprint is value-chain related.`,
      status: scope3 / Math.max(totalFootprint, 1) > 0.35 ? "Monitor" : "Stable",
    },
    {
      metric_name: "Audit Confidence",
      financial_impact_score: unverified > 0 ? 7 : 3,
      environmental_impact_score: unverified > 0 ? 6 : 3,
      description: `${unverified} transaction${unverified === 1 ? "" : "s"} require analyst review before disclosure lock.`,
      status: unverified > 0 ? "Monitor" : "Stable",
    },
  ];
}

export function summarizeReadiness(classifications: ESGTransaction[]) {
  const total = classifications.reduce((sum, item) => sum + item.classification.calculated_footprint, 0);
  return {
    classified_count: classifications.length,
    verified_count: classifications.filter((item) => item.audit_metadata.is_verified).length,
    total_kg_co2e: Number(total.toFixed(2)),
    high_risk_count: classifications.filter((item) => item.classification.calculated_footprint > 3000).length,
  };
}

export function buildToolTrace(classifications: ESGTransaction[]) {
  return [
    {
      tool: "fetch_erp_transactions",
      status: "complete" as const,
      details: `Retrieved ${classifications.length} spend records from Dynamics 365 / SAP mock connectors.`,
      duration_ms: 142,
    },
    {
      tool: "get_ghg_emission_factor",
      status: "complete" as const,
      details: "Mapped transaction descriptions to GHG Protocol-style factors with deterministic audit traces.",
      duration_ms: 218,
    },
    {
      tool: "record_audit_entry",
      status: classifications.every((item) => item.audit_metadata.is_verified) ? ("complete" as const) : ("review" as const),
      details: "Prepared auditable ESG ledger entries and flagged low-confidence classifications for HITL review.",
      duration_ms: 96,
    },
  ];
}

export function fallbackExecutiveSummary(classifications: ESGTransaction[]) {
  const readiness = summarizeReadiness(classifications);
  const top = [...classifications].sort(
    (a, b) => b.classification.calculated_footprint - a.classification.calculated_footprint,
  )[0];

  return `Classified ${readiness.classified_count} ERP transactions into ESG reporting categories with ${formatNumber(readiness.total_kg_co2e)} kgCO2e estimated impact. The largest exposure is ${top.vendor_name} (${top.classification.category}), which should be reviewed first for audit evidence and reduction opportunities.`;
}

function findFactor(transaction: RawERPTransaction): FactorMatch {
  const text = `${transaction.vendor_name} ${transaction.description}`.toLowerCase();
  const scored = FACTOR_LIBRARY.map((factor) => ({
    factor,
    hits: factor.keywords.filter((keyword) => text.includes(keyword)).length,
  })).sort((a, b) => b.hits - a.hits);

  if (scored[0]?.hits) {
    const confidence = Math.min(0.98, scored[0].factor.confidence + scored[0].hits * 0.015);
    return { ...scored[0].factor, confidence };
  }

  return {
    spendType: "UNCLASSIFIED",
    category: "Unclassified Procurement",
    scope: EmissionScope.Scope3,
    factor: 0.05,
    factorUnit: "kgCO2e/USD",
    source: "Fallback spend estimate pending analyst review",
    frameworks: ["CSRD"],
    confidence: 0.42,
    keywords: [],
  };
}

function calculateFootprint(amount: number, match: FactorMatch) {
  return Number((amount * match.factor).toFixed(2));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}
