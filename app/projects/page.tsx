import { ArrowUpRight, CheckCircle2, RadioTower } from "lucide-react";
import Link from "next/link";
import { featuredProjects, mainProjects, projects } from "../../lib/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project OS | Ashton Medina",
  description: "A dashboard view of Ashton Medina's AI engineering portfolio projects.",
};

export default function ProjectsPage() {
  const secondaryProjects = featuredProjects.filter((project) => project.priority !== "main");
  const supportingProjects = projects.filter((project) => project.priority === "supporting");

  return (
    <main className="app-shell project-os-page">
      <section className="app-header project-os-header">
        <div>
          <p className="eyebrow glow-pill">Project OS</p>
          <h1>Four hiring pillars, live demos, and proof surfaces.</h1>
          <p>
            The portfolio is organized around the systems an AI engineering team would care about first: reliability,
            enterprise integration, operational agents, and product-grade agent UX.
          </p>
        </div>
        <div className="status-panel os-status">
          <span>Primary exports: 4</span>
          <span>Live surfaces: 13</span>
          <span>Stack: Next.js / Vercel</span>
        </div>
      </section>

      <section className="section flush-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Hiring Quad</p>
            <h2>Primary AI systems</h2>
          </div>
          <Link className="text-link" href="/live?project=rag">
            Open live console <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="main-project-grid">
          {mainProjects.map((project) => (
            <article className="project-card os-project-card" key={project.slug}>
              <div className={`project-visual visual-${project.slug}`}>
                <span>{project.type}</span>
                <strong>{project.title}</strong>
              </div>
              <div className="project-body">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <div className="project-metric">{project.metric}</div>
                <p>{project.summary}</p>
                <dl className="project-stats">
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt>{stat.label}</dt>
                      <dd>{stat.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mini-proof-list">
                  {project.proof.slice(0, 2).map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions">
                  <Link href={project.liveHref}>Live app</Link>
                  <Link href={project.caseHref}>Case study</Link>
                  {project.sourceHref ? <a href={project.sourceHref}>Source</a> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section portfolio-band os-band">
        <div>
          <p className="eyebrow">Operating model</p>
          <h2>Minimal, inspectable, and built around evidence.</h2>
          <p>
            Main cards use the same dimensions, the same stats layout, and the same action hierarchy so reviewers can
            scan quickly without guessing which projects matter most.
          </p>
        </div>
        <div className="proof-grid">
          {[
            ["Reliability", "Corrective retrieval and evidence gates."],
            ["Integration", "Tool schemas and connector boundaries."],
            ["Operations", "Agent diagnosis, review, and verification."],
            ["Product UX", "Live workflow surfaces instead of static summaries."],
          ].map(([title, text]) => (
            <article className="evidence-item" key={title}>
              <span>
                <RadioTower size={18} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section flush-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Additional proof</p>
            <h2>Supporting apps and course builds</h2>
          </div>
        </div>
        <div className="project-grid compact-grid">
          {[...secondaryProjects, ...supportingProjects].map((project) => (
            <article className="project-card" key={project.slug}>
              <div className={`project-visual visual-${project.slug}`}>
                <span>{project.type}</span>
                <strong>{project.title}</strong>
              </div>
              <div className="project-body">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <div className="project-metric">{project.metric}</div>
                <p>{project.summary}</p>
                <div className="card-actions">
                  <Link href={project.liveHref}>Live app</Link>
                  <Link href={project.caseHref}>Case study</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
