export type RegulatoryFramework = "CSRD" | "ISSB" | "GRI" | "SASB" | "TCFD";

export enum EmissionScope {
  Scope1 = "Direct Emissions (Owned/Controlled)",
  Scope2 = "Indirect Emissions (Purchased Electricity/Steam)",
  Scope3 = "Value Chain Emissions (Upstream/Downstream)",
}

export interface AgenticReasoningTrace {
  model_id: string;
  confidence_score: number;
  reasoning_path: string[];
  source_factor_url: string;
  timestamp: string;
}

export interface RawERPTransaction {
  id: string;
  source_system: "Dynamics365" | "SAP" | "Oracle";
  vendor_name: string;
  amount: number;
  currency: "USD" | "L" | "kWh" | "hr" | "kg";
  description: string;
  transaction_date: string;
}

export interface ESGTransaction extends RawERPTransaction {
  classification: {
    category: string;
    scope: EmissionScope;
    ghg_factor: number;
    factor_unit: string;
    unit: "kgCO2e" | "mtCO2e";
    calculated_footprint: number;
  };
  audit_metadata: {
    is_verified: boolean;
    verified_by?: string;
    reasoning_trace: AgenticReasoningTrace;
    framework_mappings: RegulatoryFramework[];
  };
}

export interface MaterialityMetric {
  metric_name: string;
  financial_impact_score: number;
  environmental_impact_score: number;
  description: string;
  status: "Critical" | "Monitor" | "Stable";
}

export interface ESGClassificationResponse {
  mode: "openai" | "demo";
  generated_at: string;
  summary: string;
  audit_readiness: {
    classified_count: number;
    verified_count: number;
    total_kg_co2e: number;
    high_risk_count: number;
  };
  classifications: ESGTransaction[];
  materiality: MaterialityMetric[];
  tool_trace: Array<{
    tool: string;
    status: "complete" | "review";
    details: string;
    duration_ms: number;
  }>;
}
