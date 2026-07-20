# Function Calling in Streamlit

Lesson notes for moving OpenAI function calling into a Streamlit Chat UI.

## Goal

Build a Streamlit chatbot that can call a Python tool, render the tool input/output in the chat, and preserve tool call metadata in session state.

## Files

- `main.py` - Streamlit chat interface.
- `tools/handler.py` - function registry, tool list, tool-call parsing, function execution, and OpenAI completion wrapper.
- `tools/roll_dice.py` - dice rolling function and OpenAI tool schema.
- `checkpoints.md` - paste-ready lesson snippets.

## Concepts

- `st.session_state.messages`
- `st.session_state.tool_calls`
- OpenAI `tools`
- `message.tool_calls`
- Function registry pattern
- Tool result rendering in Streamlit chat
