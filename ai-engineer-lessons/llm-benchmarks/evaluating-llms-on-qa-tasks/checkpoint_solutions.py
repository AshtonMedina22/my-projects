"""
Paste-ready solutions for:
LLM Benchmarks - Evaluating LLMs on Q&A tasks

These snippets are meant to be pasted into the matching Codecademy
checkpoint cells, not run as one standalone script.
"""

# Checkpoint 1/4: Configure Model and Load Evaluation Metric
metric = load_metric('squad')


# Checkpoint 2/4: Extract Answers Predicted by the Model
answer_start = torch.argmax(outputs.start_logits)
answer_end = torch.argmax(outputs.end_logits) + 1
answer = tokenizer.decode(inputs['input_ids'][0, answer_start:answer_end])


# Checkpoint 3/4: Format Predictions for Evaluation
predictions = [{'id': str(i), 'prediction_text': answer}]
references = [{
    'id': str(i),
    'answers': {
        'text': [row['answer']],
        'answer_start': [0]
    }
}]
metric.add_batch(predictions=predictions, references=references)


# Checkpoint 4/4: Run Evaluation Loop and Compute Scores
num_samples = 100
with torch.no_grad():
    for i, row in validation_df.head(num_samples).iterrows():
        answer, inputs = get_answer(row)
        add_to_metric(i, answer, row)

final_scores = metric.compute()
print(f"F1 Score: {final_scores['f1']:.2f}")
print(f"\nExact Match Score: {final_scores['exact_match']:.2f}")
