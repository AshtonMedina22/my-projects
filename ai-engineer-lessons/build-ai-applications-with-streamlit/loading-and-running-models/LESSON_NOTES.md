# Loading and Running Models Notes

## Checkpoints

1. Import `pipeline` from `transformers` and `torch`, then cache `load_sentiment_model()` with `@st.cache_resource`.
2. Use the sidebar **Load Model** button to call `load_sentiment_model()` and store the classifier in session state.
3. Replace mock predictions with `st.session_state.classifier([cleaned_text])`, then select the highest scoring result.
4. Process uploaded CSV text in batches with `analyze_sentiment_batch()` and a progress bar.

