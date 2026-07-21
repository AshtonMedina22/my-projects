# Portfolio Live App Audit

Status as of July 21, 2026.

The portfolio should use Vercel-native live apps as the primary visitor path. Python notebooks,
Streamlit apps, and static case studies remain useful evidence, but they should not be the first
thing reviewers open.

| Project | Previous primary experience | New primary Vercel experience | Notes |
| --- | --- | --- | --- |
| Banking Intent Classifier | Static project page | `live/index.html?project=banking` | Browser demo mirrors the classifier workflow without shipping model weights. |
| Trip Planner AI Agent | Streamlit/course artifact plus case study | `trip-planner-ai-agent/app.html` | Uses `/api/trip-planner` with OpenStreetMap and Wikivoyage fallbacks. |
| Frankenstein Finetuning | Static project page | `live/index.html?project=frankenstein` | Interactive text-generation demo; training artifacts remain in source folder. |
| Neural Network Architectures | Static bundle | `live/index.html?project=vision-architectures` | Interactive architecture comparison. |
| AI Image Classification Dashboard | Sleeping Streamlit Cloud link | `live/index.html?project=image-classifier` | Non-sleeping upload demo; full Hugging Face source remains available. |
| RAG Search Assistant | Static notes/source | `live/index.html?project=rag` | Browser RAG retrieval demo with editable corpus and cited chunk. |
| Sequential Quiz Generator | Static project page/source | `live/index.html?project=quiz` | Browser sequential-chain demo. |
| Training Manual Creator | Vercel app already exists | `training-manual-creator/app.html` | Uses `/api/training-manual-chat`; no Streamlit dependency for public demo. |
| Recommendation System Performance | Static results page | `live/index.html?project=recommendations` | Interactive ROI summary app. |

## Policy

- Homepage primary CTAs should open live Vercel apps.
- Case studies and results pages should be secondary CTAs.
- Streamlit links may remain in documentation as course artifacts, but they should not be primary
  portfolio paths because Community Cloud apps can sleep.
- API keys must be environment variables or user-provided secrets; never commit them.
