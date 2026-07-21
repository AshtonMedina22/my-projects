import LiveDemo from "./live-demo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live AI Apps | Ashton Medina",
  description: "Open and test the live AI engineering portfolio demos.",
};

export default function LivePage() {
  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Live Project OS</p>
          <h1>Interactive AI system surfaces</h1>
          <p>
            The enterprise agent quad is surfaced first: ESG transaction classification, accounts payable orchestration,
            regulatory triage, and self-healing SRE automation. Supporting demos remain available as evidence of the
            broader course and portfolio buildout.
          </p>
        </div>
        <div className="status-panel">
          <span>Runtime: Next.js</span>
          <span>Core pillars: 4</span>
          <span>API routes: Vercel Functions</span>
        </div>
      </section>
      <LiveDemo />
    </main>
  );
}
