import streamlit as st
import pandas as pd
import numpy as np
import re
import time
import io
from datetime import datetime
from transformers import pipeline
import torch

# Checkpoint 1: Add Model loading function, libraries, and add to session state
@st.cache_resource
def load_sentiment_model(model_name):
    """Load and cache the sentiment analysis model"""
    try:
        classifier = pipeline(
            'sentiment-analysis',
            model=model_name,
            return_all_scores=True,
            device=0 if torch.cuda.is_available() else -1
        )

        return classifier
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None

def preload_models():
    """Pre-download available models for offline use"""
    load_sentiment_model("distilbert-base-uncased-finetuned-sst-2-english")
    st.success("Model downloaded and cached!")
    
#Checkpoint 4: Implement batch processing for file upload
def analyze_sentiment_batch(texts, classifier, batch_size=16):
    """Analyze sentiment for multiple texts in batches"""
    if classifier is None:
        return None
    
    results = []
    progress_bar = st.progress(0)
    
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        try:
            batch_results = classifier(batch)
            
            for result in batch_results:
                # Find the highest scoring sentiment
                best_result = max(result, key=lambda x: x['score'])
                results.append({
                    'sentiment': best_result['label'].upper(),
                    'confidence': best_result['score']
                })
            
            # Update progress
            progress = min(1.0, (i + batch_size) / len(texts))
            progress_bar.progress(progress)
            
        except Exception as e:
            st.error(f"Error processing batch {i//batch_size + 1}: {e}")
            # Add empty results for failed batch
            results.extend([{'sentiment': 'NEUTRAL', 'confidence': 0.5}] * len(batch))
    
    progress_bar.empty()
    return results

# Add to session state initialization:
if 'model_loaded' not in st.session_state:
    st.session_state.model_loaded = False
if 'classifier' not in st.session_state:
    st.session_state.classifier = None

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

# Initialize session state
if 'text_history' not in st.session_state:
    st.session_state.text_history = []

# Main App
st.markdown('📊 AI Sentiment Analysis Dashboard')

st.markdown("""
Analyze sentiment in text data using state-of-the-art AI models from Hugging Face. 
Upload your data or enter text directly to get insights into emotional tone and sentiment patterns.
""")

# Sidebar Configuration
with st.sidebar:
    st.header("🛠️ Configuration")
    
    # Model selection with display names and actual model names
    model_options = {
        "distilbert-base-uncased-finetuned-sst-2-english (Faster)": "distilbert-base-uncased-finetuned-sst-2-english"
    }
    
    model_display_name = st.selectbox(
        "Choose Model",
        list(model_options.keys())
    )
    
    # Get the actual model name
    actual_model_name = model_options[model_display_name]
    
    st.subheader("Model Management")
    
    # Pre-download models button
    if st.button("Pre-download All Models", help="Download models for offline use"):
        preload_models()
    
    st.subheader("Analysis Options")
    batch_size = st.slider("Batch Size", 8, 32, 16, help="Larger batches are faster but use more memory")
    confidence_threshold = st.slider("Confidence Threshold", 0.0, 1.0, 0.5, help="Minimum confidence to highlight results")
    
    #Checkpoint 2: Update Model Loading Button
    if st.button("Load Model", type="primary"):
        with st.spinner(f"Loading model: {actual_model_name}..."):
            
            # Show model size info
            size_info = {
                "j-hartmann/emotion-english-distilroberta-base": "~82MB",
                "prajjwal1/bert-tiny": "~17MB", 
                "cardiffnlp/twitter-roberta-base-emotion": "~125MB",
                "mock": "0MB (No download)"
            }
            
            if actual_model_name in size_info:
                st.info(f"📦 Model size: {size_info[actual_model_name]}")
            
            st.session_state.classifier = load_sentiment_model(actual_model_name)
            if st.session_state.classifier:
                st.session_state.model_loaded = True
                st.success("Model loaded successfully!")
                st.balloons()
            else:
                st.session_state.model_loaded = False
                st.error("Failed to load model")

# Display model status
if st.session_state.model_loaded:
    st.success("✅ Model is loaded and ready!")
else:
    st.info("ℹ️ Please load a model from the sidebar to begin analysis.")

# Main Content Tabs
tab1, tab2, tab3 = st.tabs(["📝 Text Input", "📁 File Upload", "📊 Analysis History"])

