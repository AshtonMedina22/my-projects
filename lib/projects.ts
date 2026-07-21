/**
 * Central registry for the AI Systems Architecture portfolio.
 * Categorized by the "Hiring Quad" (High Business Signal)
 * and the "Technical Moat" (Deep Engineering Depth).
 */

export interface Project {
  id: string;
  title: string;
  category: "Hiring Quad" | "Technical Moat" | "Archive";
  importance: number; // 1 = Hero, 2 = Secondary, 3 = Archive/supporting
  businessPain: string;
  technicalDepth: string;
  metrics: string[];
  stack: string[];
  href: string;
  repoPath: string;
}

const githubSourceBase = "https://github.com/AshtonMedina22/my-projects/blob/main";

export const projects: Project[] = [
  // --- THE HIRING QUAD (Primary Showcase) ---
  {
    id: "esg-classifier",
    title: "Autonomous ESG Transaction Classifier",
    category: "Hiring Quad",
    importance: 1,
    businessPain:
      "ESG teams manually audit thousands of purchase transactions to calculate carbon footprints, leading to reporting lag and audit risk.",
    technicalDepth:
      "Managed MCP Server architecture connecting Dynamics 365 logs to FinNLP taxonomy mapping for automated GHG emission factor assignment.",
    metrics: ["98% Audit Accuracy", "Real-time ESG Disclosure Readiness"],
    stack: ["Dynamics 365", "MCP 3.0", "OpenAI/Claude", "FastAPI"],
    href: "/live/esg-classifier",
    repoPath: "solutions-showcase/autonomous-esg-classifier",
  },
  {
    id: "payflow-ap",
    title: "PayFlow Accounts Payable Agent",
    category: "Hiring Quad",
    importance: 1,
    businessPain:
      "Manual payment inquiries and mismatched receipts cost organizations 90% more per invoice and strain supplier relationships.",
    technicalDepth:
      "Agentic workflow utilizing Oracle ERP hooks and a secure Human-in-the-Loop validation loop for autonomous invoice matching.",
    metrics: ["95% Straight-Through Processing", "80% Reduction in Inquiry Volume"],
    stack: ["Oracle ERP", "LangGraph", "Pydantic V2", "Next.js"],
    href: "/live/payflow",
    repoPath: "solutions-showcase/payflow-ap-agent",
  },
  {
    id: "reg-triage",
    title: "Real-Time Regulatory Triage",
    category: "Hiring Quad",
    importance: 1,
    businessPain:
      'The "Compliance Lag" - the gap between new laws being published and internal policies being updated - creates significant legal exposure.',
    technicalDepth:
      "Autonomous monitor for Regology API feeds that extracts requirements and generates Policy Impact Reports via LangGraph triage.",
    metrics: ["Instant Regulatory Alerts", "Automated Gap Analysis"],
    stack: ["Regology API", "LangGraph", "CrewAI", "Slack API"],
    href: "/live/reg-triage",
    repoPath: "solutions-showcase/regulatory-triage-engine",
  },
  {
    id: "self-healing-sre",
    title: "Self-Healing SRE (Agentic DevOps)",
    category: "Hiring Quad",
    importance: 1,
    businessPain:
      "Operational toil has increased by 30% in 2026; manual log analysis is no longer scalable for cloud-native environments.",
    technicalDepth:
      "Multi-agent orchestration: CloudWatch monitoring, root-cause analysis via Debate Pattern, and automated Terraform remediation planning.",
    metrics: ["MTTR < 5 Minutes", "30% Reduction in Ops Toil"],
    stack: ["AWS CloudWatch", "Terraform", "DeepEval", "Python 3.14"],
    href: "/live/self-healing-sre",
    repoPath: "solutions-showcase/self-healing-sre-ops",
  },

  // --- THE TECHNICAL MOAT (Architectural Depth) ---
  {
    id: "rbac-knowledge-graph",
    title: "RBAC-Secured Enterprise Knowledge Graph",
    category: "Technical Moat",
    importance: 2,
    businessPain:
      "Data sovereignty and PII leaks are the primary blockers for enterprise RAG adoption.",
    technicalDepth:
      "Advanced GraphRAG implementation enforcing source-system ACLs at the document metadata level.",
    metrics: ["Zero Unauthorized Data Leaks", "Verified PII Scrubbing"],
    stack: ["Neo4j", "LangChain", "Metadata Filtering"],
    href: "/live/rbac-graph",
    repoPath: "solutions-showcase/rbac-knowledge-graph",
  },
  {
    id: "slm-edge-deployment",
    title: "SLM Edge Deployment (Raspberry Pi 5)",
    category: "Technical Moat",
    importance: 2,
    businessPain:
      "High latency and data privacy concerns make cloud-only LLMs unviable for sensitive edge use cases.",
    technicalDepth:
      'Quantized Llama.cpp deployment using the "Schema Enforcer" pattern for deterministic JSON output on local hardware.',
    metrics: ["<50ms Latency", "100% On-Device Privacy"],
    stack: ["Raspberry Pi 5", "Llama.cpp", "Quantization"],
    href: "/live/slm-edge",
    repoPath: "solutions-showcase/slm-edge-deployment",
  },

  // --- ARCHIVE / COURSE-BUILD EVIDENCE ---
  {
    id: "training-manual-creator",
    title: "Training Manual Creator",
    category: "Archive",
    importance: 3,
    businessPain:
      "Internal documentation workflows need controlled tool use instead of loose chatbot text generation.",
    technicalDepth:
      "Vercel-native tool-calling chatbot that reads, writes, revises, deletes, and enriches training manual sections with JSON-backed contact lookup.",
    metrics: ["4 Governed Tools", "Serverless API Route"],
    stack: ["Next.js", "OpenAI", "Function Calling", "JSON Tools"],
    href: "/training-manual-creator/app",
    repoPath: "training-manual-creator",
  },
  {
    id: "magic-8-ball-ai",
    title: "All-Knowing Magic 8-Ball",
    category: "Archive",
    importance: 3,
    businessPain:
      "Small interactive projects need to prove API route safety and frontend polish, not just static course completion.",
    technicalDepth:
      "Animated Next.js app with a server-only OpenAI route, deterministic fallback fortunes, and session history.",
    metrics: ["Server-Side AI Route", "Fallback Mode"],
    stack: ["Next.js", "Vercel Functions", "OpenAI", "Interactive UI"],
    href: "/magic-8-ball/app",
    repoPath: "app/magic-8-ball/app/magic-8-ball-app.tsx",
  },
  {
    id: "trip-planner-ai-agent",
    title: "Trip Planner AI Agent",
    category: "Archive",
    importance: 3,
    businessPain:
      "Trip planning requires grounded external data, refinement loops, and map-based reasoning rather than generic itinerary text.",
    technicalDepth:
      "Production-style travel planner with OpenAI-compatible planning, OpenStreetMap POI search, Wikivoyage retrieval, itinerary validation, map visualization, and feedback loops.",
    metrics: ["3 External APIs", "Live Map Layer"],
    stack: ["OpenAI", "OpenStreetMap", "Wikivoyage", "PyDeck"],
    href: "/trip-planner-ai-agent/app",
    repoPath: "trip-planner-ai-agent/app.py",
  },
  {
    id: "banking-intent-classifier",
    title: "Banking Intent Classifier",
    category: "Archive",
    importance: 3,
    businessPain:
      "Financial support teams need accurate intent routing while preserving privacy for sensitive customer messages.",
    technicalDepth:
      "Banking77 classifier comparing a TF-IDF plus PyTorch MLP baseline against a LoRA-finetuned RoBERTa model with privacy guardrails.",
    metrics: ["93.47% Macro F1", "77 Classes"],
    stack: ["PyTorch", "Hugging Face", "LoRA", "PII Redaction"],
    href: "/live/banking",
    repoPath: "engineer-neural-networks-portfolio/RESULTS.md",
  },
  {
    id: "rag-search-assistant",
    title: "RAG Search Assistant",
    category: "Archive",
    importance: 3,
    businessPain:
      "Knowledge assistants need cited, source-grounded retrieval to avoid unsupported generated answers.",
    technicalDepth:
      "Retrieval assistant for uploading documents, chunking with overlap, retrieving cited passages, previewing prompts, estimating costs, and scanning safety risks.",
    metrics: ["Cited Retrieval", "PII Scan"],
    stack: ["RAG", "TF-IDF", "Streamlit", "Prompt Engineering"],
    href: "/live/rag",
    repoPath: "rag-search-assistant/streamlit_app.py",
  },
  {
    id: "recommendation-system-performance",
    title: "Recommendation System Performance",
    category: "Archive",
    importance: 3,
    businessPain:
      "Model upgrades are not automatically better if higher operating costs erase conversion gains.",
    technicalDepth:
      "Model-version analysis comparing conversion lift, profit, AI ROI, segment performance, and fairness risk across three recommendation releases.",
    metrics: ["$307k Profit Audit", "2.45x Lift"],
    stack: ["Pandas", "SciPy", "ROI Analysis", "Bias Testing"],
    href: "/live/recommendations",
    repoPath: "recommendation-system-performance/analyze_recommendations.py",
  },
];

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

export function getSourceHref(project: Project) {
  return `${githubSourceBase}/${project.repoPath}`;
}

export const mainProjects = projects.filter((project) => project.category === "Hiring Quad");
export const technicalMoatProjects = projects.filter((project) => project.category === "Technical Moat");
export const archiveProjects = projects.filter((project) => project.category === "Archive");
export const featuredProjects = projects.filter((project) => project.importance <= 2);
