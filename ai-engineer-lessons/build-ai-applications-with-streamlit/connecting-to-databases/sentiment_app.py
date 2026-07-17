import streamlit as st
import pandas as pd
import numpy as np
import re
import time
import io
import sqlite3
from datetime import datetime


DATABASE_PATH = "data/sentiment_analysis.db"


# Checkpoint 1: Set Up Database connection and functions
@st.cache_resource
def init_database():
    return st.connection("sentiment_db", type="sql", url="sqlite:///data/sentiment_analysis")


def save_to_database(conn, text, sentiment, confidence, source="individual"):
    """Save analysis result to database"""
    sqlite_conn = sqlite3.connect(DATABASE_PATH)
    sqlite_conn.execute(
        """
        INSERT INTO sentiment_results (text, sentiment, confidence, source)
        VALUES (?, ?, ?, ?)
        """,
        (text, sentiment, confidence, source),
    )
    sqlite_conn.commit()
    sqlite_conn.close()


def load_from_database(conn):
    """Load all results from database"""
    query = """
        SELECT text, sentiment, confidence, timestamp, source
        FROM sentiment_results
        ORDER BY timestamp DESC
    """
    return conn.query(query, ttl=0)


# Checkpoint 2: Add Database statistic function
def get_database_stats(conn):
    """Get database statistics"""
    total_count = conn.query("SELECT COUNT(*) FROM sentiment_results", ttl=0).iloc[0, 0]

    sentiment_counts_df = conn.query(
        """
        SELECT sentiment, COUNT(*) as count
        FROM sentiment_results
        GROUP BY sentiment
        """,
        ttl=0,
    )

    sentiment_counts = dict(zip(sentiment_counts_df["sentiment"], sentiment_counts_df["count"]))

    return total_count, sentiment_counts


# Other functions
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


# Checkpoint 1: Add database connection to session state
if "db_conn" not in st.session_state:
    st.session_state.db_conn = init_database()

# Initialize session state for temporary data
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
    batch_size = st.slider("Batch Size", 8, 32, 16, help="Larger batches are faster but use more memory")
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
tab1, tab2 = st.tabs(["📝 Text Input", "🗄️ Database"])

# Tab 1: Text Input
with tab1:
    st.header("Single Text Analysis")

    user_text = st.text_area(
        "Enter text to analyze:",
        placeholder="Type or paste your text here...",
        height=150,
    )

    col1, col2, col3 = st.columns([1, 1, 2])
    with col1:
        analyze_button = st.button("Analyze Text", type="primary")
    with col2:
        save_to_db = st.checkbox("Save to Database", value=True)

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

            # Checkpoint 3: Add Database Save Option to Text Analysis
            if save_to_db:
                save_to_database(st.session_state.db_conn, cleaned_text, mock_sentiment, mock_confidence)
                st.success("✅ Analysis complete and saved to database!")
            else:
                st.success("✅ Analysis complete!")

            col1, col2 = st.columns(2)
            with col1:
                color_map = {"POSITIVE": "🟢", "NEGATIVE": "🔴", "NEUTRAL": "🔵"}
                st.metric("Sentiment", f"{color_map[mock_sentiment]} {mock_sentiment}")
            with col2:
                st.metric("Confidence", f"{mock_confidence:.1%}")

            st.progress(mock_confidence)


# Checkpoint 4: Create Database Management Tab
with tab2:
    st.header("Database Management")
    st.caption("Manage your persistent sentiment analysis data")

    # Database statistics
    total_count, sentiment_counts = get_database_stats(st.session_state.db_conn)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Records", total_count)
    with col2:
        st.metric("Positive", sentiment_counts.get("POSITIVE", 0))
    with col3:
        st.metric("Negative", sentiment_counts.get("NEGATIVE", 0))
    with col4:
        st.metric("Neutral", sentiment_counts.get("NEUTRAL", 0))

    if total_count > 0:
        # Load and display database data
        db_df = load_from_database(st.session_state.db_conn)

        st.subheader("📊 Database Analytics")
        create_sentiment_metrics(db_df)

        # Display database results
        st.subheader("📋 Database Records")
        st.dataframe(db_df.head(), use_container_width=True, hide_index=True)
    else:
        st.info("No database records yet. Analyze and save text to add records.")
