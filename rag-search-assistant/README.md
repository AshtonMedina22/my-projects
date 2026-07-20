# RAG Search Assistant

Deploy-ready Streamlit app scaffold for the **Building a RAG App** course section.

This version is intentionally lightweight: it uses a small built-in course-note corpus, uploaded `.txt` documents, chunking controls, and TF-IDF similarity search so it can run on Streamlit Community Cloud without API keys. Later RAG lessons can upgrade the retrieval layer to Chroma and the answer layer to an LLM.

## Features

- User question input
- Text file upload and session indexing
- Adjustable chunk size and chunk overlap
- Configurable number of retrieved chunks
- Source-backed answer output
- Retrieved chunk table with source URLs
- Document library and chunk preview
- Keyword chart for retrieved context
- Optional assembled RAG prompt preview
- Optional raw retrieval output preview
- Cost-control estimator for routing simple requests, cheaper model use, premium model fallback, and caching
- Safety scanner for jailbreak phrases and PII leakage patterns

## Run Locally

```bash
streamlit run streamlit_app.py
```

## Streamlit Community Cloud

Use this app path:

```text
rag-search-assistant/streamlit_app.py
```
