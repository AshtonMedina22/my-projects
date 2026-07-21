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

Run the setup cell to import the functions and set the model checkpoint.


```python
# Importing the packages
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Setting the checkpoint
checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
```

**Checkpoint 1/3: Tokenization**

Define a variable inputs that applies the tokenizer function on raw_inputs followed by the following arguments: `padding=True`, `truncation=True` and `return_tensors="pt"`. Print `inputs` to examine what the tokenized inputs to the model look like.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Initializing the tokenizer
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

# Raw inputs
raw_inputs = ["I've been waiting to learn about transformers my whole life.",
               "I hate this so much!"]

## YOUR SOLUTION HERE ##
inputs = tokenizer(
    raw_inputs,
    padding=True,
    truncation=True,
    return_tensors="pt"
)
print(inputs)

```

**Checkpoint 2/3: Model selection**

We’ve already loaded the model for sequence classification in the cell below. Define a variable, `outputs`, that passes the inputs through the model as follows: `outputs = model(**inputs).` Print `outputs.logits.shape` and `outputs.logits`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Initializing the model
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)

## YOUR SOLUTION HERE ##
outputs = model(**inputs)
print(outputs.logits.shape)
print(outputs.logits)
```

**Checkpoint 3/3: Postprocessing**

Uncomment the line of code converting the outputs to probability distributions and print `predictions` and `model.config.id2label`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import torch

# Converting the tensor output to a probability distribution
predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

## YOUR SOLUTION HERE ##
print(predictions)
print(model.config.id2label)
```

<details><summary style="display:list-item; font-size:16px; color:blue;"> What can we conclude?</summary>

The tensor output can be read as follows:

First sentence: NEGATIVE: 0.0402, POSITIVE: 0.9598
Second sentence: NEGATIVE: 0.9995, POSITIVE: 0.0005

    
Which was the exact numbers we obtained in our previous exercise!

<details><summary style="display:list-item; font-size:16px; color:blue;"> Revisiting `pipeline`</summary>

If you would like to double check the above numbers, you can rerun the following piece of code on your local:

```py
from transformers import pipeline
classifier = pipeline(task = "sentiment-analysis", 
                     model = "distilbert-base-uncased-finetuned-sst-2-english")  
raw_inputs = [
    "I've been waiting for a HuggingFace course my whole life.",
    "I hate this so much!",
]
classifier(raw_inputs)
```

We have successfully reproduced the three steps of the pipeline: preprocessing with tokenizers, passing the inputs through the model, and postprocessing. Now let’s take some time to dive deeper into each of those steps.


```python

```
