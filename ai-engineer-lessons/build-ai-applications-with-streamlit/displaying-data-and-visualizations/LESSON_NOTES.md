# Lesson Notes

## Checkpoint 1

Complete `create_sentiment_metrics(df)` by calculating total analyzed rows and sentiment counts for `POSITIVE`, `NEGATIVE`, and `NEUTRAL`.

Use `df['sentiment'].value_counts()` and `.get("LABEL", 0)` so the function does not fail when a sentiment is missing.

## Checkpoint 2

After `st.subheader("📊 Sentiment Analysis Metrics")`, call:

```python
create_sentiment_metrics(sample_results)
```

## Checkpoint 3

Create side-by-side charts:

- `st.bar_chart()` for sentiment counts.
- `st.line_chart()` for confidence scores.

## Checkpoint 4

Display the `sentiment_counts` DataFrame with:

```python
st.dataframe(sentiment_counts, use_container_width=True, hide_index=False)
```

