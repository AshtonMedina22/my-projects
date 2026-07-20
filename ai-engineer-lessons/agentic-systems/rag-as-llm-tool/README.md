# RAG As LLM Tool

Lesson notes for adding a simple retrieval tool to the Streamlit function-calling chatbot.

## Goal

Expose a help-center FAQ lookup function to the LLM so it can retrieve relevant customer-service answers from local JSON data before generating a response.

## Files

- `main.py` - Streamlit retrieval chat UI.
- `data/help_center_faq.json` - FAQ knowledge base.
- `tools/search_help_center.py` - keyword FAQ lookup function and retrieval tool schema.
- `tools/handler.py` - tool registry and OpenAI tool-call handler.
- `tools/roll_dice.py` - existing dice tool retained from the previous lesson.
- `checkpoints.md` - paste-ready lesson code.

## Concepts

- RAG as a tool
- Tool description as agent-computer interaction
- Keyword retrieval from local JSON
- OpenAI function calling with multiple tools
- Streamlit rendering of tool calls
