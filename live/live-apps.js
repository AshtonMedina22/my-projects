const projects = {
  banking: {
    title: "Banking Intent Classifier",
    subtitle: "Try a live keyword-backed intent classifier inspired by the Banking77 NLP capstone.",
    render: renderBanking,
  },
  trip: {
    title: "Trip Planner AI Agent",
    subtitle: "Launch the full Vercel-native travel agent with live OpenStreetMap POI search.",
    render: renderTripLauncher,
  },
  frankenstein: {
    title: "Frankenstein Finetuning Demo",
    subtitle: "Generate a short gothic continuation using a portfolio-safe browser demo of the finetuning project.",
    render: renderFrankenstein,
  },
  "vision-architectures": {
    title: "Neural Network Architecture Explorer",
    subtitle: "Compare CNN, autoencoder, and CLIP-style architecture patterns from the computer vision project bundle.",
    render: renderArchitectures,
  },
  "image-classifier": {
    title: "Image Classification Dashboard",
    subtitle: "Upload an image and inspect a Vercel-native portfolio demo with image metadata, confidence bars, and history.",
    render: renderImageClassifier,
  },
  rag: {
    title: "RAG Search Assistant",
    subtitle: "Ask a question against editable source documents and inspect retrieved chunks with citations.",
    render: renderRag,
  },
  quiz: {
    title: "Sequential Quiz Generator",
    subtitle: "Generate a beginner quiz question, answer key, and explanation through a two-step chain simulation.",
    render: renderQuiz,
  },
  training: {
    title: "Training Manual Creator",
    subtitle: "Open the full tool-calling Vercel app for reading, writing, deleting, and enriching manual sections.",
    render: renderTrainingLauncher,
  },
  recommendations: {
    title: "Recommendation System Performance",
    subtitle: "Explore model ROI, conversion lift, segment performance, and fairness tradeoffs.",
    render: renderRecommendations,
  },
};

const root = document.querySelector("#liveRoot");
const selector = document.querySelector("#projectSelector");
const titleEl = document.querySelector("#liveTitle");
const subtitleEl = document.querySelector("#liveSubtitle");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function setProject(projectKey, push = true) {
  const key = projects[projectKey] ? projectKey : "banking";
  selector.value = key;
  titleEl.textContent = projects[key].title;
  subtitleEl.textContent = projects[key].subtitle;
  root.innerHTML = "";
  projects[key].render(root);
  if (push) {
    const url = new URL(window.location.href);
    url.searchParams.set("project", key);
    window.history.replaceState({}, "", url);
  }
}

Object.entries(projects).forEach(([key, project]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = project.title;
  selector.appendChild(option);
});

selector.addEventListener("change", () => setProject(selector.value));
setProject(new URLSearchParams(window.location.search).get("project") || "banking", false);

function renderBanking(node) {
  node.innerHTML = `
    <div class="live-two-column">
      <section class="live-panel">
        <h2>Classify customer message</h2>
        <textarea id="bankingText">My cash withdrawal failed and the ATM kept my card.</textarea>
        <button class="button primary" id="bankingRun">Classify intent</button>
      </section>
      <section class="live-panel" id="bankingResult"></section>
    </div>`;

  const intents = [
    { label: "cash withdrawal", words: ["cash", "withdrawal", "atm", "money"], weight: 0.95 },
    { label: "card retained", words: ["kept", "retained", "stuck", "card"], weight: 0.88 },
    { label: "cash withdrawal card arrival", words: ["cash", "withdrawal", "card", "arrival"], weight: 0.72 },
    { label: "direct debit issue", words: ["debit", "direct", "subscription", "charge"], weight: 0.65 },
    { label: "identity verification", words: ["identity", "verify", "verification", "passport"], weight: 0.6 },
  ];
  const run = () => {
    const words = tokens(document.querySelector("#bankingText").value);
    const scores = intents
      .map((intent) => {
        const hits = intent.words.filter((word) => words.includes(word)).length;
        return { ...intent, score: Math.min(0.99, 0.18 + hits * 0.22 + intent.weight * 0.18) };
      })
      .sort((a, b) => b.score - a.score);
    document.querySelector("#bankingResult").innerHTML = `
      <h2>Prediction</h2>
      <div class="prediction-card">
        <span>Top intent</span>
        <strong>${escapeHtml(scores[0].label)}</strong>
        <p>${Math.round(scores[0].score * 100)}% confidence in demo mode</p>
      </div>
      ${scores.slice(0, 4).map((item) => bar(item.label, item.score)).join("")}
      <p class="muted-note">Portfolio demo mirrors the deployed model workflow without shipping large model weights to the browser.</p>`;
  };
  document.querySelector("#bankingRun").addEventListener("click", run);
  run();
}

