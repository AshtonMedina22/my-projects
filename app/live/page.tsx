import LiveDemo from "./live-demo";

export const metadata = {
  title: "Live AI Apps | Ashton Medina",
  description: "Open and test the live AI engineering portfolio demos.",
};

export default function LivePage() {
  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Live app hub</p>
          <h1>Working AI project demos</h1>
          <p>
            These are public-facing browser experiences for the course and portfolio projects. The highest-value
            projects have full app routes; the rest use fast client-side demos that avoid sleeping Streamlit deploys.
          </p>
        </div>
        <div className="status-panel">
          <span>Runtime: Next.js</span>
          <span>Demos: 9</span>
          <span>API routes: Vercel Functions</span>
        </div>
      </section>
      <LiveDemo />
    </main>
  );
}
