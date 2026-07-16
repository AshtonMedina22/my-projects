# Project Notes

## What This Project Does

This project builds a small benchmarking workflow for DistilBERT on two NLP tasks.

## Sentiment Analysis

The project uses `distilbert-base-uncased-finetuned-sst-2-english` to classify SST-2 movie review sentences as positive or negative.

Metrics:

- Accuracy
- Precision
- Recall

## Question Answering

The project uses `distilbert-base-uncased-distilled-squad` to extract answers from SQuAD context passages.

Metrics:

- Accuracy based on exact match
- Exact Match average
- F1-style answer comparison

## Portfolio Relevance

This project is useful as a reference for building evaluation pipelines that compare models across different NLP tasks with task-specific metrics.
