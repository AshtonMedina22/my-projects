# AI Image Classification Dashboard

A Streamlit portfolio project for real-time image classification using Hugging Face computer vision models.

## Features

- Upload `jpg`, `jpeg`, `png`, or `webp` images.
- Load either `google/vit-base-patch16-224` or `microsoft/resnet-50`.
- Display top-k ImageNet predictions with confidence scores.
- Track classification history with image previews.
- Show analytics for top classes, confidence distribution, processing time, and model comparison.
- Export detailed prediction results to CSV.

## Models

- Google ViT Base Patch16 224: `google/vit-base-patch16-224`
- Microsoft ResNet-50: `microsoft/resnet-50`

## Run Locally

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Deploy

This project is ready for Streamlit Community Cloud.

1. Push this folder to a public GitHub repository.
2. Go to https://share.streamlit.io.
3. Select the repository, branch, and `streamlit_app.py`.
4. Deploy.

## Suggested Test Images

- Animal images
- Cats vs dogs
- CIFAR-10 style objects
- ImageNet-style everyday objects

## Notes

The first model load can take time because Streamlit downloads and caches model weights from Hugging Face.

