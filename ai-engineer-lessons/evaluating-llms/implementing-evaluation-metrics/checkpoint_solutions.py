"""
Paste-ready solutions for:
Evaluating LLMs - Implementing Evaluation Metrics

These snippets are meant to be pasted into the matching Codecademy
checkpoint cells, not run as one standalone script.
"""

# Checkpoint 1/3: Calculating Perplexity
print(results["perplexities"])
print(results["mean_perplexity"])


# Checkpoint 2/3: Comparing Perplexities
results_phrase_1 = ppl.compute(model_id=model_name, input_texts=phrase_1)
results_phrase_2 = ppl.compute(model_id=model_name, input_texts=phrase_2)

print(results_phrase_1["perplexities"])
print(results_phrase_2["perplexities"])


# Checkpoint 3/3: Calculating BLEU
bleu = load_metric("bleu")
results = bleu.compute(predictions=predictions, references=references)

print(results)
