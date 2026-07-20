# Training Manual Creator

This is an augmented LLM app from the AI Engineer agentic systems section. The public portfolio version runs directly on Vercel with a static browser UI and a serverless API route. The original Streamlit version is still included as a course artifact.

- `read_section` reads employee handbook sections from `content/`.
- `write_section` creates or revises complete training manual sections.
- `delete_section` removes a section only when the user clearly asks for deletion.
- `lookup_contact` retrieves verified company contact details from `team_directory.json`.

## Vercel-Native App

- UI: `app.html`
- Client logic: `app.js`
- Serverless API: `../api/training-manual-chat.js`

The Vercel app stores demo manual edits in the visitor's browser session. If `OPENAI_API_KEY` is configured in Vercel, the API can use OpenAI to phrase responses; otherwise, it still works as a deterministic tool-calling demo.

## Streamlit Course Version

```bash
pip install -r requirements.txt
set OPENAI_API_KEY=your_key_here
streamlit run streamlit_app.py
```

If `OPENAI_API_KEY` is missing, the app stays usable in demo mode for portfolio review.

## Portfolio Notes

This project demonstrates tool calling, local file operations, retrieval from structured JSON, chat history management, and safe handling of destructive actions.
