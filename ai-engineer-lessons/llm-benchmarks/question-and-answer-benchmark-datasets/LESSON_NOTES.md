# Lesson Notes

## What This Lesson Does

This lesson evaluates a DistilBERT model trained for extractive question answering on SQuAD.

## Main Steps

1. Load the SQuAD dataset.
2. Convert train and validation splits into Pandas DataFrames.
3. Load `distilbert-base-uncased-distilled-squad`.
4. Create a Hugging Face `question-answering` pipeline.
5. Generate answers for a small validation sample.
6. Store each question, shortened context, predicted answer, and confidence score in a DataFrame.

## Important Concepts

- **Extractive QA** means the answer is pulled from the provided context.
- **Context** is the passage the model reads.
- **Question** is the natural-language query.
- **Score** is the model's confidence in the extracted answer.
