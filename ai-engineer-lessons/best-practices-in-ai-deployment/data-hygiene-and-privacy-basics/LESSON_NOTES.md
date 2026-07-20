# Lesson Notes

This lesson covers a basic AI deployment data protection pipeline.

Key steps:

- Remove low-quality records before downstream processing.
- Redact email and phone number patterns from support text with regular expressions.
- Replace raw customer IDs with one-way SHA-256 hashes.
- Drop direct identity columns from the training dataset.
- Add Laplace noise to ZIP code counts and flag groups with fewer than five records.

This is a notebook-only deployment best-practices lesson. It does not add a Streamlit app feature.
