import streamlit as st
import chromadb

# Checkpoint 1: Initialize Chroma client and collection
client = chromadb.PersistentClient("./mycollection")
collection = client.get_or_create_collection(name="RAG_Assistant", metadata={"hnsw:space": "cosine"})

# Checkpoint 2: Update previous titles and markdown text
st.title("Similarity Search App")
st.markdown("This app uses Chroma to perform similarity searches on a collection of documents.")
st.sidebar.title("Configuration")
st.sidebar.markdown("Adjust the settings for your query.")

#Checkpoint 3
# a: Add input text widget for user question
user_question = st.text_area("Ask a question", key="user_question")
# b: Add number of results to the sidebar
n_results = st.sidebar.number_input("Number of results", min_value=1, max_value=10, value=1)

# Checkpoint 4: Create a button that triggers the action of querying the Chroma Collection
if st.button("Get Answers"):
    st.write(f"Question: {user_question}")
    st.write(f"Number of Results: {n_results}")
    results = collection.query(query_texts=[user_question], n_results=n_results)


    # Checkpoint 5: Access output from `results`
    for res in results["documents"]:
        for txt in res:
            st.write(txt)
    #before showing it in text, just dump out the raw json, ie
    #st.json(results)
