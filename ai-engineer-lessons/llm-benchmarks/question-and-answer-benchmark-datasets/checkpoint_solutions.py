"""
Paste-ready solutions for:
LLM Benchmarks - Question and Answer Benchmark Datasets

These snippets are meant to be pasted into the matching Codecademy
checkpoint cells, not run as one standalone script.
"""

# Checkpoint 1/2: Initialize Tokenizer and QA Pipeline
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased-distilled-squad')
qa_pipeline = pipeline('question-answering', model=model, tokenizer=tokenizer)


# Checkpoint 2/2: Generate Predictions on a Sample
for _, row in sample_validation.iterrows():
    context = row['context']
    question = row['question']
    answer = qa_pipeline(question, context)
    results.append({
        'Question': question,
        'Context': context[:200],
        'Predicted Answer': answer['answer'],
        'Score': answer['score']
    })
