# Lesson Notes

## Main Concepts

- `chromadb.PersistentClient(path="./mycollection")` loads an existing persistent Chroma database.
- `get_or_create_collection()` retrieves or creates the `RAG_Assistant` collection.
- Streamlit widgets collect the user question and number of results.
- The button triggers `collection.query(query_texts=[user_question], n_results=n_results)`.
- Chroma returns nested lists for `documents`, so displaying documents requires a double loop.

## Checkpoint Summary

1. Initialize persistent Chroma client and cosine collection.
2. Add title, markdown, sidebar title, and sidebar markdown.
3. Add `user_question` text area and sidebar `n_results` number input.
4. Query Chroma when the user clicks `Get Answers`.
5. Loop through `results["documents"]` and display each document with `st.write()`.

