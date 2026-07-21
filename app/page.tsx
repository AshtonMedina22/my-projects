import {
  ArrowRight,
  ArrowUpRight,
  Map,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { featuredProjects, mainProjects, projects } from "../lib/projects";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const supportingProjects = projects.filter((project) => project.priority === "supporting");

  return (
    <main id="top">
      <section className="portfolio-hero">
        <div className="hero-copy">
          <p className="eyebrow glow-pill">AM.2026 / AI Systems Architect</p>
          <h1>Agentic structures for enterprise operations.</h1>
          <p className="hero-text">
            AI Systems Architect and Solutions Engineer building MCP-connected agents for ESG audit, accounts payable,
            legal compliance, and self-healing cloud operations.
          </p>
          <div className="hero-status">
            <span />
            Available for forward deployed AI engineering roles
          </div>
          <div className="hero-actions">
            <Link className="button primary" href="/projects">
              Open Project OS <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" href="/live">
              Browse all live demos
            </Link>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Primary exports</p>
            <h2>Enterprise Agent Quad</h2>
          </div>
          <Link className="text-link" href="/projects">
            Open project dashboard <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="main-project-grid">
          {mainProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="section portfolio-band">
        <div>
          <p className="eyebrow">Evaluation surface</p>
          <h2>Each core pillar maps to a real enterprise pain point.</h2>
        </div>
        <div className="proof-grid">
          <Evidence
            icon={<Workflow size={20} />}
            title="ESG Audit"
            text="ERP transaction ingestion, spend-type classification, GHG factor mapping, and reviewer-ready evidence."
          />
          <Evidence
            icon={<Map size={20} />}
            title="Finance Ops"
            text="Invoice status checks, receipt matching, supplier notifications, and human approval before remittance."
          />
          <Evidence
            icon={<ShieldCheck size={20} />}
            title="Legal Ops"
            text="Regulatory feed monitoring, jurisdictional triage, policy impact reports, and Slack escalation."
          />
          <Evidence
            icon={<Sparkles size={20} />}
            title="SRE Automation"
            text="CloudWatch monitoring, debate-pattern diagnosis, safe rollback planning, and reasoning audits."
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Supporting systems</p>
            <h2>Additional Live Demos and Analysis Work</h2>
          </div>
        </div>
        <div className="project-grid compact-grid">
          {featuredProjects
            .filter((project) => project.priority !== "main")
            .map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          {supportingProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section id="evidence" className="section deploy-card">
        <div>
          <p className="eyebrow">Platform direction</p>
          <h2>Vercel-native portfolio with live app surfaces.</h2>
          <p>
            The Streamlit and notebook projects remain in the repo as source artifacts, while the public portfolio
            prioritizes fast browser demos and richer Next.js app routes so reviewers can interact with the work
            immediately.
          </p>
        </div>
        <div className="deploy-steps">
          <span>Live apps: trip planner, training manual creator, model demos</span>
          <span>Runtime: Next.js, serverless APIs, OpenAI-ready environment</span>
          <span>Evidence: source links, case pages, metrics, and traceable behavior</span>
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index?: number }) {
  return (
    <article className="project-card">
      <div className={`project-visual visual-${project.slug}`}>
        <span>{project.type}</span>
        {index ? <em>{String(index).padStart(2, "0")}</em> : null}
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
        <div className="card-actions">
          <Link href={project.liveHref}>Live app</Link>
          <Link href={project.caseHref}>Case study</Link>
          {project.sourceHref ? <a href={project.sourceHref}>Source</a> : null}
        </div>
      </div>
    </article>
  );
}

function Evidence({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="evidence-item">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
