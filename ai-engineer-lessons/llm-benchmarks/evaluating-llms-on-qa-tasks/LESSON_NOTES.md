# Lesson Notes

## What This Lesson Does

This lesson evaluates a DistilBERT model on SQuAD, a standard extractive question-answering benchmark.

## Main Steps

1. Move the model to the available device.
2. Put the model in evaluation mode.
3. Load the SQuAD metric.
4. Tokenize each question/context pair.
5. Use start and end logits to identify the predicted answer span.
6. Format predictions and references for the SQuAD metric.
7. Compute F1 and Exact Match.

## Important Concepts

- **Start logits** score where the answer begins.
- **End logits** score where the answer ends.
- **Exact Match** requires a perfect answer match.
- **F1** gives partial credit when predicted and reference answers overlap.
