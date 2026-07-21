export type Project = {
  slug: string;
  title: string;
  type: string;
  priority: "main" | "featured" | "supporting";
  summary: string;
  liveHref: string;
  caseHref: string;
  sourceHref?: string;
  metric: string;
  stats: { label: string; value: string }[];
  skills: string[];
  proof: string[];
};

const githubSourceBase = "https://github.com/AshtonMedina22/my-projects/blob/main";

export const projects: Project[] = [
  {
    slug: "corrective-rag-pipeline",
    title: "Corrective RAG Pipeline",
    type: "Hiring Quad: Reliability",
    priority: "main",
    metric: "Self-checking retrieval",
    summary:
      "A reliability-first RAG architecture that evaluates retrieved context before synthesis, then retries or re-ranks when the first pass fails the evidence gate.",
    liveHref: "/live?project=rag",
    caseHref: "/projects/corrective-rag-pipeline",
    sourceHref: `${githubSourceBase}/rag-search-assistant/streamlit_app.py`,
    stats: [
      { label: "Pattern", value: "CRAG" },
      { label: "Gate", value: "Eval" },
      { label: "Output", value: "Cited" },
    ],
    skills: ["Corrective RAG", "Evaluation gates", "Chunk reranking", "Source-grounded synthesis"],
    proof: [
      "Uses retrieval confidence and cited chunks as the reliability surface.",
      "Separates source ingestion, context selection, and answer synthesis into inspectable stages.",
      "Designed to reduce hallucination risk by treating weak retrieval as a recoverable state.",
    ],
  },
  {
    slug: "enterprise-mcp-server",
    title: "Enterprise MCP Server",
    type: "Hiring Quad: Integration",
    priority: "main",
    metric: "Tool-safe integration",
    summary:
      "A Model Context Protocol style connector layer for routing LLM requests into controlled internal tools, legacy data sources, and governed enterprise actions.",
    liveHref: "/live?project=mcp",
    caseHref: "/projects/enterprise-mcp-server",
    sourceHref: `${githubSourceBase}/training-manual-creator`,
    stats: [
      { label: "Protocol", value: "MCP" },
      { label: "Access", value: "RBAC" },
      { label: "Mode", value: "Tools" },
    ],
    skills: ["MCP architecture", "Tool registries", "Schema-first actions", "Enterprise integration"],
    proof: [
      "Promotes controlled tool execution over direct model access to sensitive systems.",
      "Maps natural-language intent into typed operations with explicit parameters.",
      "Uses the Training Manual Creator tool registry as the current working integration base.",
    ],
  },
  {
    slug: "agentic-devops-auto-fixer",
    title: "Agentic DevOps Auto-Fixer",
    type: "Hiring Quad: Orchestration",
    priority: "main",
    metric: "Diagnose -> patch -> verify",
    summary:
      "A multi-agent DevOps architecture where specialized agents monitor failures, diagnose probable causes, draft safe remediation, and require verification before infrastructure changes.",
    liveHref: "/live?project=devops",
    caseHref: "/projects/agentic-devops-auto-fixer",
    sourceHref: `${githubSourceBase}/scripts`,
    stats: [
      { label: "Agents", value: "3" },
      { label: "Control", value: "HITL" },
      { label: "Risk", value: "Guarded" },
    ],
    skills: ["Agent orchestration", "SRE workflows", "Infrastructure guardrails", "Automated verification"],
    proof: [
      "Frames agent autonomy around staged diagnosis, patch planning, and verification.",
      "Keeps high-risk infrastructure actions behind explicit human approval gates.",
      "Connects portfolio deployment work to production incident-response patterns.",
    ],
  },
  {
    slug: "trip-planner-ai-agent",
    title: "Autonomous Trip Planner",
    type: "Hiring Quad: Product Agent",
    priority: "main",
    metric: "Live grounded itinerary",
    summary:
      "A production-style travel planner with OpenAI-compatible planning, OpenStreetMap POI search, Wikivoyage retrieval, itinerary validation, map visualization, and feedback loops.",
    liveHref: "/trip-planner-ai-agent/app",
    caseHref: "/projects/trip-planner-ai-agent",
    sourceHref: `${githubSourceBase}/trip-planner-ai-agent/app.py`,
    stats: [
      { label: "External APIs", value: "3" },
      { label: "Agent tools", value: "2" },
      { label: "Map layer", value: "Live" },
    ],
    skills: ["OpenAI tool orchestration", "OpenStreetMap APIs", "RAG context retrieval", "State persistence"],
    proof: [
      "Uses live geocoding and POI retrieval with deterministic fallback behavior.",
      "Validates generated itinerary items against returned POI identifiers.",
      "Keeps an execution trace visible so visitors can see the agent workflow.",
    ],
  },
  {
    slug: "training-manual-creator",
    title: "Training Manual Creator",
    type: "Augmented LLM app",
    priority: "featured",
    metric: "4 governed tools",
    summary:
      "A Vercel-native tool-calling chatbot that reads, writes, revises, deletes, and enriches employee training manual sections with a JSON-backed contact lookup.",
    liveHref: "/training-manual-creator/app",
    caseHref: "/projects/training-manual-creator",
    sourceHref: `${githubSourceBase}/training-manual-creator/streamlit_app.py`,
    stats: [
      { label: "Tools", value: "4" },
      { label: "Storage", value: "Session" },
      { label: "Fallback", value: "Local" },
    ],
    skills: ["Function calling", "Tool registry design", "Chat UI", "JSON tool rendering"],
    proof: [
      "Runs as a live browser app backed by a Vercel serverless API.",
      "Displays tool calls, inputs, and outputs inside the UI.",
      "Works with OpenAI when configured and has a local deterministic tool fallback.",
    ],
  },
  {
    slug: "banking-intent-classifier",
    title: "Banking Intent Classifier",
    type: "NLP classification capstone",
    priority: "featured",
    metric: "93.47% macro F1",
    summary:
      "End-to-end Banking77 classifier comparing a TF-IDF plus PyTorch MLP baseline against a LoRA-finetuned RoBERTa model with privacy guardrails.",
    liveHref: "/live?project=banking",
    caseHref: "/projects/banking-intent-classifier",
    sourceHref: `${githubSourceBase}/engineer-neural-networks-portfolio/RESULTS.md`,
    stats: [
      { label: "Classes", value: "77" },
      { label: "MLP Accuracy", value: "87.73%" },
      { label: "RoBERTa F1", value: "93.47%" },
    ],
    skills: ["PyTorch", "Hugging Face", "LoRA", "PII redaction"],
    proof: [
      "Compares a baseline model against a transformer finetune.",
      "Documents macro F1, accuracy, and model behavior.",
      "Includes redaction and hashing patterns for sensitive banking text.",
    ],
  },
  {
    slug: "magic-8-ball-ai",
    title: "All-Knowing Magic 8-Ball",
    type: "Interactive AI toy",
    priority: "featured",
    metric: "Server-side AI route",
    summary:
      "A Codecademy Python control-flow project upgraded into a polished Next.js app with an animated 8-Ball, OpenAI-backed fortunes, session history, and fallback behavior for public demos.",
    liveHref: "/magic-8-ball/app",
    caseHref: "/projects/magic-8-ball-ai",
    sourceHref: `${githubSourceBase}/app/magic-8-ball/app/magic-8-ball-app.tsx`,
    stats: [
      { label: "Runtime", value: "Vercel" },
      { label: "AI mode", value: "OpenAI" },
      { label: "Fallback", value: "Built in" },
    ],
    skills: ["Next.js App Router", "AI SDK", "Serverless APIs", "Interactive UI"],
    proof: [
      "Uses a server-only API route so the OpenAI key never reaches the browser.",
      "Keeps the app usable without secrets through deterministic fallback fortunes.",
      "Adds shake and reveal micro-interactions around the original Magic 8-Ball concept.",
    ],
  },
  {
    slug: "image-classification-dashboard",
    title: "AI Image Classification Dashboard",
    type: "Computer vision app",
    priority: "featured",
    metric: "1k ImageNet classes",
    summary:
      "A dashboard for image upload, prediction-style confidence output, classification history, analytics, and Hugging Face ViT/ResNet source review.",
    liveHref: "/live?project=image-classifier",
    caseHref: "/projects/image-classification-dashboard",
    sourceHref: `${githubSourceBase}/streamlit-image-classification-dashboard/streamlit_app.py`,
    stats: [
      { label: "Models", value: "2" },
      { label: "Classes", value: "1k" },
      { label: "Export", value: "CSV" },
    ],
    skills: ["Vision Transformers", "ResNet", "Streamlit", "Dashboard UX"],
    proof: [
      "Keeps a non-sleeping Vercel demo available for public review.",
      "Retains the full Streamlit/Hugging Face implementation as source.",
      "Shows model comparison and confidence-oriented UX patterns.",
    ],
  },
  {
    slug: "rag-search-assistant",
    title: "RAG Search Assistant",
    type: "RAG app",
    priority: "featured",
    metric: "Cited chunk retrieval",
    summary:
      "A retrieval assistant for uploading source documents, chunking with overlap, retrieving cited passages, previewing prompts, estimating costs, and scanning safety risks.",
    liveHref: "/live?project=rag",
    caseHref: "/projects/rag-search-assistant",
    sourceHref: `${githubSourceBase}/rag-search-assistant/streamlit_app.py`,
    stats: [
      { label: "Retrieval", value: "TF-IDF" },
      { label: "Upload", value: "TXT" },
      { label: "Safety", value: "PII" },
    ],
    skills: ["RAG", "Chunking", "Prompt engineering", "PII scanning"],
    proof: [
      "Demonstrates source-grounded retrieval and prompt assembly.",
      "Shows cited chunks instead of unsupported answers.",
      "Connects RAG lessons to a deployable portfolio interface.",
    ],
  },
  {
    slug: "recommendation-system-performance",
    title: "Recommendation System Performance",
    type: "AI deployment analytics",
    priority: "featured",
    metric: "$307k profit audit",
    summary:
      "A model-version analysis comparing conversion lift, profit, AI ROI, segment performance, and fairness risk across three recommendation releases.",
    liveHref: "/live?project=recommendations",
    caseHref: "/projects/recommendation-system-performance",
    sourceHref: `${githubSourceBase}/recommendation-system-performance/analyze_recommendations.py`,
    stats: [
      { label: "Lift", value: "2.45x" },
      { label: "Profit", value: "$307k" },
      { label: "Pick", value: "v1.1" },
    ],
    skills: ["ROI analysis", "Bias testing", "scipy", "Model governance"],
    proof: [
      "Separates conversion performance from cost effectiveness.",
      "Uses chi-square testing for regional and age-group bias checks.",
      "Frames model selection as a business deployment decision.",
    ],
  },
  {
    slug: "sequential-quiz-generator",
    title: "Sequential Quiz Generator",
    type: "LangChain app project",
    priority: "featured",
    metric: "2-chain composition",
    summary:
      "A Gemini/LangChain project using prompt templates, LLMChain output keys, and SequentialChain orchestration to generate quiz questions and answer keys.",
    liveHref: "/live?project=quiz",
    caseHref: "/projects/sequential-quiz-generator",
    sourceHref: `${githubSourceBase}/langchain-quiz-generator/streamlit_app.py`,
    stats: [
      { label: "Chains", value: "2" },
      { label: "Model", value: "Gemini" },
      { label: "Mode", value: "Demo" },
    ],
    skills: ["LangChain", "SequentialChain", "PromptTemplate", "Gemini API"],
    proof: [
      "Breaks educational content generation into specialized chain steps.",
      "Documents API key handling and package requirements.",
      "Includes a public Vercel demo for the concept flow.",
    ],
  },
  {
    slug: "frankenstein-finetuning",
    title: "Frankenstein Fanfiction Model",
    type: "Generative transformer finetuning",
    priority: "supporting",
    metric: "LoRA finetuning",
    summary:
      "A language-model finetuning project with prompt generation, perplexity comparison, and optional GPU QLoRA notebook coverage.",
    liveHref: "/live?project=frankenstein",
    caseHref: "/projects/frankenstein-finetuning",
    sourceHref: `${githubSourceBase}/frankenstein-finetuning-portfolio/RESULTS.md`,
    stats: [
      { label: "Base PPL", value: "66.73" },
      { label: "Fine-tuned PPL", value: "66.53" },
      { label: "Approach", value: "LoRA" },
    ],
    skills: ["DistilGPT-2", "Perplexity", "PEFT", "Generation"],
    proof: [
      "Tracks baseline versus finetuned perplexity.",
      "Includes CPU-safe and optional GPU notebooks.",
      "Presents text generation in a lightweight public demo.",
    ],
  },
  {
    slug: "neural-network-architectures",
    title: "Neural Network Architectures",
    type: "Computer vision architecture work",
    priority: "supporting",
    metric: "CNN / AE / CLIP",
    summary:
      "Course project bundle covering CNNs, autoencoders, CLIP-style multimodal ideas, and evaluation notebooks.",
    liveHref: "/live?project=vision",
    caseHref: "/projects/neural-network-architectures",
    sourceHref: `${githubSourceBase}/nn-architectures-project2/index.html`,
    stats: [
      { label: "Patterns", value: "3" },
      { label: "Dataset", value: "CIFAR" },
      { label: "Mode", value: "Notebook" },
    ],
    skills: ["CNNs", "Autoencoders", "CLIP", "Evaluation"],
    proof: [
      "Connects architecture concepts to concrete notebook artifacts.",
      "Includes visual project assets and source bundles.",
      "Gives visitors a fast architecture comparison demo.",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const mainProjects = projects.filter((project) => project.priority === "main");
export const featuredProjects = projects.filter((project) => project.priority !== "supporting");
