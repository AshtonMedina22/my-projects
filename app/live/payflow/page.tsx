import PayFlowApp from "./payflow-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PayFlow Accounts Payable Agent | Ashton Medina",
  description: "Agentic AP workflow for invoice matching, receipt validation, supplier notices, and approval-gated remittance.",
};

export default function PayFlowPage() {
  return (
    <main className="app-shell payflow-app-shell">
      <section className="app-header payflow-hero">
        <div>
          <p className="eyebrow">Hiring Quad / Enterprise ERP</p>
          <h1>PayFlow Accounts Payable Agent</h1>
          <p>
            A live AP orchestration system that simulates Oracle ERP invoice lookup, purchase-order matching,
            receiving verification, supplier communication, and a hard human approval gate before payment.
          </p>
        </div>
        <div className="status-panel">
          <span>Source: Oracle ERP mock</span>
          <span>Control: SOX 404 approval gate</span>
          <span>Runtime: Vercel Function</span>
        </div>
      </section>
      <PayFlowApp />
    </main>
  );
}
