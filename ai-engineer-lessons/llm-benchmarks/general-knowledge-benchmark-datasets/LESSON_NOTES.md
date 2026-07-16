# Lesson Notes

## What This Lesson Does

This lesson evaluates a small FLAN-T5 model on sample questions from MMLU, a general knowledge benchmark spanning many domains.

## Main Steps

1. Load MMLU from Hugging Face.
2. Convert benchmark splits into DataFrames.
3. Sample diverse subject areas.
4. Generate model answers with FLAN-T5.
5. Compare predictions against the correct multiple-choice answer.
6. Calculate accuracy and F1 score.
7. Group performance by subject.

## Important Concepts

- **MMLU** measures broad knowledge across academic and professional domains.
- **Accuracy** measures the share of correct answers.
- **F1 score** balances correctness with false positives and false negatives.
- **Subject-level performance** helps identify which domains a model handles well or poorly.
