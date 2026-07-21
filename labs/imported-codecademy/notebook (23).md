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

Run this cell to import our tokenizer.


```python
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased") 
```

#### Checkpoint 1/3

Be sure to run the setup cell before proceeding.

Fixed length padding is desirable when there are strict memory constraints in the system you're using. It's also ideal when consistent input size is necessary for the model's performance.

No matter how long the reviews below are, they'll be padded to the `max_length`. 

Below, tokenize each text in `example_texts` with the tokenizer. Pass as arguments to the tokenizer the `text`, the `padding` argument set to `"max_length"`, and the `max_length` argument set to `50`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
example_texts = ["I am a short sentence.", "I am a medium sentence. Not too long, not too short.", "I am an exceedingly longwinded, verbose, talks-a-lot, redundant sentence that can't stop running on and on and on."]

fixed_length_tokens = []
for text in example_texts:
## YOUR SOLUTION HERE ##
    tokenized_text = tokenizer(text, padding="max_length", max_length=50)
    fixed_length_tokens.append(tokenized_text)

for i in range(3):
    print(f"Original text: {example_texts[i]}")
    print(f"Tokenized text: {fixed_length_tokens[i]['input_ids']}")
    print("\n")

```

#### Checkpoint 2/3

As you can see, every sequence is padded out to the length specified (in this case, 50 tokens). This is inefficient, because even the longest sequence now contains numerous tokens that aren't teaching the model anything.

Dynamic padding, which is what we'll use to pad our training data (and is also the default behavior for AutoTokenizer), addresses this inefficiency. In dynamic padding, each example in the batch is padded out to the length of the longest sequence in the batch.

This technique is preferable when there are many differently-lengthed inputs (common in NLP). Try it out by once again passing `tokenizer()` the `example _texts`, but this time also passing the `padding` argument set to `'longest'`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
dynamically_padded = tokenizer(example_texts, padding='longest')

for i in range(3):
    print(f"Original text: {example_texts[i]}")
    print(f"Tokenized text: {dynamically_padded['input_ids'][i]}")
    print(f"Length of tokenized text: {len(dynamically_padded['input_ids'][i])}")
    print("\n")

```

#### Checkpoint 3/3
See how the longwinded sentence contains no padding? That's because every other example only pads out to its length.

We've covered how to lengthen examples that are too short. What about the opposite problem?

*Truncation* is the technique used to cut off sequences which we decide are too long. The default truncation setting when `True` is to truncate to the longest length permitted by the model. However, you can also set a max length to truncate to, if that is ever a requirement.

In the version of `example_texts` below, we now make the long sentence 50 times longer, to a total length of 1402 tokens.

First, assign to `tokenized_no_truncation` the tokenized version of `example_texts` with truncation turned off (`truncation=False`).

Then, for `tokenized_default_truncation`, simply pass `truncation=True` when passing `example_texts` to the tokenizer.

Finally, in `tokenized_max_length`, pass `truncation=True` and `max_length=5` to the tokenizer. Then execute the cell and compare the lengths of each output.


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
example_texts = ["I am a short sentence.", "I am an exceedingly longwinded, verbose, talks-a-lot, redundant sentence that can't stop running on." * 50]

## YOUR SOLUTION HERE ##
tokenized_no_truncation = tokenizer(example_texts, truncation=False)
print("Length of non-truncated tokens:")
for idx, tok in enumerate(tokenized_no_truncation['input_ids']):
    print(f"Text {idx+1}: {len(tok)}")

# This automatically truncates to the longest length permitted by the model
# (512 for DistilBERT)
## YOUR SOLUTION HERE ##
tokenized_default_truncation = tokenizer(example_texts, truncation=True)
print("Length of default truncated tokens:")
for idx, tok in enumerate(tokenized_default_truncation['input_ids']):
    print(f"Text {idx+1}: {len(tok)}")

# Tokenize with truncation (max_length=5)
## YOUR SOLUTION HERE ##
tokenized_max_length = tokenizer(example_texts, truncation=True, max_length=5)
print("Length of truncated tokens when max_length = 5:")
for idx, tok in enumerate(tokenized_max_length['input_ids']):
    print(f"Text {idx+1}: {len(tok)}")

```
