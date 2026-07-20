# Lesson Notes

## Main Concepts

- Naive character chunking is simple, but it can split words and sentences in bad places.
- Sentence splitting is better, but manual sentence rules become fragile quickly.
- LangChain's `RecursiveCharacterTextSplitter` tries larger separators first, then falls back to smaller separators.
- Chunk overlap preserves context across neighboring chunks.
- Chroma documents can include metadata, such as a source URL and chunk index.
- In LangChain `Document` objects, the text lives in `chunk.page_content`.

## Checkpoint Summary

1. Split the llama article into 300-character chunks and return the first three.
2. Use `RecursiveCharacterTextSplitter` with `chunk_size=1500` and `chunk_overlap=300`.
3. Add each LangChain chunk to a Chroma collection named `llama_chunks`, including metadata, then query it.

