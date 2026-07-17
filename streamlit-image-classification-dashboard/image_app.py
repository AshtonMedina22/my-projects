import io
import time
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import streamlit as st
import torch
from PIL import Image
from transformers import pipeline


MODEL_OPTIONS = {
    "Google ViT-Base-Patch16-224": {
        "id": "google/vit-base-patch16-224",
        "description": "Vision Transformer trained on ImageNet-1k.",
    },
    "Microsoft ResNet-50": {
        "id": "microsoft/resnet-50",
        "description": "Residual CNN trained on ImageNet-1k.",
    },
}


plt.style.use("default")
sns.set_palette("husl")
sns.set_style("whitegrid")

st.set_page_config(
    page_title="AI Image Classification Dashboard",
    page_icon="🖼️",
    layout="wide",
    initial_sidebar_state="expanded",
)


if "analyzed_images" not in st.session_state:
    st.session_state.analyzed_images = []
if "model_loaded" not in st.session_state:
    st.session_state.model_loaded = False
if "classifier" not in st.session_state:
    st.session_state.classifier = None
if "active_model_name" not in st.session_state:
    st.session_state.active_model_name = None
if "active_model_id" not in st.session_state:
    st.session_state.active_model_id = None


@st.cache_resource(show_spinner=False)
def load_image_classifier(model_id):
    """Load and cache a Hugging Face image classification pipeline."""
    device = 0 if torch.cuda.is_available() else -1
    return pipeline("image-classification", model=model_id, device=device)


def preprocess_image(image):
    """Convert uploaded images to RGB for Hugging Face image classifiers."""
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image


def classify_image(image, classifier, top_k=5):
    """Classify a single image and return predictions plus processing time."""
    start_time = time.perf_counter()
    processed_image = preprocess_image(image)
    predictions = classifier(processed_image, top_k=top_k)
    processing_time = time.perf_counter() - start_time
    return predictions, processing_time


def image_to_png_bytes(image):
    """Store a lightweight display copy in session history."""
    buffer = io.BytesIO()
    preprocess_image(image).save(buffer, format="PNG")
    return buffer.getvalue()


def create_prediction_chart(predictions):
    """Create a horizontal bar chart for the top image predictions."""
    if not predictions:
        return None

    ordered = list(reversed(predictions))
    labels = [pred["label"] for pred in ordered]
    scores = [pred["score"] for pred in ordered]

    fig, ax = plt.subplots(figsize=(10, 5.5))
    bars = ax.barh(labels, scores, color=plt.cm.viridis(np.array(scores)))
    ax.set_xlabel("Confidence Score")
    ax.set_title("Top Predictions")
    ax.set_xlim(0, 1)

    for bar in bars:
        width = bar.get_width()
        ax.text(
            min(width + 0.015, 0.98),
            bar.get_y() + bar.get_height() / 2,
            f"{width:.1%}",
            ha="left" if width < 0.9 else "right",
            va="center",
            fontweight="bold",
        )

    plt.tight_layout()
    return fig


