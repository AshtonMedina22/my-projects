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

Run the setup cells to load the relevant packages, setup the model checkpoint and to examine the text we'll be summarizing.


```python
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import numpy as np

checkpoint = "google/flan-t5-small"
```


```python
#Text to be summarized
text_example = "Large language models (LLMs) have a dirty secret: they require vast amounts of energy to train and run. What’s more, it’s still a bit of a mystery exactly how big these models’ carbon footprints really are. AI startup Hugging Face believes it’s come up with a new, better way to calculate that more precisely, by estimating emissions produced during the model’s whole life cycle rather than just during training. It could be a step toward more realistic data from tech companies about the carbon footprint of their AI products at a time when experts are calling for the sector to do a better job of evaluating AI’s environmental impact. Hugging Face’s work is published in a non-peer-reviewed paper. To test its new approach, Hugging Face estimated the overall emissions for its own large language model, BLOOM, which was launched earlier this year. It was a process that involved adding up lots of different numbers: the amount of energy used to train the model on a supercomputer, the energy needed to manufacture the supercomputer’s hardware and maintain its computing infrastructure, and the energy used to run BLOOM once it had been deployed. The researchers calculated that final part using a software tool called CodeCarbon, which tracked the carbon dioxide emissions BLOOM was producing in real time over a period of 18 days. Hugging Face estimated that BLOOM’s training led to 25 metric tons of carbon dioxide emissions. But, the researchers found, that figure doubled when they took into account the emissions produced by the manufacturing of the computer equipment used for training, the broader computing infrastructure, and the energy required to actually run BLOOM once it was trained. "
print(text_example)
```

**Checkpoint 1/3: Load tokenizer and model**

Uncomment and run the lines pertaining to loading the model and the tokenizer. (**Make sure you don’t run this cell more than once or else the kernel might crash!**)

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE##
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)
```

**Checkpoint 2/3: Tokenization**

We want to create input tokens for the summarization model,but here, we only want the input IDs as a tensor and are not interested in the attention mask. 

To do this, create `tokens_input` **using the tokenizer with the `.encode()` method**  that has the following arguments: `summarization_input`, `return_tensors = “pt”` and `truncation = True`. Once you’ve created `tokens_input`, print its shape using `np.shape()`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
summarization_input = "summarize: "+text_example

## YOUR SOLUTION HERE##
tokens_input = tokenizer.encode(
    summarization_input,
    return_tensors="pt",
    truncation=True
)
print(np.shape(tokens_input))

```

**Checkpoint 3/3: Summarization task**

- Uncomment the line that generates the summary tokens.

- Create a variable, `summary` that uses the `.decode()` functionality of the tokenizer with the following arguments:`summary_ids[0]` and `skip_special_tokens = True`. Print `summary` to examine the output.


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
summary_ids = model.generate(tokens_input, min_length=80, max_length=120)
summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
print(summary)


```

<details><summary style="display:list-item; font-size:16px; color:blue;">Does the summary make sense?</summary>

You might already be able to tell that the summary is not great. The summary misunderstands what Hugging Face is but manages to get a few key points right. For a better summary, you can download the same notebook and attempt a heavier (and better!) model like [`flan-t5-base`](https://huggingface.co/google/flan-t5-base) or [`bart-large`](https://huggingface.co/facebook/bart-large).


```python

```
