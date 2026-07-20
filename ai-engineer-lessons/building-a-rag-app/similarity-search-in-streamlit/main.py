import streamlit as st
import chromadb


# Checkpoint 1: Initialize Chroma client and collection
client = chromadb.PersistentClient(path="./mycollection")

collection = client.get_or_create_collection(
    name="RAG_Assistant",
    metadata={"hnsw:space": "cosine"}
)


# Checkpoint 2: Update previous titles and markdown text
st.title("RAG Similarity Search Assistant")
st.markdown("Ask a question and search the anthropology document collection for relevant chunks.")
st.sidebar.title("Search Settings")
st.sidebar.markdown("Adjust how many matching document chunks Chroma should return.")


# Checkpoint 3
# a: Add input text widget for user question
user_question = st.text_area("Ask a question", key="user_question")

# b: Add number of results to the sidebar
n_results = st.sidebar.number_input(
    "Number of results",
    min_value=1,
    max_value=10,
    value=1
)


# Checkpoint 4: Create a button that triggers the action of querying the Chroma Collection
if st.button("Get Answers"):
    st.write(f"Question: {user_question}")
    st.write(f"Number of Results: {n_results}")

    results = collection.query(
        query_texts=[user_question],
        n_results=n_results
    )

    # Checkpoint 5: Access output from `results`
    for document_list in results["documents"]:
        for document in document_list:
            st.write(document)

    # before showing it in text, just dump out the raw json, ie
    # st.json(results)

