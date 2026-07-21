import SelfHealingSreApp from "./self-healing-sre-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Self-Healing SRE Agentic DevOps | Ashton Medina",
  description:
    "Agentic DevOps console for CloudWatch alarm triage, debate-pattern root cause analysis, DeepEval-style audit, and guarded Terraform remediation.",
};

export default function SelfHealingSrePage() {
  return (
    <main className="app-shell sre-app-shell">
      <section className="app-header sre-hero">
        <div>
          <p className="eyebrow">Hiring Quad / Agentic DevOps</p>
          <h1>Self-Healing SRE (Agentic DevOps)</h1>
          <p>
            A live incident-response console that simulates AWS CloudWatch signal ingestion, multi-agent
            root-cause debate, DeepEval-style reasoning audit, and guarded Terraform remediation planning.
          </p>
        </div>
        <div className="status-panel">
          <span>Source: CloudWatch signal mock</span>
          <span>Control: approval-gated remediation</span>
          <span>Runtime: Vercel Function</span>
        </div>
      </section>
      <SelfHealingSreApp />
    </main>
  );
}
