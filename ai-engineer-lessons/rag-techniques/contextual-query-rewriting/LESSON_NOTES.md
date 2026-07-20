# Lesson Notes

Contextual Query Rewriting improves retrieval when the user's latest message depends on earlier conversation context.

In this lesson:

- Chat messages are concatenated into a single `chat_history` string.
- The latest query is rewritten by the LLM using the chat history.
- The rewritten query is used for vector retrieval.
- Retrieved chunks are formatted into a RAG prompt.
- The final answer is generated from the rewritten query and retrieved context.

This is a notebook-only RAG technique lesson. It does not add a new Streamlit UI feature yet.
