# Streamlit Chat UI

Lesson notes for the Augmented LLMs for AI Agents section.

## Goal

Build a basic Streamlit chatbot UI backed by the OpenAI Chat Completions API.

## Concepts

- `st.session_state` for preserving chat history across reruns.
- `st.chat_message()` for rendering user and assistant messages.
- `st.chat_input()` for the bottom chat input bar.
- `client.chat.completions.create()` for generating assistant responses from the full message history.

## Checkpoint Snippet

Use `checkpoints.md` for the full paste-ready `main.py` solution.
