# Mini Quiz Generator Lesson

Course project notes for the LangChain chain-composition quiz generator.

## Project Goal

Build an educational quiz generator that uses sequential chain composition:

1. Generate a beginner-level quiz question from a topic.
2. Generate a detailed answer and explanation from that question.

## Required Components

- `PromptTemplate`
- `LLMChain`
- `SequentialChain`
- Google Gemini through `langchain-google-genai`
- Environment variable: `GOOGLE_API_KEY`

## Portfolio Project

The portfolio-ready implementation lives at:

- `../../../langchain-quiz-generator/`

## Helpful Resources

- Google Gemini API keys: https://aistudio.google.com/app/api-keys
- Gemini API docs: https://ai.google.dev/gemini-api/docs
- LangChain Google GenAI integration: https://docs.langchain.com/oss/python/integrations/chat/google_generative_ai
- LangChain overview: https://docs.langchain.com/oss/python/langchain/overview
