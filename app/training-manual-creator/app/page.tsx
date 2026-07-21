import TrainingManualApp from "./training-manual-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Training Manual Creator | Live App",
  description: "Use a tool-calling LLM app that reads, writes, revises, deletes, and enriches training manual sections.",
};

export default function TrainingManualPage() {
  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Main augmented LLM app</p>
          <h1>Training Manual Creator</h1>
          <p>
            A production-style browser UI backed by a Vercel serverless API. The assistant can call tools for
            manual sections and contact lookup without requiring Streamlit.
          </p>
        </div>
        <div className="status-panel">
          <span>Runtime: Vercel Function</span>
          <span>State: Browser session</span>
          <span>Tools: 4</span>
        </div>
      </section>
      <TrainingManualApp />
    </main>
  );
}
