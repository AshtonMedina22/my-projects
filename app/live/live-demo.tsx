"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const demoOptions = [
  { key: "esg-classifier", title: "Autonomous ESG Transaction Classifier" },
  { key: "payflow", title: "PayFlow Accounts Payable Agent" },
  { key: "reg-triage", title: "Real-Time Regulatory Triage" },
  { key: "self-healing-sre", title: "Self-Healing SRE Agentic DevOps" },
  { key: "rbac-graph", title: "RBAC-Secured Enterprise Knowledge Graph" },
  { key: "slm-edge", title: "SLM Edge Deployment" },
  { key: "corrective-rag", title: "Corrective RAG Pipeline" },
  { key: "mcp", title: "Enterprise MCP Server" },
  { key: "devops-agent", title: "Agentic DevOps Auto-Fixer" },
  { key: "trip", title: "Autonomous Trip Planner" },
  { key: "banking", title: "Banking Intent Classifier" },
  { key: "training", title: "Training Manual Creator" },
  { key: "magic", title: "All-Knowing Magic 8-Ball" },
  { key: "image-classifier", title: "Image Classification Dashboard" },
  { key: "rag", title: "RAG Search Assistant" },
  { key: "quiz", title: "Sequential Quiz Generator" },
  { key: "recommendations", title: "Recommendation System Performance" },
  { key: "frankenstein", title: "Frankenstein Finetuning Demo" },
  { key: "vision", title: "Neural Network Architecture Explorer" },
];

const projectAliases: Record<string, string> = {
  esg: "esg-classifier",
  regulatory: "reg-triage",
  sre: "self-healing-sre",
  devops: "self-healing-sre",
  "devops-agent": "self-healing-sre",
};

export default function LiveDemo() {
  const searchParams = useSearchParams();
  const rawProject = searchParams.get("project") ?? "esg-classifier";
  const requestedProject = projectAliases[rawProject] ?? rawProject;
  const initialProject = demoOptions.some((option) => option.key === requestedProject)
    ? requestedProject
    : "esg-classifier";
  const [project, setProject] = useState(initialProject);
  const selected = demoOptions.find((option) => option.key === project) ?? demoOptions[0];

  return (
    <section className="live-project-shell">
      <div className="live-toolbar">
        <div>
          <p className="eyebrow">Selected demo</p>
          <h2>{selected.title}</h2>
        </div>
        <select className="live-select" value={project} onChange={(event) => setProject(event.target.value)}>
          {demoOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.title}
            </option>
          ))}
        </select>
      </div>
      {project === "esg-classifier" ? <EsgDemo /> : null}
      {project === "payflow" ? <PayFlowDemo /> : null}
      {project === "reg-triage" ? <RegulatoryDemo /> : null}
      {project === "self-healing-sre" ? <SelfHealingSreDemo /> : null}
      {project === "rbac-graph" ? <RbacGraphDemo /> : null}
      {project === "slm-edge" ? <SlmEdgeDemo /> : null}
      {project === "corrective-rag" ? <RagDemo /> : null}
      {project === "banking" ? <BankingDemo /> : null}
      {project === "mcp" ? <McpDemo /> : null}
      {project === "devops-agent" ? <DevOpsDemo /> : null}
      {project === "trip" ? <Launcher title="Autonomous Trip Planner" href="/trip-planner-ai-agent/app" /> : null}
      {project === "training" ? <Launcher title="Training Manual Creator" href="/training-manual-creator/app" /> : null}
      {project === "magic" ? <Launcher title="All-Knowing Magic 8-Ball" href="/magic-8-ball/app" /> : null}
      {project === "image-classifier" ? <ImageDemo /> : null}
      {project === "rag" ? <RagDemo /> : null}
      {project === "quiz" ? <QuizDemo /> : null}
      {project === "recommendations" ? <RecommendationDemo /> : null}
      {project === "frankenstein" ? <FrankensteinDemo /> : null}
      {project === "vision" ? <VisionDemo /> : null}
    </section>
  );
}

function EsgDemo() {
  return (
    <Launcher title="Autonomous ESG Transaction Classifier" href="/live/esg-classifier" />
  );
}

