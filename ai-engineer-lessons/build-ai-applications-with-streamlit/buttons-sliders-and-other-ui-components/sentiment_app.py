import time

import pandas as pd
import streamlit as st


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

    model_option = st.selectbox(
        "Choose Model",
        [
            "cardiffnlp/twitter-roberta-base-sentiment-latest (Recommended)",
            "distilbert-base-uncased-finetuned-sst-2-english (Faster)"
        ]
    )

    batch_size = st.slider(
        "Batch Size",
        8,
        32,
        16,
        help="Larger batches are faster but use more memory"
    )

    confidence_threshold = st.slider(
        "Confidence Threshold",
        0.0,
        1.0,
        0.5,
        help="Minimum confidence to highlight results"
    )

    load_model = st.button("🚀 Load Model", type="primary")

st.subheader("Sample Sentiment Analysis Data")

st.dataframe(sample_df)
st.line_chart(sample_df["length"])

if load_model:
    with st.spinner("Loading AI model..."):
        time.sleep(2)

    st.success("✅ Model loaded successfully!")
    st.balloons()
    st.write(f"Model loaded: {model_option}")
    st.write(f"Batch size: {batch_size}")
    st.write(f"Confidence threshold: {confidence_threshold}")

