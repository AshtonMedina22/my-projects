- [View Solution Notebook](./solution.html)
- [View Project Page]()

# Imports and Instantiation


```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# 1. Instantiate DistilGPT-2's `tokenizer` and `model` using the `.from_pretrained` method.
tokenizer = GPT2Tokenizer.from_pretrained("distilgpt2")
model = GPT2LMHeadModel.from_pretrained("distilgpt2")
model.eval()
```

## Tokenization and Generation


```python
# 2. Assign pt_tensors the input text's tokens in PyTorch tensor form
def encode_text_as_pt_tensor(text):
    pt_tokens = tokenizer.encode(text, return_tensors="pt")
    return pt_tokens

print(encode_text_as_pt_tensor("hello, world!"))
```


```python
from transformers import set_seed

# 3. Use set_seed to make the rest of the notebook's output deterministic. Pass it the number 42.
set_seed(42)
```


```python
prompt = "Artificial intelligence can help people"
tokens = encode_text_as_pt_tensor(prompt)
# 4. Instruct the model to generate a completion on your choice of prompt using the greedy search method.
# Pass pad_token_id=tokenizer.eos_token_id as the second argument to prevent seeing a warning.
output_tokens = model.generate(
    tokens,
    max_new_tokens=40,
    pad_token_id=tokenizer.eos_token_id
)
```


```python
# 5. Decode the resulting tokens.
def decode_tokens(tokens):
    text = tokenizer.decode(tokens, skip_special_tokens=True)
    return text

decode_tokens(output_tokens[0])
```

## Experimenting with Generation Strategies


```python
# 6. Adapt the function below to use beam search in its generations. Then call it three times with 3 beams, 6 beams, and 9 beams.
# Pass pad_token_id=tokenizer.eos_token_id to model.generate to prevent seeing a warning.
def generate_with_beam_search(prompt,num_beams):
    tokens = encode_text_as_pt_tensor(prompt)
    output = model.generate(
        tokens,
        max_new_tokens=50,
        num_beams=num_beams,
        early_stopping=True,
        pad_token_id=tokenizer.eos_token_id
    )
    completion = decode_tokens(output[0])
    print(completion)
    return completion


prompt = "The future of renewable energy depends on"

# make multiple calls to the model here
beam_3 = generate_with_beam_search(prompt, 3)
beam_6 = generate_with_beam_search(prompt, 6)
beam_9 = generate_with_beam_search(prompt, 9)
```


```python
# 7. Repeat the same process you did with beam search on step 6 with n-gram penalties here.
# Call our function three times with n_gram values of 2, 3, and 4.
# Pass pad_token_id=tokenizer.eos_token_id to model.generate to prevent seeing a warning.
def generate_with_ngram_penalty(prompt, n_gram_penalty, num_beams=6):
    tokens = encode_text_as_pt_tensor(prompt)
    output = model.generate(
        tokens,
        max_new_tokens=50,
        num_beams=num_beams,
        no_repeat_ngram_size=n_gram_penalty,
        early_stopping=True,
        pad_token_id=tokenizer.eos_token_id
    )
    completion = decode_tokens(output[0])
    print(completion)
    return completion

# make multiple calls to the function here
ngram_2 = generate_with_ngram_penalty(prompt, 2)
ngram_3 = generate_with_ngram_penalty(prompt, 3)
ngram_4 = generate_with_ngram_penalty(prompt, 4)
```


```python
# 8. Same as steps 6 and 7, experiment with different settings of temperature and top_k here after instructing the model to do sampling.
# Choose your own values for temperature and top k and see how the model's output responds.
# Pass pad_token_id=tokenizer.eos_token_id to model.generate to prevent seeing a warning.

def generate_with_sampling(prompt, temperature, top_k, n_gram_penalty=2):
    tokens = encode_text_as_pt_tensor(prompt)
    output = model.generate(
        tokens,
        max_new_tokens=50,
        do_sample=True,
        temperature=temperature,
        top_k=top_k,
        no_repeat_ngram_size=n_gram_penalty,
        pad_token_id=tokenizer.eos_token_id
    )
    completion = decode_tokens(output[0])
    print(f"Temperature: {temperature}\nTop K: {top_k}\n {completion}")
    return completion

# make multiple calls to the function here
sample_low = generate_with_sampling(prompt, temperature=0.4, top_k=20)
sample_medium = generate_with_sampling(prompt, temperature=0.8, top_k=50)
sample_high = generate_with_sampling(prompt, temperature=1.2, top_k=100)
```

## Using CodeCarbon


```python
from codecarbon import track_emissions

# 9. Add the CodeCarbon decorator to the line directly above this function.
# Then fill the function in with your preferred settings.

@track_emissions(output_file="emissions.csv")
def generate_with_sampling(prompt, temperature, top_k, n_gram_penalty=2):
    tokens = encode_text_as_pt_tensor(prompt)
    output = model.generate(
        tokens,
        max_new_tokens=50,
        do_sample=True,
        temperature=temperature,
        top_k=top_k,
        no_repeat_ngram_size=n_gram_penalty,
        pad_token_id=tokenizer.eos_token_id
    )
    completion = decode_tokens(output[0])
    print(f"Temperature: {temperature}\nTop K: {top_k}\n {completion}")
    return completion

generate_with_sampling("Carbon dioxide is a", 0.6, 50)
```


```python
import pandas as pd
# 10. Use pandas' read_csv method to load in the emissions.csv we generated.
# Then, print the first few rows with emissions.head().

emissions = pd.read_csv("emissions.csv")
print(emissions.head())
```


```python
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 5))
# 11. Pass the `emissions` DataFrame's 'duration' column to the x-axis (first argument) and the 'emissions' column to the y-axis (second argument).
plt.scatter(emissions["duration"], emissions["emissions"], color='blue', alpha=0.6)
plt.title('Emissions by Duration')
plt.xlabel('Duration (seconds)')
plt.ylabel('Emissions (kg CO2)')
plt.grid(True)
plt.show()
```
