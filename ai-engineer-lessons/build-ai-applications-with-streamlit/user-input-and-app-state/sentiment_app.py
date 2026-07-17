import streamlit as st
import pandas as pd
import numpy as np
import re
import time

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
    text = re.sub(r'http\S+|www.\S+', '', text)
    text = ' '.join(text.split())
    return text[:512]

def create_sentiment_metrics(df):
    """Create sentiment distribution metrics"""
    if df is None or len(df) == 0:
        st.warning("No data available for analysis.")
        return

    # Calculate metrics from DataFrame
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

#Checkpoint 1: Add text input functionality
st.subheader("📝 Text Analysis")

user_text = st.text_area(
    "Enter text to analyze:",
    placeholder="Type or paste text here...",
    height=150
)

if user_text:
    st.write(f"You entered: {user_text}")
else:
    st.write(f"No user text, please input text")

#Checkpoint 2: Add analyze button and show mock results
col1, col2 = st.columns([1, 3])
with col1:
    analyze_button = st.button("Analyze Text", type="primary")

if analyze_button and user_text:
    with st.spinner("Analyzing sentiment..."):
        # Process the text
        cleaned_text = preprocess_text(user_text)
        time.sleep(1)  # Simulate processing

        # Mock results (we don't have real models yet)
        import random
        sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL']
        mock_sentiment = random.choice(sentiments)
        mock_confidence = random.uniform(0.7, 0.95)

        st.success("✅ Analysis complete!")

        col1, col2 = st.columns(2)
        with col1:
            color_map = {'POSITIVE': '🟢', 'NEGATIVE': '🔴', 'NEUTRAL': '🔵'}
            st.metric("Sentiment", f"{color_map[mock_sentiment]} {mock_sentiment}")
        with col2:
            st.metric("Confidence", f"{mock_confidence:.1%}")

        st.progress(mock_confidence)

#Checkpoint 3: Add file upload functionality with CSV reading
uploaded_file = st.file_uploader(
    "Choose a CSV file",
    type=['csv'],
    help="Upload a CSV file containing text samples for batch analysis"
)

if uploaded_file:
    try:
        # Read the CSV file
        df = pd.read_csv(uploaded_file)

        st.success(f"✅ File uploaded successfully! Found {len(df)} rows.")

        # Show preview
        with st.expander("📋 Data Preview", expanded=True):
            ###preview dataframe
            st.dataframe(df.head(10))

        # Show column info
        st.write(f"**Columns available**: {', '.join(df.columns.tolist())}")

    except Exception as e:
        st.error(f"Error reading file: {e}")

#Checkpoint 4: Create a list of texts and verify behavior in the app
list_of_texts = []
if user_text:
    list_of_texts.append(user_text)
st.write(f'List of text inputs: {list_of_texts}')
