<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!

[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:

1. Add your solution to the cell with `## YOUR SOLUTION HERE ##`.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Click on the dropdown arrow to view detailed instructions.
4. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
5. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)


```python
import torch
import datasets
from datasets import load_metric
```

#### Checkpoint (1/3): Calculating Perplexity

Perplexity is a measurement of how well a probability model predicts a sample. In NLP, it's commonly used to evaluate language models. Lower perplexity indicates better performance. Let's load the DistilGPT-2 model and calculate perplexity on some text samples.


```python
# Load pre-trained DistilGPT-2 model and tokenizer
model_name = "distilgpt2"
ppl = load_metric("perplexity")
```


```python
results = ppl.compute( model_id=model_name,
                        input_texts=["lorem ipsum", "Happy Birthday!", "Bienvenue"])
print(list(results.keys()))
```


```python
### YOUR SOLUTION HERE ###

```

#### Checkpoint (2/3) : Comparing Perplexities


```python
phrase_1 = ["Million Dollar Baby"]
phrase_2 = ["Anora"]

#### YOUR SOLUTION HERE ###


```

<details><summary style="display:list-item; font-size:16px; color:blue;"> Do the perplexity scores make sense?</summary>

Since `distilGPT2` is a smaller version of GPT-2, whose training data does not contain any access to information after February 2019, it's safe to assume that the likelihood of generating "Million Dollar Baby" is higher than that of "Anora". This in turn is reflected in the scores - "Anora" has much higher perplxity, making it less likely that the model will generate it!

#### Checkpoint (3/3) : Calculating BLEU

BLEU works by comparing n-grams (continuous sequences of n items) of the candidate text with the n-grams of the reference texts. The score ranges from 0 to 1, where higher is better.

We've defined two arrays `predictions` and `references` here. Calculate the BLEU score by using the syntax given in the narrative and print the output dictionary.


```python
predictions = [["hello", "there", "general", "kenobi"], ["foo", "bar" "foobar"]]
references = [[["hello", "there", "general", "kenobi"]],[["foo", "bar", "foobar"]]]

### YOUR SOLUTION HERE###


```

<details><summary style="display:list-item; font-size:16px; color:blue;"> Interpreting BLEU </summary>

The `results` dictionary contains many key-value pairs of interest. The `precisions` field contains all the individual precision scores for each n-gram. We can see how two of these values are an exact match (i.e., 1.0) as the `references` contains  

The BLEU score itself is then calculated by taking  the geometric mean of the precision scores. By default, the mean of all four n-gram precisions is  reported, a metric that is sometimes also called  BLEU-4. 

(_Optional_: You can do a quick check with a calculator to see if this is true! The geometric mean here would be the fourth root of the 4 precision scores multiplied.)


```python

```
