# Lesson Notes

## Main Concepts

- RAG retrieves relevant chunks from a vector database and inserts them into the LLM prompt as context.
- The prompt should clearly separate instructions, the user question, search results, and the answer area.
- `collection.query(query_texts=[query], n_results=n_results)` retrieves relevant Chroma chunks.
- The returned documents live in `search_results["documents"][0]`.
- Prompt engineering should give the model clear purpose, useful context, and the expected output format.
- Cited RAG prompts can ask the model to include the source URL in a predictable format.

## Checkpoint Summary

1. Build a RAG prompt by inserting `{query}` and `{result_str}` into the f-string.
2. Query Chroma, concatenate returned chunks, format the prompt, and return `get_completion`.
3. Add source-citation instructions to the prompt and use the same RAG completion pattern.

