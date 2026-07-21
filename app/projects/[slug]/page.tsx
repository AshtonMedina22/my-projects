import { notFound } from "next/navigation";
import { getProject } from "../../../lib/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Ashton Medina AI Portfolio`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="app-shell">
      <section className="project-detail-hero">
        <div>
          <p className="eyebrow">{project.type}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="hero-actions">
            <a className="button primary" href={project.liveHref}>
              Open live app
            </a>
            {project.sourceHref ? (
              <a className="button secondary" href={project.sourceHref}>
                Review source
              </a>
            ) : null}
          </div>
        </div>
        <div className="hero-panel compact-panel">
          {project.stats.map((stat) => (
            <div className="metric" key={stat.label}>
              <span className="metric-value">{stat.value}</span>
              <span className="metric-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section detail-grid">
        <article className="detail-panel">
          <h2>What It Demonstrates</h2>
          <div className="tag-row">
            {project.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
        <article className="detail-panel">
          <h2>Portfolio Proof</h2>
          <ul className="clean-list">
            {project.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
