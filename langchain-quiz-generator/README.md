# LangChain Quiz Generator

Portfolio-ready educational content generator built with LangChain chain composition.

## What It Does

The app takes a topic and runs two specialized chains:

1. A question-generation chain creates a beginner-level quiz question.
2. An answer-generation chain uses that question to create a detailed answer and explanation.

The chains are connected with `SequentialChain`, which passes the first chain's `question` output into the second chain automatically.

## Features

- Topic input for custom quiz generation
- Learner audience control
- Gemini temperature control
- Two focused `LLMChain` steps with explicit output keys
- `SequentialChain` orchestration
- Session history
- CSV export for generated quiz content
- Demo fallback when no API key is configured

## Tech Stack

- Streamlit
- LangChain
- LangChain Google GenAI
- Gemini 2.0 Flash

## Environment

Set a Gemini API key before running with live model output:

```powershell
$env:GOOGLE_API_KEY="your_new_key_here"
```

The app also supports demo mode when no key is set, so the portfolio page remains usable without exposing secrets.

## Run Locally

```powershell
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Portfolio Focus

This project demonstrates prompt templates, `LLMChain`, explicit output keys, `SequentialChain`, secret-safe API configuration, CSV export, and a user-facing Streamlit interface.
