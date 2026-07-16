# Evaluating Sentiment Analysis

Codecademy lesson: **LLM Benchmarks - Evaluating Sentiment Analysis**

This lesson evaluates a pretrained DistilBERT sentiment model on the SST-2 validation set from the GLUE benchmark.

## Files

- `checkpoint_solutions.py` - paste-ready checkpoint answers.
- `LESSON_NOTES.md` - plain-English notes for later reference.
- `notebook.md` - exported lesson notebook/source.

## Key Takeaway

The Hugging Face `Trainer` can run benchmark evaluation when given a model, evaluation dataset, training/evaluation arguments, and a `compute_metrics` function.
