# RAG Search Assistant

Deploy-ready Streamlit app scaffold for the **Building a RAG App** course section.

This version is intentionally lightweight: it uses a small built-in course-note corpus and TF-IDF similarity search so it can run on Streamlit Community Cloud without API keys. Later RAG lessons can upgrade the retrieval layer to Chroma and the answer layer to an LLM.

## Features

- User question input
- Configurable number of retrieved chunks
- Source-backed answer output
- Retrieved chunk table with source URLs
- Keyword chart for retrieved context
- Optional assembled RAG prompt preview

## Run Locally

```bash
streamlit run streamlit_app.py
```

## Streamlit Community Cloud

Use this app path:

```text
rag-search-assistant/streamlit_app.py
```

