# Lesson Notes

## What This Lesson Does

This lesson evaluates a pretrained DistilBERT model on SST-2, a benchmark dataset for binary sentiment classification.

## Main Steps

1. Load SST-2 through Hugging Face `datasets`.
2. Tokenize each sentence so the model can process it.
3. Run model predictions on a small validation sample.
4. Decode token IDs back into readable sentences.
5. Compare predicted labels against actual labels.
6. Calculate precision and recall.

## Portfolio Relevance

This lesson demonstrates how benchmark datasets are used to test language models in a repeatable way. The same pattern can be reused for portfolio projects that compare model performance across standardized tasks.