function renderTripLauncher(node) {
  node.innerHTML = `
    <div class="live-panel centered-panel">
      <h2>Full trip planner app</h2>
      <p>This project has its own Vercel-native app and serverless API. It does not depend on Streamlit.</p>
      <a class="button primary" href="../trip-planner-ai-agent/app.html">Open Trip Planner AI Agent</a>
      <a class="button secondary" href="../trip-planner-ai-agent/index.html">Read case study</a>
    </div>`;
}

function renderFrankenstein(node) {
  node.innerHTML = `
    <div class="live-two-column">
      <section class="live-panel">
        <h2>Prompt continuation</h2>
        <textarea id="frankPrompt">I stood alone beneath the pale moon, and the creature</textarea>
        <button class="button primary" id="frankRun">Generate continuation</button>
      </section>
      <section class="live-panel">
        <h2>Generated text</h2>
        <div id="frankOutput" class="generated-text"></div>
      </section>
    </div>`;
  const fragments = [
    "turned toward me with a sorrow that seemed almost human.",
    "raised one trembling hand, not in threat, but in appeal.",
    "moved through the cold air as if stitched from grief and lightning.",
    "spoke with a voice that carried both accusation and loneliness.",
  ];
  document.querySelector("#frankRun").addEventListener("click", () => {
    const prompt = document.querySelector("#frankPrompt").value.trim();
    const pick = fragments[Math.abs(prompt.length) % fragments.length];
    document.querySelector("#frankOutput").textContent = `${prompt} ${pick} I could no longer call it merely a monster; it was the consequence of ambition left without responsibility.`;
  });
  document.querySelector("#frankRun").click();
}

function renderArchitectures(node) {
  const data = {
    CNN: ["Local pattern detection", "Shared kernels", "Best for image classification"],
    Autoencoder: ["Encoder-decoder compression", "Reconstruction loss", "Useful for anomaly detection"],
    "CLIP-style": ["Text-image alignment", "Contrastive learning", "Zero-shot classification pattern"],
  };
  node.innerHTML = `
    <div class="live-panel">
      <h2>Architecture comparison</h2>
      <div class="architecture-grid">
        ${Object.entries(data).map(([name, points]) => `
          <article class="architecture-card">
            <h3>${name}</h3>
            ${points.map((point) => `<p>${point}</p>`).join("")}
          </article>`).join("")}
      </div>
    </div>`;
}

function renderImageClassifier(node) {
  node.innerHTML = `
    <div class="live-two-column">
      <section class="live-panel">
        <h2>Upload image</h2>
        <input id="imageInput" type="file" accept="image/*" />
        <div id="imagePreview" class="image-preview-box">No image selected</div>
      </section>
      <section class="live-panel" id="imageResults">
        <h2>Predictions</h2>
        <p>Upload an image to run the Vercel-native portfolio demo.</p>
      </section>
    </div>`;
  document.querySelector("#imageInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const aspect = img.width / img.height;
      const label = aspect > 1.25 ? "landscape or wide object" : aspect < 0.8 ? "portrait object" : "centered subject";
      document.querySelector("#imagePreview").innerHTML = `<img src="${url}" alt="Uploaded preview" />`;
      document.querySelector("#imageResults").innerHTML = `
        <h2>Predictions</h2>
        <div class="prediction-card"><span>Image shape</span><strong>${label}</strong><p>${img.width} x ${img.height}px</p></div>
        ${bar("Vision Transformer candidate", 0.82)}
        ${bar("ResNet-50 candidate", 0.76)}
        ${bar("Metadata confidence", 0.68)}
        <p class="muted-note">The Streamlit source contains the full Hugging Face ViT/ResNet app; this is the non-sleeping Vercel portfolio surface.</p>`;
    };
    img.src = url;
  });
}

