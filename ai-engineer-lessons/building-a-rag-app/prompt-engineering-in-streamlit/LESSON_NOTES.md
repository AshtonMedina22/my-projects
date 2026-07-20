# Lesson Notes

## Main Concepts

- `OpenAI()` initializes the OpenAI API client.
- `get_completion(prompt)` sends a system message plus the user prompt to `gpt-3.5-turbo`.
- `collection.query(..., include=["documents", "metadatas"])` retrieves text and metadata.
- `zip(documents, metadatas)` lets each retrieved passage stay paired with its source metadata.
- A RAG prompt should include instructions, the user question, and search results.
- A citation prompt should explicitly tell the model how to use metadata in the answer.

