# Lesson Notes

## Checkpoint 1

Create a text area using `st.text_area()` with the label `"Enter text to analyze:"`, placeholder text, and a height of 150 pixels. Store the input in `user_text`.

## Checkpoint 2

Add an `"Analyze Text"` button in the first column with `type="primary"`. When the button is clicked and text exists, process the text with `preprocess_text()`.

## Checkpoint 3

Add a CSV uploader using `st.file_uploader("Choose a CSV file", type=['csv'])`. When a file is uploaded, read it with `pd.read_csv()`, show a row-count success message, and preview the first 10 rows with `st.expander()`.

## Checkpoint 4

Create `list_of_texts = []`, append `user_text` when it exists, and display the list with:

```python
st.write(f'List of text inputs: {list_of_texts}')
```