function renderRag(node) {
  node.innerHTML = `
    <div class="live-two-column">
      <section class="live-panel">
        <h2>Source documents</h2>
        <textarea id="ragDocs">Streamlit apps rerun from top to bottom after interaction. Session state stores data across reruns.
RAG retrieves relevant chunks from a document collection and inserts them into the prompt as context.
Vector databases index embeddings so semantic search can find related text quickly.</textarea>
        <input id="ragQuestion" value="What does RAG retrieve?" />
        <button class="button primary" id="ragRun">Search</button>
      </section>
      <section class="live-panel" id="ragOutput"></section>
    </div>`;
  const run = () => {
    const questionWords = new Set(tokens(document.querySelector("#ragQuestion").value));
    const chunks = document.querySelector("#ragDocs").value.split(/\n+/).filter(Boolean);
    const ranked = chunks
      .map((text, index) => ({ text, index, score: tokens(text).filter((word) => questionWords.has(word)).length }))
      .sort((a, b) => b.score - a.score);
    const top = ranked[0];
    document.querySelector("#ragOutput").innerHTML = `
      <h2>Retrieved answer</h2>
      <p>${escapeHtml(top.text)}</p>
      <h3>Cited chunk</h3>
      <pre>${escapeHtml(JSON.stringify(top, null, 2))}</pre>`;
  };
  document.querySelector("#ragRun").addEventListener("click", run);
  run();
}

function renderQuiz(node) {
  node.innerHTML = `
    <div class="live-two-column">
      <section class="live-panel">
        <h2>Generate quiz</h2>
        <input id="quizTopic" value="retrieval augmented generation" />
        <button class="button primary" id="quizRun">Run sequential chain</button>
      </section>
      <section class="live-panel" id="quizOutput"></section>
    </div>`;
  document.querySelector("#quizRun").addEventListener("click", () => {
    const topic = document.querySelector("#quizTopic").value.trim() || "AI";
    document.querySelector("#quizOutput").innerHTML = `
      <h2>Question chain output</h2>
      <p><strong>Question:</strong> What problem does ${escapeHtml(topic)} help solve?</p>
      <h2>Answer chain output</h2>
      <p><strong>Answer:</strong> It helps connect a user request with the right information or reasoning steps before producing a final response.</p>
      <p><strong>Explanation:</strong> The first chain drafts the question. The second chain uses that question as input to generate a detailed answer key.</p>`;
  });
  document.querySelector("#quizRun").click();
}

function renderTrainingLauncher(node) {
  node.innerHTML = `
    <div class="live-panel centered-panel">
      <h2>Full training manual tool app</h2>
      <p>This project already runs as a Vercel-native tool-calling app with a serverless API route.</p>
      <a class="button primary" href="../training-manual-creator/app.html">Open Training Manual Creator</a>
      <a class="button secondary" href="../training-manual-creator/index.html">Read case study</a>
    </div>`;
}

function renderRecommendations(node) {
  const modelData = {
    "v1.0": { conversion: 0.052, aiRoi: 412, profit: 86000, bias: "low cost, lower lift" },
    "v1.1": { conversion: 0.071, aiRoi: 538, profit: 124000, bias: "best ROI balance" },
    "v2.0": { conversion: 0.076, aiRoi: 361, profit: 97000, bias: "highest lift, higher cost" },
  };
  node.innerHTML = `
    <div class="live-panel">
      <h2>Model version ROI</h2>
      <div class="architecture-grid">
        ${Object.entries(modelData).map(([version, row]) => `
          <article class="architecture-card">
            <h3>${version}</h3>
            <p>Conversion: ${(row.conversion * 100).toFixed(1)}%</p>
            <p>AI ROI: ${row.aiRoi}%</p>
            <p>Total profit: $${row.profit.toLocaleString()}</p>
            <strong>${row.bias}</strong>
          </article>`).join("")}
      </div>
      <div class="case-callout"><p><strong>Portfolio recommendation:</strong> deploy v1.1 as default and reserve v2.0 for premium/high-value segments.</p></div>
    </div>`;
}

function bar(label, score) {
  return `
    <div class="confidence-row">
      <span>${escapeHtml(label)}</span>
      <div><i style="width:${Math.round(score * 100)}%"></i></div>
      <strong>${Math.round(score * 100)}%</strong>
    </div>`;
}
