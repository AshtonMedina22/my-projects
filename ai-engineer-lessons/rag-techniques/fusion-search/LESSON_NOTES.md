# Lesson Notes

Fusion Search improves retrieval for complex questions by splitting the original query into smaller subquestions.

In this lesson:

- The model outputs JSON containing 2-4 subquestions.
- Python parses the JSON with `json.loads`.
- Each subquestion is answered through the existing RAG helper functions.
- The subquestion Q&A pairs are concatenated as supporting context.
- A final prompt asks the model to answer the original query using the supporting Q&A context.

This is a notebook-only RAG technique lesson. It does not add a new Streamlit UI feature yet.
