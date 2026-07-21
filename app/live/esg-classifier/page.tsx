import EsgClassifierApp from "./esg-classifier-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Autonomous ESG Transaction Classifier | Ashton Medina",
  description: "MCP-style ESG audit agent that maps ERP transactions to GHG emission factors.",
};

export default function EsgClassifierPage() {
  return (
    <main className="app-shell esg-app-shell">
      <section className="app-header esg-hero">
        <div>
          <p className="eyebrow">Hiring Quad / ESG Automation</p>
          <h1>Autonomous ESG Transaction Classifier</h1>
          <p>
            A live portfolio system that simulates a Managed MCP Server reading ERP spend logs, mapping each
            transaction to greenhouse gas factors, and producing audit-ready ESG classifications.
          </p>
        </div>
        <div className="status-panel">
          <span>Source: Dynamics 365 / SAP mock</span>
          <span>Frameworks: CSRD / ISSB / GRI</span>
          <span>Runtime: Vercel Function</span>
        </div>
      </section>
      <EsgClassifierApp />
    </main>
  );
}
