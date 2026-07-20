# Lesson Notes

Hypothetical Document Embeddings, or HyDE, changes the retrieval query before vector search.

In this lesson:

- A prompt asks the LLM to write a plausible paragraph answering the user's query.
- That hypothetical answer becomes the text sent to Chroma for similarity search.
- Chroma retrieves chunks that match the hypothetical answer's vocabulary and concepts.
- The original user query and retrieved chunks are used to build the final RAG prompt.
- The LLM generates the final grounded answer from retrieved context.

This is a notebook-only RAG technique lesson. It does not add a new Streamlit UI feature yet.