function PayFlowDemo() {
  return (
    <Launcher title="PayFlow Accounts Payable Agent" href="/live/payflow" />
  );
}

function RegulatoryDemo() {
  const [feedItem, setFeedItem] = useState("New EU supplier due diligence rule requires enhanced documentation for high-risk vendors.");
  const regions = feedItem.toLowerCase().includes("eu") ? ["EU", "Global suppliers"] : ["US", "General controls"];
  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Regulatory feed item</h2>
        <textarea value={feedItem} onChange={(event) => setFeedItem(event.target.value)} />
      </section>
      <section className="live-panel">
        <h2>Policy impact report</h2>
        <pre>
          {JSON.stringify(
            {
              source: "Regology API",
              jurisdiction_route: regions,
              new_requirement: "Update control evidence for impacted vendors.",
              proposed_control_change: "Add due-diligence document check before vendor approval.",
              alert_channel: "Slack #compliance-alerts",
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
}

function SelfHealingSreDemo() {
  const [logLine, setLogLine] = useState("CloudWatch alarm: p95 latency above 2.8s after release api-2026.07.21.");
  const rollbackLikely = logLine.toLowerCase().includes("release") || logLine.toLowerCase().includes("deploy");
  return (
    <section className="live-panel">
      <h2>Agentic SRE runbook</h2>
      <textarea value={logLine} onChange={(event) => setLogLine(event.target.value)} />
      <div className="architecture-grid">
        {[
          ["Monitor Agent", "CloudWatch anomaly captured", "complete"],
          ["Diagnosis Agent", rollbackLikely ? "Debate favors bad release hypothesis" : "Debate favors capacity hypothesis", "complete"],
          ["Executor Agent", rollbackLikely ? "Draft Terraform/CDK rollback plan" : "Draft autoscaling adjustment", "guarded"],
          ["Audit Gate", "DeepEval reasoning trace required before action", "pending"],
        ].map(([title, text, state]) => (
          <article className="architecture-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
            <strong>{state}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function Launcher({ title, href }: { title: string; href: string }) {
  return (
    <div className="live-panel centered-panel">
      <h2>Full app route</h2>
      <p>{title} has its own Vercel-native app route with serverless API behavior.</p>
      <Link className="button primary" href={href}>
        Open {title}
      </Link>
    </div>
  );
}

function BankingDemo() {
  const [text, setText] = useState("My cash withdrawal failed and the ATM kept my card.");
  const scores = useMemo(() => {
    const lower = text.toLowerCase();
    const candidates = [
      ["cash withdrawal", ["cash", "withdrawal", "atm", "money"]],
      ["card retained", ["kept", "retained", "stuck", "card"]],
      ["identity verification", ["identity", "verify", "passport"]],
      ["direct debit issue", ["debit", "subscription", "charge"]],
    ] as const;
    return candidates
      .map(([label, words], index) => {
        const hits = words.filter((word) => lower.includes(word)).length;
        return { label, score: Math.min(0.98, 0.2 + hits * 0.21 + (4 - index) * 0.04) };
      })
      .sort((a, b) => b.score - a.score);
  }, [text]);

  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Classify customer message</h2>
        <textarea value={text} onChange={(event) => setText(event.target.value)} />
      </section>
      <section className="live-panel">
        <h2>Prediction</h2>
        <div className="prediction-card">
          <span>Top intent</span>
          <strong>{scores[0].label}</strong>
          <p>{Math.round(scores[0].score * 100)}% confidence in demo mode</p>
        </div>
        {scores.map((score) => (
          <Confidence key={score.label} label={score.label} score={score.score} />
        ))}
      </section>
    </div>
  );
}

function ImageDemo() {
  const [image, setImage] = useState<string | null>(null);
  const [label, setLabel] = useState("Upload an image");

  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Upload image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setImage(URL.createObjectURL(file));
            setLabel(file.name);
          }}
        />
        <div className="image-preview-box">
          {/* User-selected blob URLs cannot be optimized by next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image ? <img src={image} alt="Uploaded preview" /> : "No image selected"}
        </div>
      </section>
      <section className="live-panel">
        <h2>Predictions</h2>
        <div className="prediction-card">
          <span>Image file</span>
          <strong>{label}</strong>
          <p>Portfolio-safe Vercel preview of the Hugging Face ViT/ResNet source app.</p>
        </div>
        <Confidence label="Vision Transformer candidate" score={0.82} />
        <Confidence label="ResNet-50 candidate" score={0.76} />
        <Confidence label="Metadata confidence" score={0.68} />
      </section>
    </div>
  );
}

function RagDemo() {
  const [docs, setDocs] = useState(
    "RAG retrieves relevant chunks from a document collection and inserts them into a prompt as context.\nVector databases index embeddings so semantic search can find related text quickly.\nStreamlit session state stores data across app reruns.",
  );
  const [question, setQuestion] = useState("What does RAG retrieve?");
  const chunks = docs.split(/\n+/).filter(Boolean);
  const queryTerms = new Set(question.toLowerCase().split(/\W+/).filter(Boolean));
  const top = chunks
    .map((text, index) => ({
      text,
      index,
      score: text
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => queryTerms.has(word)).length,
    }))
    .sort((a, b) => b.score - a.score)[0];

  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Corrective retrieval console</h2>
        <textarea value={docs} onChange={(event) => setDocs(event.target.value)} />
        <input value={question} onChange={(event) => setQuestion(event.target.value)} />
      </section>
      <section className="live-panel">
        <h2>Evidence gate</h2>
        <div className="prediction-card">
          <span>Retrieval status</span>
          <strong>{top && top.score > 0 ? "Grounded" : "Needs retry"}</strong>
          <p>{top?.text}</p>
        </div>
        <pre>{JSON.stringify({ ...top, corrective_action: top && top.score > 0 ? "synthesize" : "rewrite query" }, null, 2)}</pre>
      </section>
    </div>
  );
}

function McpDemo() {
  const [intent, setIntent] = useState("Create a vendor onboarding task and look up IT Support.");
  const tools = [
    { name: "lookup_contact", risk: "read", schema: "contact_name:string", status: "allowed" },
    { name: "write_section", risk: "write", schema: "section_number:int, content:string", status: "review" },
    { name: "delete_section", risk: "destructive", schema: "section_number:int", status: "blocked" },
  ];
  const selected = intent.toLowerCase().includes("delete") ? tools[2] : intent.toLowerCase().includes("write") || intent.toLowerCase().includes("create") ? tools[1] : tools[0];

  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Connector request</h2>
        <textarea value={intent} onChange={(event) => setIntent(event.target.value)} />
        <div className="prediction-card">
          <span>Routed tool</span>
          <strong>{selected.name}</strong>
          <p>Schema: {selected.schema}</p>
        </div>
      </section>
      <section className="live-panel">
        <h2>Governance registry</h2>
        <div className="architecture-grid">
          {tools.map((tool) => (
            <article className="architecture-card" key={tool.name}>
              <h3>{tool.name}</h3>
              <p>Risk: {tool.risk}</p>
              <p>Contract: {tool.schema}</p>
              <strong>{tool.status}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RbacGraphDemo() {
  const [role, setRole] = useState("Finance Analyst");
  const allowed = role.toLowerCase().includes("finance");
  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Access-aware retrieval</h2>
        <input value={role} onChange={(event) => setRole(event.target.value)} />
        <div className="prediction-card">
          <span>Requested corpus</span>
          <strong>Vendor payment policy graph</strong>
          <p>ACL metadata is evaluated before chunks can enter the answer context.</p>
        </div>
      </section>
      <section className="live-panel">
        <h2>Retrieval gate</h2>
        <pre>
          {JSON.stringify(
            {
              role,
              graph_node: "policy:vendor-payments",
              access: allowed ? "allowed" : "blocked",
              pii_scrub: "verified",
              response_mode: allowed ? "return cited context" : "refuse with access rationale",
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
}

function SlmEdgeDemo() {
  const [command, setCommand] = useState("Summarize local sensor anomaly as JSON");
  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Edge prompt</h2>
        <textarea value={command} onChange={(event) => setCommand(event.target.value)} />
        <div className="prediction-card">
          <span>Runtime target</span>
          <strong>Raspberry Pi 5 / Llama.cpp</strong>
          <p>Quantized SLM pattern for private, low-latency edge inference.</p>
        </div>
      </section>
      <section className="live-panel">
        <h2>Schema-enforced output</h2>
        <pre>
          {JSON.stringify(
            {
              task: command,
              latency_target: "<50ms",
              privacy_mode: "on-device",
              schema_valid: true,
              output_contract: "{ summary: string, severity: enum, action: string }",
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
}

function DevOpsDemo() {
  const [incident, setIncident] = useState("Vercel deployment failed after a package upgrade.");
  const stages = [
    ["Detect", "Build log anomaly found", "complete"],
    ["Diagnose", incident.toLowerCase().includes("package") ? "Dependency drift likely" : "Route/API mismatch likely", "complete"],
    ["Patch Plan", "Prepare minimal diff with rollback note", "pending"],
    ["Verify", "Run typecheck, lint, build, route probes", "blocked until patch approval"],
  ];

  return (
    <section className="live-panel">
      <h2>Agentic incident runbook</h2>
      <textarea value={incident} onChange={(event) => setIncident(event.target.value)} />
      <div className="architecture-grid">
        {stages.map(([stage, result, state]) => (
          <article className="architecture-card" key={stage}>
            <h3>{stage}</h3>
            <p>{result}</p>
            <strong>{state}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuizDemo() {
  const [topic, setTopic] = useState("retrieval augmented generation");
  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Generate quiz</h2>
        <input value={topic} onChange={(event) => setTopic(event.target.value)} />
      </section>
      <section className="live-panel">
        <h2>Question chain output</h2>
        <p>
          <strong>Question:</strong> What problem does {topic || "this topic"} help solve?
        </p>
        <h2>Answer chain output</h2>
        <p>
          <strong>Answer:</strong> It helps connect a learner request with the right information or reasoning steps before
          producing a final response.
        </p>
      </section>
    </div>
  );
}

function RecommendationDemo() {
  const rows = [
    ["v1.0", "5.2%", "412%", "$86k", "Low cost, lower lift"],
    ["v1.1", "7.1%", "538%", "$124k", "Best ROI balance"],
    ["v2.0", "7.6%", "361%", "$97k", "Highest lift, higher cost"],
  ];
  return (
    <section className="live-panel">
      <h2>Model version ROI</h2>
      <div className="architecture-grid">
        {rows.map(([version, conversion, roi, profit, note]) => (
          <article className="architecture-card" key={version}>
            <h3>{version}</h3>
            <p>Conversion: {conversion}</p>
            <p>AI ROI: {roi}</p>
            <p>Total profit: {profit}</p>
            <strong>{note}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function FrankensteinDemo() {
  const [prompt, setPrompt] = useState("I stood alone beneath the pale moon, and the creature");
  return (
    <div className="live-two-column">
      <section className="live-panel">
        <h2>Prompt continuation</h2>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
      </section>
      <section className="live-panel">
        <h2>Generated text</h2>
        <div className="generated-text">
          {prompt} turned toward me with a sorrow that seemed almost human. I could no longer call it merely a monster;
          it was the consequence of ambition left without responsibility.
        </div>
      </section>
    </div>
  );
}

function VisionDemo() {
  return (
    <section className="live-panel">
      <h2>Architecture comparison</h2>
      <div className="architecture-grid">
        {[
          ["CNN", "Local pattern detection with shared kernels for image classification."],
          ["Autoencoder", "Encoder-decoder compression trained through reconstruction loss."],
          ["CLIP-style", "Text-image alignment for zero-shot multimodal classification patterns."],
        ].map(([title, text]) => (
          <article className="architecture-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Confidence({ label, score }: { label: string; score: number }) {
  return (
    <div className="confidence-row">
      <span>{label}</span>
      <div>
        <i style={{ width: `${Math.round(score * 100)}%` }} />
      </div>
      <strong>{Math.round(score * 100)}%</strong>
    </div>
  );
}
