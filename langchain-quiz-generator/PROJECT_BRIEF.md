# Project Brief

## Educational Content Problem

Educators spend significant time creating quiz questions, detailed answers, and explanations. The work is repetitive but quality-sensitive: a good question should match the learner level, and the answer should be accurate, explanatory, and easy to review.

## AI Workflow

This project uses LangChain chain composition to separate content generation into focused operations:

| Step | Chain | Input | Output |
| --- | --- | --- | --- |
| 1 | Question generation | Topic, difficulty, audience | Beginner-friendly quiz question |
| 2 | Answer generation | Generated question | Answer, explanation, key takeaway |

## Core LangChain Components

| Component | Role |
| --- | --- |
| `PromptTemplate` | Defines reusable prompts with placeholders. |
| `LLMChain` | Combines a prompt with the Gemini chat model. |
| `SequentialChain` | Connects chains and manages data flow through input/output keys. |

## Model Configuration

- Provider: Google Gemini
- Model: `gemini-2.0-flash`
- Temperature: user-configurable, default `0.7`
- Key source: `GOOGLE_API_KEY` or `GEMINI_API_KEY`

## Portfolio Upgrade Plan

- Keep the app deployable on Streamlit Community Cloud.
- Keep the Vercel portfolio page as the stable public case-study entry.
- Add a live Streamlit URL to the Vercel card after the app is deployed.
- Later enhancements can include quiz difficulty scoring, multi-question generation, rubric creation, citation-aware RAG quiz generation, and classroom export formats.
