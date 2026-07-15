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

Run the setup cell to import the relevant libraries.


```python
from transformers import BertConfig, BertModel, AutoTokenizer

```

**Checkpoint 1/3: Model config**

Print `config` to see what it looks like.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Building the config
config = BertConfig()

## YOUR SOLUTION HERE ##
print(config)

```

**Checkpoint 2/3: Building the model from config**

Print `model` to examine what a randomly instantiated model looks like.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Building the model from the config
model = BertModel(config)

## YOUR SOLUTION HERE ##
print(model)

```

**Checkpoint 3/3: Tokenizers from model checkpoint**

Create a tokenizer, tokenizer with distilbert-base-uncased as the checkpoint. Tokenize the sample text provided (and be sure to print it!).

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
checkpoint = 'distilbert-base-uncased-finetuned-sst-2-english'
sample_text = ["BERT is an encoder-only transformer."]

## YOUR SOLUTION HERE ##
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
tokenized_text = tokenizer(sample_text)
print(tokenized_text)

```

<details><summary style="display:list-item; font-size:16px; color:blue;">Want to know more about BERT?</summary>
    
Recall that there are three types of transformer models based on their architecture, i.e., whether they're encoder-only, decoder-only or encoder-decoder models. BERT is an encoder-only transformer model and it stands for Bidirectional Encoder Representations from Transformers. Attention layers in BERT have access to all the words in a sentence making the BERT class of models great at tasks that involve understanding an entire sentence such as sentence classification. 
    
The original BERT model was proposed in [2018](https://arxiv.org/abs/1810.04805) and had 340 million parameters. We've been using a much smaller model, [distilbert-base-uncased-finetuned-sst-2-english](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english). We're going to learn more about this model in the upcoming exercise!


```python

```
