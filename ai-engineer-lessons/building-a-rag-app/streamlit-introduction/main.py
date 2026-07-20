import streamlit as st


# checkpoint 1: Create a title and write some markdown
st.title("RAG Search Assistant")
st.markdown("Ask a question and configure how your **retrieval-augmented generation** app should respond.")


# checkpoint 2: Add a sidebar
st.sidebar.title("RAG App Settings")
st.sidebar.markdown("Use this sidebar to configure retrieval and model options.")


# checkpoint 3: Create a text area widget
user_question = st.text_area("Ask a question", key="user_question")
st.write(f"User question: {user_question}")


# checkpoint 4: Create columns
col1, col2 = st.columns(2)

n_results = col1.number_input("Number of results", min_value=1, max_value=10, value=1)
col1.write(f"Number of results: {n_results}")

model_choice = col2.selectbox("Choose a model", ["gpt-3", "gpt-4"])
col2.write(f"Selected model: {model_choice}")


# checkpoint 5
if st.button("Get Answers"):
    st.write(f"Model: {model_choice}")
    st.write(f"Question: {user_question}")
    st.write(f"Number of Results: {n_results}")
    st.write("RAG output goes here...")

