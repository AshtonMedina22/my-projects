# Lesson Notes

## Checkpoint 1

Initialize persistent text history.

```python
if "text_history" not in st.session_state:
    st.session_state.text_history = []
```

## Checkpoint 2

Append each analyzed result to `st.session_state.text_history`.

```python
st.session_state.text_history.append({
    "text": cleaned_text,
    "sentiment": mock_sentiment,
    "confidence": mock_confidence
})
```

## Checkpoint 3

Convert text history to a DataFrame, display metrics, and show the table.

```python
history_df = pd.DataFrame(st.session_state.text_history)
create_sentiment_metrics(history_df)
st.dataframe(history_df, use_container_width=True, hide_index=True)
```

## Checkpoint 4

Clear history and rerun the app.

```python
st.session_state.text_history = []
st.rerun()
```