# Tab 1: Text Input
with tab1:
    st.header("Single Text Analysis")
    
    user_text = st.text_area(
        "Enter text to analyze:",
        placeholder="Type or paste your text here...",
        height=150
    )
    
    col1, col2 = st.columns([1, 3])
    with col1:
        analyze_button = st.button("Analyze Text", type="primary", disabled=not st.session_state.model_loaded)

    if analyze_button and user_text and st.session_state.classifier:
        with st.spinner("Analyzing sentiment..."):
            cleaned_text = preprocess_text(user_text)
            
            # Checkpoint3: Real model prediction
            result = st.session_state.classifier([cleaned_text])[0]
            best_result = max(result, key=lambda x: x['score'])
            
            sentiment = best_result['label'].upper()
            confidence = best_result['score']
            
            # Add to history
            st.session_state.text_history.append({
                'text': user_text[:100] + '...' if len(user_text) > 100 else user_text,
                'sentiment': sentiment,
                'confidence': confidence,
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
            st.success("Analysis complete!")
            
            # Display results
            col1, col2 = st.columns(2)
            with col1:
                color_map = {'POSITIVE': '🟢', 'NEGATIVE': '🔴', 'NEUTRAL': '🔵'}
                st.metric("Sentiment", f"{color_map.get(sentiment, '⚪')} {sentiment}")
            with col2:
                st.metric("Confidence", f"{confidence:.2%}")
                
            st.progress(confidence)
            
            # Show confidence threshold
            if confidence < confidence_threshold:
                st.warning(f"⚠️ Low confidence ({confidence:.1%}) - results may be unreliable")

# Tab 2: File Upload
with tab2:
    st.header("Bulk File Analysis")
    
    uploaded_file = st.file_uploader(
        "Choose a CSV file",
        type=['csv'],
        help="Upload a CSV file with text data to analyze"
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
                help="Choose which column contains the text you want to analyze"
            )
            
            # Show sample from selected column
            if text_column:
                st.write("**Sample texts from selected column:**")
                sample_texts = df[text_column].dropna().head(3).tolist()
                for i, text in enumerate(sample_texts, 1):
                    st.write(f"{i}. {str(text)[:100]}{'...' if len(str(text)) > 100 else ''}")
            
            # Analysis button
            if st.button("Analyze File", type="primary", disabled=not st.session_state.model_loaded):
                if not st.session_state.classifier:
                    st.error("Please load the model first!")
                else:
                    texts = df[text_column].fillna("").apply(preprocess_text).tolist()
                    
                    # Limit for performance in restrictive environments
                    if len(texts) > 100:
                        st.warning(f"Large file ({len(texts)} rows). Processing first 100 rows for performance.")
                        texts = texts[:100]
                        df = df.head(100)
                    
                    with st.spinner(f"Analyzing {len(texts)} texts with AI model..."):
                        results = analyze_sentiment_batch(texts, st.session_state.classifier, batch_size)
                        
                        if results:
                            # Add results to the dataframe
                            df['sentiment'] = [r['sentiment'] for r in results]
                            df['confidence'] = [r['confidence'] for r in results]
                            
                            # Add to history (sample only to avoid memory issues)
                            for i, result in enumerate(results[:20]):  # Limit to first 20 for history
                                st.session_state.text_history.append({
                                    'text': texts[i][:100] + '...' if len(texts[i]) > 100 else texts[i],
                                    'sentiment': result['sentiment'],
                                    'confidence': result['confidence'],
                                    'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                })
                            
                            st.success("Analysis complete!")
                            st.balloons()
                            
                            # Show results metrics
                            create_sentiment_metrics(df)
                            
                            # Show results dataframe
                            st.subheader("📊 Analysis Results")
                            st.dataframe(
                                df[['sentiment', 'confidence', text_column]].head(20),
                                use_container_width=True
                            )
                            
                            # Download results
                            csv = df.to_csv(index=False)
                            st.download_button(
                                label="Download Results as CSV",
                                data=csv,
                                file_name=f"sentiment_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                                mime="text/csv"
                            )
                        else:
                            st.error("Batch analysis failed!")
                    
        except Exception as e:
            st.error(f"Error reading file: {e}")

# Tab 3: Analysis History
with tab3:
    st.header("Analysis History")
    
    if st.session_state.text_history:
        history_df = pd.DataFrame(st.session_state.text_history)
        
        # Show summary metrics
        create_sentiment_metrics(history_df)
        
        # Show history table
        st.subheader("Recent Analyses")
        st.dataframe(
            history_df.tail(20)[['timestamp', 'sentiment', 'confidence', 'text']],
            use_container_width=True
        )
        
        # Clear history button
        if st.button("Clear History", type="secondary"):
            st.session_state.text_history = []
            st.success("History cleared!")
            st.rerun()
            
    else:
        st.info("No analysis history available. Start analyzing some text!")
