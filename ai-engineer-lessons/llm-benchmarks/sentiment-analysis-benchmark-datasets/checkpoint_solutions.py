"""
Paste-ready solutions for:
LLM Benchmarks - Sentiment Analysis Benchmark Datasets

These snippets are meant to be pasted into the matching Codecademy
checkpoint cells, not run as one standalone script.
"""

# Checkpoint 1/4: Tokenization
dataset = dataset.map(tokenize_function, batched=True)


# Checkpoint 2/4: Predict Outcomes on the Validation Sample
with torch.no_grad():
    outputs = model(**inputs)
    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    predicted_labels = torch.argmax(predictions, dim=-1).tolist()


# Checkpoint 3/4: Decoding and Displaying Predictions
sentences = [tokenizer.decode(ids, skip_special_tokens=True) for ids in inputs['input_ids']]

results_df = pd.DataFrame({
    'Sentence': sentences,
    'Predicted Sentiment': predicted_labels,
    'Actual Sentiment': labels
})

print("\nPredictions and Actual Labels:")
results_df


# Checkpoint 4/4: Calculate Precision and Recall
precision = precision_score(
    results_df["Actual Sentiment"],
    results_df["Predicted Sentiment"],
    average="weighted"
)
recall = recall_score(
    results_df["Actual Sentiment"],
    results_df["Predicted Sentiment"],
    average="weighted"
)
