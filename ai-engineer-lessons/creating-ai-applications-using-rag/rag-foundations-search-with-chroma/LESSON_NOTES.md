# Lesson Notes

## Main Concepts

- Chroma stores documents, IDs, metadata, and embeddings in collections.
- `embedding_function(["text"])` returns a list of embeddings.
- The embedding for one string is the first item: `embedding[0]`.
- The default Chroma embedding model in this lesson is `all-MiniLM-L6-v2`.
- `all-MiniLM-L6-v2` creates 384-dimensional sentence embeddings for semantic search.
- `metadata={"hnsw:space": "cosine"}` configures a Chroma collection to use cosine similarity.
- Semantic search can retrieve relevant documents even when the query does not reuse exact document words.

## Checkpoint Summary

1. Create an embedding for custom text and print the length of `my_embedding[0]`.
2. Create a Chroma collection, embed three documents, add them with IDs, and call `.peek()`.
3. Add two more documents to the cosine collection, then query for the transportation-related document without copying its words.

