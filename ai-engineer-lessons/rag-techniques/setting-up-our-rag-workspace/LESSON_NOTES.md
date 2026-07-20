# Lesson Notes

## Main Concepts

- `OpenAI()` initializes the OpenAI client.
- `client_openai.chat.completions.create()` sends system and user messages to the chosen model.
- `chromadb.PersistentClient("./advanced")` persists the advanced RAG workspace.
- `get_or_create_collection(name="advanced", metadata={"hnsw:space": "cosine"})` creates or retrieves the vector collection.
- Search results are formatted in pseudo-XML so the model can distinguish document text from metadata.
- RAG prompts should tell the model to use search results, admit when information is missing, and cite sources.

