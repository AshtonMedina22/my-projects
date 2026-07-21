import { ArrowUpRight, BrainCircuit, Map, ShieldCheck, Workflow } from "lucide-react";
import { mainProjects, projects } from "../lib/projects";

export default function HomePage() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Live AI engineering portfolio</p>
          <h1>Production-style AI projects people can actually open and use.</h1>
          <p className="hero-text">
            This site is now moving into a Next.js and Vercel AI SDK stack, with public app routes for
            agentic workflows, tool-calling LLMs, RAG, computer vision, NLP, and model evaluation projects.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              View projects
            </a>
            <a className="button secondary" href="/live">
              Open live hub
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Project metrics summary">
          <div className="metric large">
            <span className="metric-value">9</span>
            <span className="metric-label">Portfolio projects on the live site</span>
          </div>
          <div className="metric">
            <span className="metric-value">3</span>
            <span className="metric-label">Main app experiences prioritized</span>
          </div>
          <div className="metric">
            <span className="metric-value">AI SDK</span>
            <span className="metric-label">OpenAI-first Vercel runtime setup</span>
          </div>
          <div className="metric">
            <span className="metric-value">93.47%</span>
            <span className="metric-label">LoRA-RoBERTa macro F1 benchmark</span>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2>Main Portfolio Projects</h2>
          </div>
          <a className="text-link" href="/live">
            Open all demos <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="project-grid">
          {mainProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} featured />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">More evidence</p>
            <h2>Course Projects and Analysis Apps</h2>
          </div>
        </div>
        <div className="project-grid compact-grid">
          {projects
            .filter((project) => project.priority !== "main")
            .map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
      </section>

      <section id="evidence" className="section split-section">
        <div>
          <p className="eyebrow">What this proves</p>
          <h2>Evidence for employers</h2>
        </div>
        <div className="evidence-list">
          <Evidence icon={<Workflow size={20} />} text="Agentic app architecture with tool calls, trace visibility, validation, and fallback behavior." />
          <Evidence icon={<BrainCircuit size={20} />} text="Model comparison work across PyTorch, Hugging Face, LangChain, and OpenAI-backed workflows." />
          <Evidence icon={<Map size={20} />} text="External API integration through OpenStreetMap, Wikivoyage-style retrieval, and serverless routes." />
          <Evidence icon={<ShieldCheck size={20} />} text="Responsible AI patterns including PII scanning, safety guardrails, fairness testing, and cost controls." />
        </div>
      </section>

      <section className="section deploy-card">
        <div>
          <p className="eyebrow">Next.js migration started</p>
          <h2>Built for Vercel, live demos, and richer AI interfaces.</h2>
          <p>
            The portfolio now has App Router pages, typed project data, Vercel Analytics, Speed Insights,
            and app routes for the highest-value live projects. Streamlit notebooks remain as source artifacts,
            while public users get fast browser-accessible demos.
          </p>
        </div>
        <div className="deploy-steps">
          <span>Framework: Next.js App Router</span>
          <span>AI runtime: OpenAI-first AI SDK setup</span>
          <span>Live demos: Vercel routes and functions</span>
        </div>
      </section>
    </main>
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
          <a href={project.caseHref}>Project detail</a>
          {project.sourceHref ? <a href={project.sourceHref}>Source</a> : null}
        </div>
      </div>
    </article>
  );
}

function Evidence({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="evidence-item">
      <span>{icon}</span>
      <p>{text}</p>
    </div>
  );
}
