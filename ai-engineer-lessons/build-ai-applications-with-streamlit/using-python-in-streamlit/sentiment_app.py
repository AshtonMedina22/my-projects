import streamlit as st
import pandas as pd

st.markdown("# Sentiment Analysis Dashboard")

st.markdown("""
This app analyzes text sentiment using AI models from Hugging Face.
Use it to explore sample text data and prepare for building a full
sentiment analysis workflow.
""")

sample_df = pd.DataFrame({
    "text": [
        "I love this product!",
        "This was a disappointing experience.",
        "The service was okay, but could be better.",
        "Absolutely fantastic results.",
        "I would not recommend this."
    ]
})
sample_df["length"] = sample_df["text"].str.len()

with st.sidebar:
    st.header("🛠️ Configuration")

st.subheader("Sample Sentiment Analysis Data")

st.dataframe(sample_df)
st.line_chart(sample_df["length"])
