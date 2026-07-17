import streamlit as st
import pandas as pd
import numpy as np
import re
import time
import io
from datetime import datetime


# Functions
def preprocess_text(text):
    """Clean and preprocess text for better analysis"""
    if pd.isna(text):
        return ""

    text = str(text)
    text = re.sub(r'http\S+|www.\S+', '', text)
    text = ' '.join(text.split())
    return text[:512]

def create_sentiment_metrics(df):
    """Create sentiment distribution metrics"""
    if df is None or len(df) == 0:
        st.warning("No data available for analysis.")
        return

    total = len(df)
    sentiment_counts = df['sentiment'].value_counts()

    positive_count = sentiment_counts.get('POSITIVE', 0)
    negative_count = sentiment_counts.get('NEGATIVE', 0)
    neutral_count = sentiment_counts.get('NEUTRAL', 0)

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Analyzed", f"{total:,}", help="Total number of texts analyzed")

    with col2:
        positive_pct = (positive_count / total * 100) if total > 0 else 0
        st.metric("Positive", f"{positive_count:,} ({positive_pct:.1f}%)",
                 delta=f"{positive_pct:.1f}%", delta_color="normal")

    with col3:
        negative_pct = (negative_count / total * 100) if total > 0 else 0
        st.metric("Negative", f"{negative_count:,} ({negative_pct:.1f}%)",
                 delta=f"-{negative_pct:.1f}%", delta_color="inverse")

    with col4:
        neutral_pct = (neutral_count / total * 100) if total > 0 else 0
        st.metric("Neutral", f"{neutral_count:,} ({neutral_pct:.1f}%)",
                 delta=f"{neutral_pct:.1f}%", delta_color="off")

# Checkpoint1: Initialize session state
if "text_history" not in st.session_state:
    st.session_state.text_history = []

# Main App
st.markdown('📊 AI Sentiment Analysis Dashboard')

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
batch_size = st.sidebar.slider("Batch Size", 8, 32, 16, help="Larger batches are faster but use more memory")
confidence_threshold = st.sidebar.slider("Confidence Threshold", 0.0, 1.0, 0.5, help="Minimum confidence to highlight results")

if st.sidebar.button("🚀 Load Model", type="primary"):
    with st.sidebar:
        with st.spinner("Loading AI model..."):
            time.sleep(2)
        st.success("✅ Model loaded successfully!")

# Text Analysis
st.subheader("📝 Text Analysis")

user_text = st.text_area(
    "Enter text to analyze:",
    placeholder="Type or paste your text here...",
    height=150
)

col1, col2 = st.columns([1, 3])
with col1:
    analyze_button = st.button("Analyze Text", type="primary")

if analyze_button and user_text:
    with st.spinner("Analyzing sentiment..."):
        cleaned_text = preprocess_text(user_text)
        time.sleep(1)

        import random
        sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL']
        mock_sentiment = random.choice(sentiments)
        mock_confidence = random.uniform(0.7, 0.95)

        # Checkpoint 2: Add Persistent Text Analysis History
        st.session_state.text_history.append({
            'text': cleaned_text,
            'sentiment': mock_sentiment,
            'confidence': mock_confidence
        })

        st.success("✅ Analysis complete!")

        col1, col2 = st.columns(2)
        with col1:
            color_map = {'POSITIVE': '🟢', 'NEGATIVE': '🔴', 'NEUTRAL': '🔵'}
            st.metric("Sentiment", f"{color_map[mock_sentiment]} {mock_sentiment}")
        with col2:
            st.metric("Confidence", f"{mock_confidence:.1%}")

        st.progress(mock_confidence)

# Results Display
st.markdown("---")
st.subheader("📊 Results & Analytics")

# Checkpoint 3: Display Persistent Results
if len(st.session_state.text_history) > 0:
    st.subheader("📝 Individual Text Analysis History")

    col1, col2 = st.columns([3, 1])
    if len(st.session_state.text_history) > 0:
        history_df = pd.DataFrame(st.session_state.text_history)
        create_sentiment_metrics(history_df)

        st.dataframe(
            history_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "confidence": st.column_config.ProgressColumn(
                    "Confidence",
                    help="Confidence score of the analysis",
                    min_value=0.0,
                    max_value=1.0,
                )
            }
        )
    with col2:
        #Checkpoint 4: Add Clear History Functionality
        if st.button("Clear History", type="secondary"):
            st.session_state.text_history = []
            st.rerun()

