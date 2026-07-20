# Lesson Notes

Decoupling separates retrieval from generation by allowing the retrieved chunk to act as a pointer to a larger context window.

In this lesson:

- Chroma retrieves the most relevant chunk for a query.
- The retrieved chunk's `chunk_idx` metadata is used to fetch `chunk_idx - 1` and `chunk_idx + 1`.
- The previous, current, and next chunks are formatted into XML-style search results.
- The expanded result string is passed into the existing RAG prompt helper.

This is a notebook-only RAG technique lesson. It does not add a new Streamlit UI feature yet.
