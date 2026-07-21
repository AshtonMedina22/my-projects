import { ArrowUpRight, CheckCircle2, RadioTower } from "lucide-react";
import Link from "next/link";
import { archiveProjects, getSourceHref, mainProjects, technicalMoatProjects } from "../../lib/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project OS | Ashton Medina",
  description: "A dashboard view of Ashton Medina's AI engineering portfolio projects.",
};

export default function ProjectsPage() {
  return (
    <main className="app-shell project-os-page">
      <section className="app-header project-os-header">
        <div>
          <p className="eyebrow glow-pill">Project OS</p>
          <h1>Four enterprise agents, live demos, and proof surfaces.</h1>
          <p>
            The portfolio is organized around high-value enterprise workflows: ESG classification, accounts payable
            automation, regulatory triage, and self-healing cloud operations.
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
            <p className="eyebrow">Enterprise Agent Quad</p>
            <h2>Primary AI systems</h2>
          </div>
          <Link className="text-link" href="/live?project=esg">
            Open live console <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="main-project-grid">
          {mainProjects.map((project, index) => (
            <article className="project-card os-project-card" key={project.id}>
              <div className={`project-visual visual-${project.id}`}>
                <span>{project.category}</span>
                <em>{String(index + 1).padStart(2, "0")}</em>
              </div>
              <div className="project-body">
                <p className="project-type">{project.category}</p>
                <h3>{project.title}</h3>
                <div className="project-metric">{project.metrics[0]}</div>
                <p>{project.businessPain}</p>
                <dl className="project-stats">
                  {project.metrics.slice(0, 2).map((metric, metricIndex) => (
                    <div key={metric}>
                      <dt>Signal {metricIndex + 1}</dt>
                      <dd>{metric}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mini-proof-list">
                  {[project.technicalDepth, `Stack: ${project.stack.join(" / ")}`].map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions">
                  <Link href={project.href}>Live app</Link>
                  <Link href={`/projects/${project.id}`}>Case study</Link>
                  <a href={getSourceHref(project)}>Source</a>
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
            ["ESG Integration", "Spend-type mapping into greenhouse gas factors."],
            ["Finance Ops", "Invoice, receipt, and supplier-status orchestration."],
            ["Legal Ops", "Regulatory feed triage and policy impact reporting."],
            ["SRE Automation", "CloudWatch diagnosis and guarded rollback planning."],
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
          {[...technicalMoatProjects, ...archiveProjects].map((project) => (
            <article className="project-card" key={project.id}>
              <div className={`project-visual visual-${project.id}`}>
                <span>{project.category}</span>
                <strong>{project.title}</strong>
              </div>
              <div className="project-body">
                <p className="project-type">{project.category}</p>
                <h3>{project.title}</h3>
                <div className="project-metric">{project.metrics[0]}</div>
                <p>{project.businessPain}</p>
                <div className="card-actions">
                  <Link href={project.href}>Live app</Link>
                  <Link href={`/projects/${project.id}`}>Case study</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
