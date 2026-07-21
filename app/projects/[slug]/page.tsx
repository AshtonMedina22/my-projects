import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
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
    <main className="app-shell project-case-page">
      <section className="project-detail-hero">
        <div>
          <p className="eyebrow">{project.type}</p>
          <h1>{project.title}</h1>
          <div className="project-metric detail-metric">{project.metric}</div>
          <p>{project.summary}</p>
          <div className="hero-actions">
            <Link className="button primary" href={project.liveHref}>
              Open live app <ArrowRight size={17} />
            </Link>
            {project.sourceHref ? (
              <a className="button secondary" href={project.sourceHref}>
                Review source <ExternalLink size={16} />
              </a>
            ) : null}
          </div>
        </div>
        <div className="case-metrics">
          {project.stats.map((stat) => (
            <div className="case-metric" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
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
          <ul className="proof-list">
            {project.proof.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
