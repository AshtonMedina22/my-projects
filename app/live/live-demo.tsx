"use client";

import { useMemo, useState } from "react";

const demoOptions = [
  { key: "banking", title: "Banking Intent Classifier" },
  { key: "trip", title: "Trip Planner AI Agent" },
  { key: "training", title: "Training Manual Creator" },
  { key: "image-classifier", title: "Image Classification Dashboard" },
  { key: "rag", title: "RAG Search Assistant" },
  { key: "quiz", title: "Sequential Quiz Generator" },
  { key: "recommendations", title: "Recommendation System Performance" },
  { key: "frankenstein", title: "Frankenstein Finetuning Demo" },
  { key: "vision", title: "Neural Network Architecture Explorer" },
];

export default function LiveDemo() {
  const [project, setProject] = useState("banking");
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
      {project === "banking" ? <BankingDemo /> : null}
      {project === "trip" ? <Launcher title="Trip Planner AI Agent" href="/trip-planner-ai-agent/app" /> : null}
      {project === "training" ? <Launcher title="Training Manual Creator" href="/training-manual-creator/app" /> : null}
      {project === "image-classifier" ? <ImageDemo /> : null}
      {project === "rag" ? <RagDemo /> : null}
      {project === "quiz" ? <QuizDemo /> : null}
      {project === "recommendations" ? <RecommendationDemo /> : null}
      {project === "frankenstein" ? <FrankensteinDemo /> : null}
      {project === "vision" ? <VisionDemo /> : null}
    </section>
  );
}

function Launcher({ title, href }: { title: string; href: string }) {
  return (
    <div className="live-panel centered-panel">
      <h2>Full app route</h2>
      <p>{title} has its own Vercel-native app route with serverless API behavior.</p>
      <a className="button primary" href={href}>
        Open {title}
      </a>
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
        <h2>Source documents</h2>
        <textarea value={docs} onChange={(event) => setDocs(event.target.value)} />
        <input value={question} onChange={(event) => setQuestion(event.target.value)} />
      </section>
      <section className="live-panel">
        <h2>Retrieved answer</h2>
        <p>{top?.text}</p>
        <pre>{JSON.stringify(top, null, 2)}</pre>
      </section>
    </div>
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
