# AI Engineer Lessons

This folder stores lesson work from the AI Engineer course that is important for passing Codecademy checkpoints and for later reference when building portfolio projects.

The goal is to keep lesson code, task notes, and final snippets organized by course unit instead of leaving everything at the repository root.

## Lessons

- `openai-python-api/recipe-blog/` - OpenAI Python API lesson for generating recipe blog content with prompt engineering.
- `evaluating-llms/implementing-evaluation-metrics/` - LLM evaluation lesson covering perplexity and BLEU metrics.
- `llm-benchmarks/sentiment-analysis-benchmark-datasets/` - LLM benchmark lesson using SST-2 and DistilBERT sentiment classification.
- `llm-benchmarks/evaluating-sentiment-analysis/` - LLM benchmark lesson evaluating SST-2 accuracy with Hugging Face Trainer.
- `llm-benchmarks/question-and-answer-benchmark-datasets/` - LLM benchmark lesson using SQuAD and a DistilBERT QA pipeline.
- `llm-benchmarks/evaluating-llms-on-qa-tasks/` - LLM benchmark lesson evaluating SQuAD Q&A with F1 and Exact Match.
- `llm-benchmarks/general-knowledge-benchmark-datasets/` - LLM benchmark lesson evaluating MMLU general knowledge with FLAN-T5.
- `llm-benchmarks/benchmarking-llms-on-multiple-nlp-tasks/` - LLM benchmark project evaluating DistilBERT across sentiment analysis and Q&A.
- `build-ai-applications-with-streamlit/running-your-first-streamlit-app/` - Streamlit intro lesson running the built-in `streamlit hello` demo.
- `build-ai-applications-with-streamlit/using-python-in-streamlit/` - Streamlit lesson building the first sentiment analysis dashboard script.
- `build-ai-applications-with-streamlit/buttons-sliders-and-other-ui-components/` - Streamlit lesson adding model selection, sliders, and button-triggered feedback.
- `build-ai-applications-with-streamlit/displaying-data-and-visualizations/` - Streamlit lesson displaying sentiment KPI metrics, charts, and result tables.
- `build-ai-applications-with-streamlit/user-input-and-app-state/` - Streamlit lesson adding user text input, CSV upload, and app-state behavior notes.
- `build-ai-applications-with-streamlit/using-session-state-for-app-persistence/` - Streamlit lesson persisting text analysis history with `st.session_state`.
- `build-ai-applications-with-streamlit/building-multi-page-applications/` - Streamlit lesson organizing the sentiment analysis app with tabs.
- `build-ai-applications-with-streamlit/connecting-to-databases/` - Streamlit lesson saving and loading sentiment results with SQLite.
- `build-ai-applications-with-streamlit/loading-and-running-models/` - Streamlit lesson loading Hugging Face sentiment models and running predictions.
- `build-ai-applications-with-streamlit/interactive-ml-applications/` - Streamlit lesson comparing preprocessing choices and model predictions.
- `build-ai-applications-with-streamlit/deploying-ai-applications-to-streamlit-community-cloud/` - Streamlit deployment notes for GitHub and Community Cloud.
- `creating-ai-applications-using-rag/rag-foundations-search-with-chroma/` - RAG foundations lesson using Chroma collections, embeddings, and semantic search.
- `creating-ai-applications-using-rag/rag-foundations-document-chunking-with-rag/` - RAG foundations lesson chunking a llama article and storing chunks in Chroma.
- `creating-ai-applications-using-rag/prompt-engineering-for-rag/` - RAG lesson formatting search results into prompts and adding source citations.
- `building-a-rag-app/streamlit-introduction/` - RAG app lesson building the first Streamlit UI with widgets, columns, sidebar, and button output.
- `building-a-rag-app/uploading-documents/` - RAG app lesson uploading chunked anthropology text files into a persistent Chroma collection.
- `building-a-rag-app/similarity-search-in-streamlit/` - RAG app lesson wiring Streamlit controls to a Chroma similarity search query.
- `building-a-rag-app/prompt-engineering-in-streamlit/` - RAG app lesson combining Chroma search results with OpenAI prompt engineering.
- `rag-techniques/setting-up-our-rag-workspace/` - Advanced RAG setup lesson initializing OpenAI, Chroma, textbook chunks, and RAG prompt helpers.
- `rag-techniques/decoupling/` - Advanced RAG lesson expanding retrieved chunks with neighboring context before generation.
- `rag-techniques/contextual-query-rewriting/` - Advanced RAG lesson rewriting chat-dependent questions before vector retrieval.
- `rag-techniques/hypothetical-document-embeddings/` - Advanced RAG lesson using HyDE to retrieve chunks from a hypothetical answer.
- `rag-techniques/fusion-search/` - Advanced RAG lesson decomposing complex questions into subquestions before synthesis.
- `best-practices-in-ai-deployment/data-hygiene-and-privacy-basics/` - Deployment lesson validating data, redacting PII, hashing IDs, and adding private count noise.
