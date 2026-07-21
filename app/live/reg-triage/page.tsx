import RegTriageApp from "./reg-triage-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Real-Time Regulatory Triage | Ashton Medina",
  description:
    "Legal operations agent for regulatory feed triage, policy impact reports, cross-border conflict detection, and Slack escalation.",
};

export default function RegTriagePage() {
  return (
    <main className="app-shell reg-app-shell">
      <section className="app-header reg-hero">
        <div>
          <p className="eyebrow">Hiring Quad / Legal Ops</p>
          <h1>Real-Time Regulatory Triage</h1>
          <p>
            A live compliance workflow that simulates Regology feed monitoring, LangGraph-style jurisdiction
            routing, policy-control comparison, cross-border conflict detection, and Slack-ready escalation.
          </p>
        </div>
        <div className="status-panel">
          <span>Source: Regology feed mock</span>
          <span>Control: legal review routing</span>
          <span>Runtime: Vercel Function</span>
        </div>
      </section>
      <RegTriageApp />
    </main>
  );
}
