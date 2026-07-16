# Lesson Notes

## What This Lesson Does

This lesson evaluates a pretrained DistilBERT model on SST-2, a binary sentiment classification benchmark.

## Main Steps

1. Load SST-2 from the GLUE benchmark.
2. Tokenize the dataset for DistilBERT.
3. Define `compute_metrics()` to convert logits into predicted labels.
4. Initialize a Hugging Face `Trainer`.
5. Run evaluation and extract `eval_accuracy`.

## Important Concepts

- **Logits** are raw model outputs before probabilities or labels.
- **`np.argmax(logits, axis=-1)`** picks the most likely class.
- **`metric.compute()`** compares predictions against reference labels.
- **Accuracy** is appropriate here because SST-2 is a balanced binary classification benchmark.
