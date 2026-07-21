# Finetuning Transformers with Hugging Face: Using Our Finetuned Model

## Checkpoint 1/3

Define a text-classification pipeline with the loaded model and tokenizer, then run a single movie review through it.

```python
## YOUR SOLUTION HERE ##
classifier = pipeline('text-classification', model=model, tokenizer=tokenizer)
single_text = "This movie was surprisingly good, with strong acting and a satisfying ending."
result = classifier(single_text)

print(f"Prediction: {result[0]['label']}, Score: {result[0]['score']}")
```

## Checkpoint 2/3

Run a batch of movie reviews through the same classifier pipeline.

```python
## YOUR SOLUTION HERE ##
batch_texts = [
    "This movie was excellent and I would definitely watch it again.",
    "The plot was boring and the acting was terrible."
]
results = classifier(batch_texts)

for i, result in enumerate(results):
    print(f"Prediction for text {i+1}: {result['label']}, Score: {result['score']}")
```
