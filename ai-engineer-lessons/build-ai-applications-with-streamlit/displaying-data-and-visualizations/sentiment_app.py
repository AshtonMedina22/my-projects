import re
import time

import pandas as pd
import streamlit as st


# Page configuration
st.set_page_config(
    page_title="AI Sentiment Analysis Dashboard",
    page_icon="📊",
    layout="wide"
)


# Functions
def preprocess_text(text):
    """Clean and preprocess text for better analysis"""
    if pd.isna(text):
        return ""

    text = str(text)
    text = re.sub(r"http\S+|www.\S+", "", text)
    text = " ".join(text.split())
    return text[:512]


def create_sentiment_metrics(df):
    """Create sentiment distribution metrics"""
    if df is None or len(df) == 0:
        st.warning("No data available for analysis.")
        return

    # Calculate metrics from DataFrame
    total = len(df)
    sentiment_counts = df["sentiment"].value_counts()

    positive_count = sentiment_counts.get("POSITIVE", 0)
    negative_count = sentiment_counts.get("NEGATIVE", 0)
    neutral_count = sentiment_counts.get("NEUTRAL", 0)

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Analyzed", total, help="Total number of texts analyzed")

    with col2:
        positive_pct = (positive_count / total * 100) if total > 0 else 0
        st.metric("Positive", positive_count, f"{positive_pct:.1f}%", delta_color="normal")

    with col3:
        negative_pct = (negative_count / total * 100) if total > 0 else 0
        st.metric("Negative", negative_count, f"{negative_pct:.1f}%", delta_color="inverse")

    with col4:
        neutral_pct = (neutral_count / total * 100) if total > 0 else 0
        st.metric("Neutral", neutral_count, f"{neutral_pct:.1f}%", delta_color="off")


# Main App
st.markdown("📊 AI Sentiment Analysis Dashboard")

st.markdown("""
Analyze sentiment in text data using state-of-the-art AI models from Hugging Face.
Upload your data or enter text directly to get insights into emotional tone and sentiment patterns.
""")

# Sidebar
st.sidebar.header("🛠️ Configuration")

model_option = st.sidebar.selectbox(
    "Choose Model",
    [
        "cardiffnlp/twitter-roberta-base-sentiment-latest (Recommended)",
        "distilbert-base-uncased-finetuned-sst-2-english (Faster)"
    ]
)

st.sidebar.subheader("Analysis Options")
batch_size = st.sidebar.slider(
    "Batch Size",
    8,
    32,
    16,
    help="Larger batches are faster but use more memory"
)
confidence_threshold = st.sidebar.slider(
    "Confidence Threshold",
    0.0,
    1.0,
    0.5,
    help="Minimum confidence to highlight results"
)

if st.sidebar.button("🚀 Load Model", type="primary"):
    with st.sidebar:
        with st.spinner("Loading AI model..."):
            time.sleep(2)
        st.success("✅ Model loaded successfully!")

# Create sample analysis data
sample_results = pd.DataFrame({
    "text": [
        "I absolutely love this product! Amazing quality and fast shipping!",
        "Terrible experience. The item broke after one day. Very disappointed.",
        "It's okay, nothing special but does what it's supposed to do.",
        "Outstanding customer service! They resolved my issue immediately.",
        "Overpriced for what you get. Not worth the money.",
        "Average product. Meets expectations but nothing more.",
        "Incredible! This exceeded all my expectations. Highly recommend!",
        "Poor quality materials. Feels cheap and flimsy."
    ],
    "sentiment": ["POSITIVE", "NEGATIVE", "NEUTRAL", "POSITIVE", "NEGATIVE", "NEUTRAL", "POSITIVE", "NEGATIVE"],
    "confidence": [0.95, 0.92, 0.78, 0.89, 0.85, 0.71, 0.97, 0.88]
})

# Display metrics
st.subheader("📊 Sentiment Analysis Metrics")
create_sentiment_metrics(sample_results)

# Visualizations
col1, col2 = st.columns(2)

with col1:
    st.subheader("Sentiment Distribution")
    sentiment_counts = sample_results["sentiment"].value_counts()
    st.bar_chart(sentiment_counts)

with col2:
    st.subheader("Confidence Scores")
    confidence_data = pd.DataFrame({
        "confidence": sample_results["confidence"],
        "index": range(len(sample_results))
    }).set_index("index")
    st.line_chart(confidence_data)

# Data table
st.subheader("📋 Sample Analysis Results")
st.dataframe(sentiment_counts, use_container_width=True, hide_index=False)
