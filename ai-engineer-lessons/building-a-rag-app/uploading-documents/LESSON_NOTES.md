# Lesson Notes

## Main Concepts

- `chromadb.PersistentClient("./")` persists the vector database so stored chunks can be reused later.
- `get_or_create_collection()` avoids errors when a collection already exists.
- `metadata={"hnsw:space": "cosine"}` configures cosine similarity for Chroma's HNSW index.
- LangChain's `RecursiveCharacterTextSplitter` splits long documents into retrieval-sized chunks.
- `chunk.page_content` is the text content stored in Chroma.
- Chroma metadata can preserve title, source URL, filename, and chunk index for citations and filtering.

## Checkpoint Summary

1. Create or get a persistent Chroma collection named `RAG_Assistant` with cosine distance.
2. Create a recursive text splitter with the lesson's separators, chunk size, and overlap.
3. Loop through files and append each `chunk.page_content` to `documents`.
4. Add all documents to Chroma and run a sample anthropology query.

