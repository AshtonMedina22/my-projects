# LLM App: Training Manual Creator

## Goal

Create a Streamlit chatbot that augments an LLM with tools for building and maintaining employee training manual content.

## What It Shows

- OpenAI function calling with explicit tool schemas.
- A clean local tool registry.
- File read/write/delete operations wrapped behind tool calls.
- Structured contact lookup from JSON.
- Streamlit chat UI with rendered tool inputs and outputs.
- Demo fallback when API credentials are not configured.

## Suggested Demo Prompts

- Read section 1 and summarize it.
- Look up Sarah Chen's role at the company.
- Write a new section 3 about badge access and facilities.
- Revise section 3 so it includes Sarah Chen as the HR contact.
- Delete section 3.
