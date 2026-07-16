"""
Paste-ready solutions for:
LLM Benchmarks - Evaluating Sentiment Analysis

These snippets are meant to be pasted into the matching Codecademy
checkpoint cells, not run as one standalone script.
"""

# Checkpoint 1/3: Compute Evaluation Metrics
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metric.compute(predictions=predictions, references=labels)


# Checkpoint 2/3: Initialize Trainer for Evaluation
trainer = Trainer(
    model=model,
    args=training_args,
    eval_dataset=dataset["validation"],
    compute_metrics=compute_metrics
)


# Checkpoint 3/3: Evaluate Model and Extract Accuracy
evaluation_results = trainer.evaluate()
accuracy = evaluation_results.get('eval_accuracy')
