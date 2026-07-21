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
    slug: "autonomous-esg-transaction-classifier",
    title: "Autonomous ESG Transaction Classifier",
    type: "Capstone: ESG Integration",
    priority: "main",
    metric: "MCP spend mapping",
    summary:
      "An MCP-connected agent concept that reads Dynamics 365 or SAP transaction exports, classifies spend types, and maps each line item to greenhouse gas emission factors for ESG audit workflows.",
    liveHref: "/live?project=esg",
    caseHref: "/projects/autonomous-esg-transaction-classifier",
    sourceHref: `${githubSourceBase}/enterprise-agent-capstones/autonomous-esg-transaction-classifier/README.md`,
    stats: [
      { label: "ERP Inputs", value: "D365/SAP" },
      { label: "Protocol", value: "MCP" },
      { label: "Output", value: "GHG map" },
    ],
    skills: ["Managed MCP", "ERP transaction logs", "GHG taxonomy mapping", "Human-auditable classifications"],
    proof: [
      "Targets a real enterprise pain point: manual ESG review across thousands of purchase transactions.",
      "Separates ERP ingestion, spend-type normalization, emission factor lookup, and audit explanation.",
      "Frames AI autonomy around classifications that remain reviewable by ESG and finance teams.",
    ],
  },
  {
    slug: "payflow-accounts-payable-agent",
    title: "PayFlow Accounts Payable Agent",
    type: "Capstone: Finance Ops",
    priority: "main",
    metric: "Validation before remittance",
    summary:
      "An agentic AP workflow that checks invoice status, matches buyer receipts, retrieves shipment or delivery context, and drafts supplier-facing payment updates behind an approval gate.",
    liveHref: "/live?project=payflow",
    caseHref: "/projects/payflow-accounts-payable-agent",
    sourceHref: `${githubSourceBase}/enterprise-agent-capstones/payflow-accounts-payable-agent/README.md`,
    stats: [
      { label: "ERP", value: "Oracle/Sage" },
      { label: "Control", value: "HITL" },
      { label: "Risk", value: "Funds" },
    ],
    skills: ["AP workflow design", "Receipt matching", "Tool-calling validation loops", "Human approval gates"],
    proof: [
      "Targets supplier relationship friction caused by manual payment inquiries and receipt mismatches.",
      "Keeps remittance actions behind validation and human approval instead of direct autonomous payment.",
      "Uses structured status checks and notification drafting to reduce AP support load.",
    ],
  },
  {
    slug: "regulatory-triage-legal-ops-agent",
    title: "Real-Time Regulatory Triage",
    type: "Capstone: Legal Ops",
    priority: "main",
    metric: "Policy impact report",
    summary:
      "A compliance-lag reduction system that monitors regulatory feeds, extracts new obligations, compares them against internal controls, and sends policy impact alerts to legal operations.",
    liveHref: "/live?project=regulatory",
    caseHref: "/projects/regulatory-triage-legal-ops-agent",
    sourceHref: `${githubSourceBase}/enterprise-agent-capstones/regulatory-triage-legal-ops-agent/README.md`,
    stats: [
      { label: "Feed", value: "Regology" },
      { label: "Graph", value: "LangGraph" },
      { label: "Alert", value: "Slack" },
    ],
    skills: ["Regulatory feed monitoring", "Requirement extraction", "LangGraph triage", "Slack compliance alerts"],
    proof: [
      "Targets compliance lag between regulation publication and internal policy updates.",
      "Uses jurisdictional routing so new obligations are categorized before policy recommendations.",
      "Generates proposed control changes as review artifacts, not silent policy edits.",
    ],
  },
  {
    slug: "self-healing-sre-agentic-devops",
    title: "Self-Healing SRE Agentic DevOps",
    type: "Capstone: Agentic DevOps",
    priority: "main",
    metric: "Monitor -> debate -> rollback",
    summary:
      "A multi-agent SRE system where one agent watches CloudWatch logs, another debates root cause hypotheses, and a guarded executor proposes rollback or autoscaling actions through IaC.",
    liveHref: "/live?project=sre",
    caseHref: "/projects/self-healing-sre-agentic-devops",
    sourceHref: `${githubSourceBase}/enterprise-agent-capstones/self-healing-sre-agentic-devops/README.md`,
    stats: [
      { label: "Logs", value: "CloudWatch" },
      { label: "IaC", value: "CDK/TF" },
      { label: "Audit", value: "DeepEval" },
    ],
    skills: ["CloudWatch monitoring", "Debate-pattern diagnosis", "IaC rollback planning", "Agent reasoning audit"],
    proof: [
      "Targets operational toil caused by log volume in cloud-native environments.",
      "Splits observation, diagnosis, and execution into separate agent responsibilities.",
      "Constrains infrastructure changes behind rollback plans, audit traces, and safety checks.",
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
