# Evaluating Generative Models with Perplexity

## Setup

Run the following cell to import the model and tokenizer for DistilGPT-2 as well as PyTorch.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained("distilgpt2")
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
```

## Checkpoint 1/2

Calculate the cross-entropy loss for the tokenized input sequence by passing `inputs["input_ids"]` as both `input_ids` and `labels`.

```python
inputs = tokenizer("I'm feeling quite perplexed by all these math equations.", return_tensors="pt")

## YOUR SOLUTION HERE ##
loss = model(input_ids=inputs["input_ids"], labels=inputs["input_ids"]).loss

print(loss.item()) # this returns the cross-entropy
```

## Checkpoint 2/2

Exponentiate the cross-entropy loss to calculate perplexity.

```python
## YOUR SOLUTION HERE ##
ppl = torch.exp(loss)

print(f"Perplexity: {ppl.item():.2f}")
```
