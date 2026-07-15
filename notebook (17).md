<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!
    
[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:
    
1. Add your solution to the cell with `## YOUR SOLUTION HERE ## `.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
4. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)

**Setup**

First, let's import and instantiate our DistilGPT2 model and its corresponding tokenizer. Run the cell below to get started. (_This might take a minute - do not run any other cell while this is running!_)


```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained("distilgpt2")
model = GPT2LMHeadModel.from_pretrained("distilgpt2")
```

**Checkpoint 1/4 The GPT Tokenizer**

Use the tokenizer to encode the text given below and set `return_tensors` argument to `"pt"`. Call the tokenized output `pt_tokens` and print it.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
text = "Let's turn this string into a PyTorch tensor of tokens."

## YOUR SOLUTION HERE ##
pt_tokens = tokenizer.encode(text, return_tensors="pt")
print(pt_tokens)

```

**Checkpoint 2/4: Decoding Tokens**

Turning tokens back into a full-text string again is quite simple. Just pass your tokens to the `tokenizer.decode()` method.

In the Checkpoint 2/3 code cell, we've created a list with some tokens containing a secret message. Decode the resulting `list_tokens`, store the result in `decoded_tokens`, and print the decoded tokens to the console.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
list_tokens = [1532, 345, 821, 3555, 428, 11, 345, 875, 9043, 502, 0]

## YOUR SOLUTION HERE ##
decoded_tokens = tokenizer.decode(list_tokens)
print(decoded_tokens)

```

**Checkpoint 3/4: Fun with Text Generation!**

Alright, time to generate some text with the model. A few notes on the parameters we'll set:

- As mentioned earlier, the model will read in a PyTorch tensor made of tokens
-- We'll specify the parameters `do_sample=True`, `num_beams=1`. We will see what both mean in the following exercise!
- The `pad_token_id` parameter is used to avoid a warning. It tells the model to use the 'end of sequence' token to fill in the white space in each sequence

Try it out below! Feel free to experiment with different prompts to get a feel for how this particular model behaves. Once you're done, don't forget to hit `Test Work` to move to the next checkpoint!


```python
prompt = "Hello, my name is"

inputs = tokenizer.encode(prompt, return_tensors="pt")

output = model.generate(inputs, max_length=75, num_beams = 1, do_sample = True, pad_token_id=tokenizer.eos_token_id)

print(tokenizer.decode(output[0]))
```

If you've worked with the latest, cutting-edge versions of GPT, take a moment to appreciate how far this technology has come since the GPT-2 days!

**Checkpoint 4/4: Changing Temperature**

Next we'll experiment with changing the model's temperature—warmer (higher) values reduce the predictability of the model and can generate more creative outputs, while cooler (lower) values instruct the model to select only the most likely completions, making its output more predictable.

Call the `generate_text` function below twice on the same `prompt` with **different temperatures**. The second argument of your `generate_text` function should be temperature.
 
- call `generate_text` with our predefined prompt and set the temperature to `1.2`, then store the result in a variable named `high_temp`
- call `generate_text` with our predefined prompt and set the temperature to `0.3`, then store the result in a variable named `low_temp`
- print both `high_temp` and `low_temp` to the console, each on their own lines

Note we `set_seed` in the second line of the cell. That's to ensure reproducible outputs, so the text generation we see will be the same generation you see when running the code. Setting seed can be helpful when you want predictable outputs in your generations.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
from transformers import set_seed
set_seed(10)

prompt = "Artificial intelligence is"

def generate_text(prompt, temperature):
    input = tokenizer.encode(prompt, return_tensors="pt")
    output = model.generate(input, max_length=75,num_return_sequences=1, do_sample=True, temperature=temperature, pad_token_id=tokenizer.eos_token_id)
    return f"\n---\n{tokenizer.decode(output[0]).strip()}\n---\n"

## YOUR SOLUTION HERE ##
high_temp = generate_text(prompt, 1.2)
low_temp = generate_text(prompt, 0.3)

print(high_temp)
print(low_temp)

```


```python

```
