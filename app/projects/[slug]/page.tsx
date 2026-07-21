import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getProject, getSourceHref } from "../../../lib/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Ashton Medina AI Portfolio`,
    description: project.businessPain,
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
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <div className="project-metric detail-metric">{project.metrics[0]}</div>
          <p>{project.businessPain}</p>
          <div className="hero-actions">
            <Link className="button primary" href={project.href}>
              Open live app <ArrowRight size={17} />
            </Link>
            <a className="button secondary" href={getSourceHref(project)}>
              Review source <ExternalLink size={16} />
            </a>
          </div>
        </div>
        <div className="case-metrics">
          {project.metrics.map((metric, index) => (
            <div className="case-metric" key={metric}>
              <strong>{metric}</strong>
              <span>Metric {index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section detail-grid">
        <article className="detail-panel">
          <h2>Technical Depth</h2>
          <p>{project.technicalDepth}</p>
          <h2>Stack</h2>
          <div className="tag-row">
            {project.stack.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
        <article className="detail-panel">
          <h2>Portfolio Proof</h2>
          <ul className="proof-list">
            {[
              project.businessPain,
              project.technicalDepth,
              `Repository path: ${project.repoPath}`,
            ].map((item) => (
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
