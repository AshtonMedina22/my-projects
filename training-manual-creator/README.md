# Training Manual Creator

This is an augmented LLM Streamlit app from the AI Engineer agentic systems section. The app gives an OpenAI chat model four local tools:

- `read_section` reads employee handbook sections from `content/`.
- `write_section` creates or revises complete training manual sections.
- `delete_section` removes a section only when the user clearly asks for deletion.
- `lookup_contact` retrieves verified company contact details from `team_directory.json`.

## Run Locally

```bash
pip install -r requirements.txt
set OPENAI_API_KEY=your_key_here
streamlit run streamlit_app.py
```

If `OPENAI_API_KEY` is missing, the app stays usable in demo mode for portfolio review.

## Portfolio Notes

This project demonstrates tool calling, local file operations, retrieval from structured JSON, chat history management, and safe handling of destructive actions.
