# Ashton Medina AI Engineering Projects

This repo keeps Codecademy AI engineering notebooks, lesson exports, and portfolio-ready machine learning projects. It now includes a Next.js/Vercel portfolio site where public project CTAs open live browser apps instead of sleeping Streamlit deployments.

## Portfolio Site

- App Router entry: `app/`
- Project registry: `lib/projects.ts`
- Live project hub: `/live`
- Serverless APIs: `app/api/`
- Legacy API source wrappers: `api/`
- Legacy static archive: `legacy-static/`
- Netlify publish directory: `.`
- Vercel root directory: `.`
- Build command: `npm run build`

The homepage highlights Banking77 intent classification, transformer finetuning, neural-network architecture work, computer vision apps, RAG prototypes, LangChain chain composition, tool-calling LLM apps, agentic trip planning, and production AI analysis projects. The main visitor path is Vercel-native through Next.js routes; Streamlit files are retained as source/course artifacts where relevant.

## Repo Layout

- `app/` - primary Next.js App Router portfolio, live app pages, and shared layout.
- `app/api/` - Vercel serverless APIs for live AI demos.
- `lib/` - project registry, shared data, and server utilities.
- `docs/` - implementation notes, setup references, and portfolio audit notes.
- `labs/` - Jupyter notebooks, notebook markdown exports, and exploratory course artifacts moved out of the repo root.
- `ai-engineer-lessons/` - organized lesson work for AI Engineer course tasks, including OpenAI Python API, LLM evaluation, LLM benchmark, Streamlit, and RAG lessons.
- `frankenstein-finetuning-portfolio/` - portfolio-ready Frankenstein language model finetuning project with CPU DistilGPT-2 scripts, completed notebooks, dataset, and optional GPU QLoRA notebook.
- `engineer-neural-networks-portfolio/` - portfolio-ready Banking77 intent classification project with datasets, MLP baseline script, transformer notebook, and PII guardrails.
- `legacy-static/live/` - archived pre-Next interactive project hub.
- `api/` - legacy Vercel serverless function wrappers retained for source history.
- `streamlit-image-classification-dashboard/` - portfolio-ready AI image classification dashboard source using Hugging Face ViT and ResNet models, with a Vercel-native public demo at `/live`.
- `rag-search-assistant/` - RAG search assistant source scaffold with lightweight retrieval, cited chunks, and prompt preview, with a Vercel-native public demo at `/live`.
- `recommendation-system-performance/` - recommendation system model-version analysis covering conversion lift, ROI, segment performance, and fairness checks.
- `langchain-quiz-generator/` - portfolio-ready LangChain `LLMChain` and `SequentialChain` project to generate quiz questions and answer keys with Gemini, with a Vercel-native public demo at `/live`.
- `training-manual-creator/` - portfolio-ready augmented LLM app using OpenAI function calling to read, write, delete, and enrich training manual sections; public version runs directly on Vercel.
- `trip-planner-ai-agent/` - main capstone AI agent integrating OpenAI-compatible planning, OpenStreetMap POI search, Wikivoyage retrieval, maps, persistence, and feedback; public version runs directly on Vercel.
- `nn-architectures-project1/` - full Codecademy neural network architectures project bundle with datasets, working notebook, and reference solutions.
- `nn-architectures-project2/` - full Codecademy CLIP vs autoencoder reconstruction project bundle with working notebook, pretrained weights, and reference solutions.
- `custom_torchinfo.py` - local helper used by Codecademy notebooks that import `custom_torchinfo`.
- `codecademy-requirements.txt` - optional local dependencies for running course notebooks.

## Vercel AI SDK

The workspace is configured with the Vercel AI SDK package from `ai-sdk.dev` for future Node/Vercel AI features:

```bash
npm install
npm run check:ai-sdk
```

For live OpenAI-backed checks, set `OPENAI_API_KEY` in your shell or Vercel environment first, then run:

```bash
npm run check:ai-sdk:live
```

Setup details are in `docs/ai-sdk-setup.md`.
