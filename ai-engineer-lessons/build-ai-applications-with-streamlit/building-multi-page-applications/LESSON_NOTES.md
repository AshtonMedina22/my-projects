# Lesson Notes: Building Multi-Page Applications

This lesson converts the sentiment analysis Streamlit app from one long page into a three-tab interface.

## Required Codecademy Patterns

```python
tab1, tab2, tab3 = st.tabs(["📝 Text Input", "📁 File Upload", "📊 Results & Analytics"])

with tab1:
    st.header("Single Text Analysis")

with tab2:
    st.header("Bulk File Analysis")

with tab3:
    st.header("Results & Analytics")
```

## Why It Matters

Tabs keep related features on the same app page while making the interface easier to scan:

- Text Input: one-off sentiment checks.
- File Upload: CSV batch analysis.
- Results & Analytics: persistent session history, metrics, charts, and result tables.
