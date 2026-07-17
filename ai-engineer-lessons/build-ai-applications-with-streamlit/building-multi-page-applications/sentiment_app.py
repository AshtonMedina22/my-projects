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
    text = re.sub(r"http\S+|www.\S+", "", text)
    text = " ".join(text.split())
    return text[:512]


def create_sentiment_metrics(df):
    """Create sentiment distribution metrics"""
    if df is None or len(df) == 0:
        st.warning("No data available for analysis.")
        return

    total = len(df)
    sentiment_counts = df["sentiment"].value_counts()

    positive_count = sentiment_counts.get("POSITIVE", 0)
    negative_count = sentiment_counts.get("NEGATIVE", 0)
    neutral_count = sentiment_counts.get("NEUTRAL", 0)

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Analyzed", f"{total:,}", help="Total number of texts analyzed")

    with col2:
        positive_pct = (positive_count / total * 100) if total > 0 else 0
        st.metric(
            "Positive",
            f"{positive_count:,} ({positive_pct:.1f}%)",
            delta=f"{positive_pct:.1f}%",
            delta_color="normal",
        )

    with col3:
        negative_pct = (negative_count / total * 100) if total > 0 else 0
        st.metric(
            "Negative",
            f"{negative_count:,} ({negative_pct:.1f}%)",
            delta=f"-{negative_pct:.1f}%",
            delta_color="inverse",
        )

    with col4:
        neutral_pct = (neutral_count / total * 100) if total > 0 else 0
        st.metric(
            "Neutral",
            f"{neutral_count:,} ({neutral_pct:.1f}%)",
            delta=f"{neutral_pct:.1f}%",
            delta_color="off",
        )


# Initialize session state
if "text_history" not in st.session_state:
    st.session_state.text_history = []


# Main App
st.markdown("📊 AI Sentiment Analysis Dashboard")

st.markdown(
    """
Analyze sentiment in text data using state-of-the-art AI models from Hugging Face. 
Upload your data or enter text directly to get insights into emotional tone and sentiment patterns.
"""
)


# Sidebar Configuration
with st.sidebar:
    st.header("🛠️ Configuration")

    model_option = st.selectbox(
        "Choose Model",
        [
            "cardiffnlp/twitter-roberta-base-sentiment-latest (Recommended)",
            "distilbert-base-uncased-finetuned-sst-2-english (Faster)",
        ],
    )

    st.subheader("Analysis Options")
    batch_size = st.slider(
        "Batch Size", 8, 32, 16, help="Larger batches are faster but use more memory"
    )
    confidence_threshold = st.slider(
        "Confidence Threshold",
        0.0,
        1.0,
        0.5,
        help="Minimum confidence to highlight results",
    )

    if st.button("🚀 Load Model", type="primary"):
        with st.spinner("Loading AI model..."):
            time.sleep(2)
        st.success("✅ Model loaded successfully!")


# Main Content Tabs
# Checkpoint 1: Create Tab Structure
tab1, tab2, tab3 = st.tabs(["📝 Text Input", "📁 File Upload", "📊 Results & Analytics"])


# Tab 1: Text Input
with tab1:
    st.header("Single Text Analysis")

    user_text = st.text_area(
        "Enter text to analyze:",
        placeholder="Type or paste your text here...",
        height=150,
    )

    col1, col2 = st.columns([1, 3])
    with col1:
        analyze_button = st.button("Analyze Text", type="primary")

    if analyze_button and user_text:
        with st.spinner("Analyzing sentiment..."):
            cleaned_text = preprocess_text(user_text)
            time.sleep(1)

            import random

            sentiments = ["POSITIVE", "NEGATIVE", "NEUTRAL"]
            mock_sentiment = random.choice(sentiments)
            mock_confidence = random.uniform(0.7, 0.95)

            # Add to session state
            st.session_state.text_history.append(
                {
                    "text": user_text[:100] + "..." if len(user_text) > 100 else user_text,
                    "sentiment": mock_sentiment,
                    "confidence": mock_confidence,
                }
            )

            st.success("✅ Analysis complete!")

            col1, col2 = st.columns(2)
            with col1:
                color_map = {"POSITIVE": "🟢", "NEGATIVE": "🔴", "NEUTRAL": "🔵"}
                st.metric("Sentiment", f"{color_map[mock_sentiment]} {mock_sentiment}")
            with col2:
                st.metric("Confidence", f"{mock_confidence:.1%}")

            st.progress(mock_confidence)


