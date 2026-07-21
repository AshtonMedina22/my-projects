import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Code2,
  DatabaseZap,
  Map,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { featuredProjects, mainProjects, projects } from "../lib/projects";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const supportingProjects = projects.filter((project) => project.priority === "supporting");

  return (
    <main id="top">
      <section className="portfolio-hero">
        <div className="hero-copy">
          <p className="eyebrow">AI engineering portfolio</p>
          <h1>Live AI systems, not static project descriptions.</h1>
          <p className="hero-text">
            A working portfolio of agentic apps, AI toys, retrieval systems, model evaluation dashboards, NLP classifiers,
            and deployment-focused AI projects. The strongest projects run directly on Vercel with real app routes,
            serverless APIs, and visible execution behavior.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/trip-planner-ai-agent/app">
              Launch capstone agent <ArrowRight size={17} />
            </a>
            <a className="button secondary" href="/live">
              Browse all live demos
            </a>
          </div>
        </div>

        <aside className="hero-command-center" aria-label="Portfolio summary">
          <div className="command-header">
            <span>Portfolio Signal</span>
            <strong>2026</strong>
          </div>
          <div className="signal-grid">
            <Signal value="10" label="Deployed project demos" />
            <Signal value="3" label="Main portfolio apps" />
            <Signal value="77" label="NLP intent classes" />
            <Signal value="93.47%" label="RoBERTa macro F1" />
          </div>
          <div className="system-stack">
            <span>
              <Code2 size={16} /> Next.js App Router
            </span>
            <span>
              <BrainCircuit size={16} /> OpenAI-ready API routes
            </span>
            <span>
              <DatabaseZap size={16} /> Retrieval + tool state
            </span>
          </div>
        </aside>
      </section>

      <section id="projects" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Priority builds</p>
            <h2>Main Portfolio Projects</h2>
          </div>
          <a className="text-link" href="/live">
            Open live hub <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="main-project-grid">
          {mainProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} featured={index === 0} />
          ))}
        </div>
      </section>

      <section className="section portfolio-band">
        <div>
          <p className="eyebrow">What employers can test</p>
          <h2>Each featured project exposes a concrete engineering behavior.</h2>
        </div>
        <div className="proof-grid">
          <Evidence
            icon={<Workflow size={20} />}
            title="Agentic workflows"
            text="Tool calling, trace output, validation, deterministic fallback paths, and iterative refinement patterns."
          />
          <Evidence
            icon={<Map size={20} />}
            title="External data"
            text="OpenStreetMap-style POI search, travel-guide retrieval, upload flows, source citation, and data export."
          />
          <Evidence
            icon={<ShieldCheck size={20} />}
            title="AI controls"
            text="PII scanning, cost routing, quality checks, fairness testing, and failure handling across projects."
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Applied course work</p>
            <h2>More Live Demos and Analysis Projects</h2>
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

function Signal({ value, label }: { value: string; label: string }) {
  return (
    <div className="signal-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: (typeof projects)[number];
  featured?: boolean;
}) {
  return (
    <article className={`project-card ${featured ? "featured" : ""}`}>
      <div className={`project-visual visual-${project.slug}`}>
        <span>{project.type}</span>
        <strong>{project.title}</strong>
      </div>
      <div className="project-body">
        <p className="project-type">{project.type}</p>
        <h3>{project.title}</h3>
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
          <a href={project.liveHref}>Live app</a>
          <a href={project.caseHref}>Case study</a>
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
