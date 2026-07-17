# Deploying AI Applications to Streamlit Community Cloud

Codecademy article notes for deploying Streamlit AI apps from GitHub to Streamlit Community Cloud.

## Key References

- Streamlit blank app template: https://github.com/streamlit/blank-app-template
- Streamlit gallery: https://streamlit.io/gallery
- Streamlit Community Cloud deploy dashboard: https://share.streamlit.io
- Portfolio reference app to keep in mind: https://appsentimentdemo.streamlit.app/

## Deployment Shape

Recommended project structure:

```text
my-streamlit-app/
├── app.py or streamlit_app.py
├── requirements.txt
├── README.md
├── pages/
└── .streamlit/
    └── config.toml
```

## Portfolio Notes

- Use a public GitHub repository for free Community Cloud deployment.
- Keep dependencies explicit and lean in `requirements.txt`.
- Prefer a polished `README.md` with screenshots, live app URL, features, model notes, and limitations.
- Use the sentiment demo link as a UX and deployment reference when building the next portfolio project.
- Every push to GitHub can trigger an automatic rebuild on Community Cloud.