def build_predictions_dataframe(analyzed_images):
    rows = []
    for item in analyzed_images:
        for rank, pred in enumerate(item["predictions"], start=1):
            rows.append(
                {
                    "image_name": item["name"],
                    "model": item["model_name"],
                    "model_id": item["model_id"],
                    "rank": rank,
                    "label": pred["label"],
                    "score": pred["score"],
                    "processing_time_sec": item["processing_time"],
                    "timestamp": item["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                }
            )
    return pd.DataFrame(rows)


def create_analytics_dashboard(analyzed_images):
    """Create metrics and visualizations for classification history."""
    if not analyzed_images:
        st.info("No analyzed images yet. Upload and classify an image first.")
        return

    df = build_predictions_dataframe(analyzed_images)
    top_predictions = df[df["rank"] == 1].copy()

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Images", len(analyzed_images))
    with col2:
        st.metric("Total Predictions", len(df))
    with col3:
        st.metric("Avg Top Confidence", f"{top_predictions['score'].mean():.2%}")
    with col4:
        st.metric("Avg Processing Time", f"{top_predictions['processing_time_sec'].mean():.2f}s")

    col1, col2 = st.columns(2)

    with col1:
        class_counts = top_predictions["label"].value_counts().head(10)
        fig1, ax1 = plt.subplots(figsize=(8, 5.5))
        bars = ax1.barh(class_counts.index[::-1], class_counts.values[::-1], color="#68a0cf")
        ax1.set_xlabel("Top-1 Prediction Count")
        ax1.set_title("Most Common Top Classes")
        for bar in bars:
            width = bar.get_width()
            ax1.text(width + 0.05, bar.get_y() + bar.get_height() / 2, f"{int(width)}", va="center")
        plt.tight_layout()
        st.pyplot(fig1)

    with col2:
        fig2, ax2 = plt.subplots(figsize=(8, 5.5))
        ax2.hist(top_predictions["score"], bins=12, alpha=0.8, color="#80c683", edgecolor="black")
        ax2.set_xlabel("Top-1 Confidence")
        ax2.set_ylabel("Image Count")
        ax2.set_title("Top Prediction Confidence Distribution")
        ax2.grid(True, alpha=0.25)
        plt.tight_layout()
        st.pyplot(fig2)

    if top_predictions["model"].nunique() > 1:
        st.subheader("Model Performance Comparison")
        model_summary = (
            top_predictions.groupby("model")
            .agg(
                images=("image_name", "count"),
                avg_confidence=("score", "mean"),
                avg_processing_time_sec=("processing_time_sec", "mean"),
            )
            .reset_index()
        )
        st.dataframe(
            model_summary,
            use_container_width=True,
            hide_index=True,
            column_config={
                "avg_confidence": st.column_config.ProgressColumn(
                    "Avg Confidence",
                    format="%.2f",
                    min_value=0,
                    max_value=1,
                ),
                "avg_processing_time_sec": st.column_config.NumberColumn(
                    "Avg Processing Time (s)",
                    format="%.2f",
                ),
            },
        )


st.title("🖼️ AI Image Classification Dashboard")
st.markdown(
    """
Upload an image and classify it with Hugging Face computer vision models. The dashboard tracks
top-k predictions, confidence scores, processing time, classification history, analytics, and CSV export.
"""
)


with st.sidebar:
    st.header("Configuration")

    selected_model_name = st.selectbox("Choose Model", list(MODEL_OPTIONS.keys()))
    selected_model_id = MODEL_OPTIONS[selected_model_name]["id"]
    st.caption(MODEL_OPTIONS[selected_model_name]["description"])

    st.subheader("Classification Options")
    top_k = st.slider("Top K Predictions", 1, 10, 5)
    confidence_threshold = st.slider("Confidence Threshold", 0.0, 1.0, 0.10)

    if st.button("Load Model", type="primary"):
        with st.spinner(f"Loading {selected_model_name}..."):
            try:
                st.session_state.classifier = load_image_classifier(selected_model_id)
                st.session_state.model_loaded = True
                st.session_state.active_model_name = selected_model_name
                st.session_state.active_model_id = selected_model_id
                st.success("Model loaded successfully.")
            except Exception as exc:
                st.session_state.classifier = None
                st.session_state.model_loaded = False
                st.error(f"Failed to load model: {exc}")

    if st.session_state.model_loaded:
        st.success(f"Ready: {st.session_state.active_model_name}")
    else:
        st.info("Load a model before classifying images.")

    st.divider()
    st.caption("Deployment-ready structure: `streamlit_app.py`, `requirements.txt`, and `README.md`.")


tab1, tab2, tab3 = st.tabs(["Single Image", "Image History", "Results & Analytics"])


with tab1:
    st.header("Single Image Classification")

    uploaded_file = st.file_uploader(
        "Choose an image",
        type=["jpg", "jpeg", "png", "webp"],
        help="Upload a clear image of an object, animal, vehicle, or scene.",
    )

    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        col1, col2 = st.columns([1, 1])

        with col1:
            st.image(image, caption=uploaded_file.name, use_container_width=True)
            st.caption(f"Mode: {image.mode} | Size: {image.size[0]} x {image.size[1]} px")

        with col2:
            classify_disabled = not st.session_state.model_loaded
            if st.button("Classify Image", type="primary", disabled=classify_disabled):
                if not st.session_state.classifier:
                    st.error("Please load a model first.")
                else:
                    with st.spinner("Classifying image..."):
                        try:
                            predictions, processing_time = classify_image(
                                image,
                                st.session_state.classifier,
                                top_k=top_k,
                            )
                        except Exception as exc:
                            st.error(f"Classification failed: {exc}")
                            predictions = None
                            processing_time = None

                    if predictions:
                        image_data = {
                            "name": uploaded_file.name,
                            "predictions": predictions,
                            "timestamp": datetime.now(),
                            "image_bytes": image_to_png_bytes(image),
                            "model_name": st.session_state.active_model_name,
                            "model_id": st.session_state.active_model_id,
                            "processing_time": processing_time,
                        }
                        st.session_state.analyzed_images.append(image_data)

                        st.subheader("Predictions")
                        st.caption(f"Model: {st.session_state.active_model_name} | Processing time: {processing_time:.2f}s")

                        for idx, pred in enumerate(predictions, start=1):
                            marker = "High" if pred["score"] >= confidence_threshold else "Low"
                            st.write(f"{idx}. **{pred['label']}** - {pred['score']:.2%} confidence ({marker})")

                        chart = create_prediction_chart(predictions)
                        if chart:
                            st.pyplot(chart)
            elif classify_disabled:
                st.info("Load a model from the sidebar to enable classification.")


with tab2:
    st.header("Classification History")

    if st.session_state.analyzed_images:
        st.write(f"Total classified images: {len(st.session_state.analyzed_images)}")

        for item in reversed(st.session_state.analyzed_images):
            title = f"{item['name']} | {item['model_name']} | {item['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}"
            with st.expander(title):
                col1, col2 = st.columns([1, 2])
                with col1:
                    st.image(item["image_bytes"], caption=item["name"], use_container_width=True)
                with col2:
                    st.write("**Top Predictions:**")
                    for idx, pred in enumerate(item["predictions"][:3], start=1):
                        st.write(f"{idx}. **{pred['label']}** - {pred['score']:.2%}")
                    st.write(f"**Processing time:** {item['processing_time']:.2f}s")
    else:
        st.info("No images classified yet. Go to the Single Image tab to start.")


with tab3:
    st.header("Results & Analytics")
    create_analytics_dashboard(st.session_state.analyzed_images)

    if st.session_state.analyzed_images:
        st.subheader("Detailed Results")
        results_df = build_predictions_dataframe(st.session_state.analyzed_images)

        st.dataframe(
            results_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "score": st.column_config.ProgressColumn("Confidence", format="%.2f", min_value=0, max_value=1),
                "processing_time_sec": st.column_config.NumberColumn("Processing Time (s)", format="%.2f"),
            },
        )

        csv_buffer = io.StringIO()
        results_df.to_csv(csv_buffer, index=False)
        st.download_button(
            label="Download Results as CSV",
            data=csv_buffer.getvalue(),
            file_name=f"image_classification_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            mime="text/csv",
        )

        if st.button("Clear All Results", type="secondary"):
            st.session_state.analyzed_images = []
            st.rerun()


st.markdown("---")
st.markdown(
    """
<div style="text-align: center; color: #666;">
Built with Streamlit, Hugging Face Transformers, PyTorch, Pillow, Pandas, Matplotlib, and Seaborn.
</div>
""",
    unsafe_allow_html=True,
)

