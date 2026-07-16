"""
Paste-ready solutions for:
LLM Benchmarks - General Knowledge Benchmark Datasets

These snippets are meant to be pasted into the matching Codecademy
checkpoint cells, not run as one standalone script.
"""

# Checkpoint 1/5: Generate Predictions for Sample Questions
outputs = model.generate(**inputs, max_length=50)
predicted_text = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()


# Checkpoint 2/5: Compare Predictions with Correct Answers
correct_answer = row['choices'][row['answer_index']]
is_correct = predicted_text.lower() == correct_answer.lower()


# Checkpoint 3/5: Process All Sample Questions
pred = generate_prediction(row)
res = compare_and_collect(row, pred)


# Checkpoint 4/5: Evaluate Model Performance
accuracy = accuracy_score(results_df['correct'], [True] * len(results_df['correct']))
f1 = f1_score(results_df['correct'], [True] * len(results_df['correct']), average='binary')


# Checkpoint 5/5: Analyze Performance by Subject
subject_performance = results_df.groupby('subject')['correct'].mean() * 100