# Checkpoint 2: Create Tab 2 Structure
with tab2:
    st.header("Bulk File Analysis")

    uploaded_file = st.file_uploader(
        "Choose a CSV file",
        type=["csv"],
        help="Upload a CSV file with text data to analyze",
    )

    if uploaded_file:
        try:
            # Read the CSV file
            df = pd.read_csv(uploaded_file)

            st.success(f"✅ File uploaded successfully! Found {len(df)} rows.")

            # Show preview
            with st.expander("📋 Data Preview", expanded=True):
                st.dataframe(df.head(10))

            # Column selection
            text_column = st.selectbox(
                "Select the column containing text to analyze:",
                options=df.columns.tolist(),
                help="Choose which column contains the text you want to analyze",
            )

            # Show sample from selected column
            if text_column:
                st.write("**Sample texts from selected column:**")
                sample_texts = df[text_column].dropna().head(3).tolist()
                for i, text in enumerate(sample_texts, 1):
                    st.write(f"{i}. {str(text)[:100]}{'...' if len(str(text)) > 100 else ''}")

            # Analysis button
            if st.button("🔍 Analyze File", type="primary"):
                with st.spinner(f"Analyzing {len(df)} texts... This may take a few minutes."):
                    # Prepare texts
                    texts = df[text_column].fillna("").apply(preprocess_text).tolist()

                    # Mock batch processing
                    time.sleep(2)

                    # Create mock results
                    import random

                    sentiments = ["POSITIVE", "NEGATIVE", "NEUTRAL"]

                    for text in texts:
                        sentiment = random.choice(sentiments)
                        confidence = random.uniform(0.6, 0.95)
                        st.session_state.text_history.append(
                            {
                                "text": text[:100] + "..." if len(text) > 100 else text,
                                "sentiment": sentiment,
                                "confidence": confidence,
                            }
                        )

                    st.success("✅ File analysis complete!")
                    st.balloons()

        except Exception as e:
            st.error(f"Error reading file: {e}")


# Checkpoint 3: Create Tab Structure Tab3
with tab3:
    st.header("Results & Analytics")

    # Individual text history
    if len(st.session_state.text_history) > 0:
        st.subheader("📝Text Analysis History")

        history_df = pd.DataFrame(st.session_state.text_history)
        create_sentiment_metrics(history_df)

        # Clear history button
        col1, col2 = st.columns([3, 1])
        with col2:
            if st.button("Clear Individual History", type="secondary"):
                st.session_state.text_history = []
                st.rerun()

        # Visualizations
        col1, col2 = st.columns(2)

        with col1:
            st.write("**Sentiment Distribution**")
            sentiment_counts = history_df["sentiment"].value_counts()
            st.bar_chart(sentiment_counts)

        with col2:
            st.write("**Confidence Scores**")
            confidence_data = pd.DataFrame(
                {
                    "confidence": history_df["confidence"],
                    "index": range(len(history_df)),
                }
            ).set_index("index")
            st.line_chart(confidence_data)

        # Data table
        st.dataframe(
            history_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "confidence": st.column_config.ProgressColumn(
                    "Confidence",
                    min_value=0.0,
                    max_value=1.0,
                )
            },
        )
    else:
        st.info("No analyses yet. Use the Text Input or File Upload tabs to start.")
