# Lesson Notes

## Checkpoint 1

Add a model selection dropdown inside the sidebar configuration section.

```python
model_option = st.selectbox(
    "Choose Model",
    [
        "cardiffnlp/twitter-roberta-base-sentiment-latest (Recommended)",
        "distilbert-base-uncased-finetuned-sst-2-english (Faster)"
    ]
)
```

## Checkpoint 2

Add two sliders below the model selector.

```python
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
```

## Checkpoint 3

Add a primary Load Model button with spinner, success message, and balloons.

```python
load_model = st.button("🚀 Load Model", type="primary")
```

## Checkpoint 4

Show selected settings only after the Load Model button has been clicked.

```python
if load_model:
    with st.spinner("Loading AI model..."):
        time.sleep(2)

    st.success("✅ Model loaded successfully!")
    st.balloons()
    st.write(f"Model loaded: {model_option}")
    st.write(f"Batch size: {batch_size}")
    st.write(f"Confidence threshold: {confidence_threshold}")
```

