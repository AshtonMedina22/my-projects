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


```python
import torch
import random
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from pprint import pprint

def set_seed(seed=42):
    random.seed(seed)
    torch.manual_seed(seed)

set_seed() 
```

To spare our Codecademy computers a little extra work, we've cut the IMDB dataset down to a smaller CSV file, which we'll import via pandas. If you'd like to see the Hugging Face card for the whole Dataset, check it out [here](https://huggingface.co/datasets/imdb).

Execute the next four code cells to import the data and explore it.

### Imports and EDA


```python
df = pd.read_csv('imdb_data.csv')
print(df.head())
print("Number of null values:")
print(df.isnull().sum())
```

As you can see, it's pretty simple: the `text` column holds the reviews themselves, while `label` is 1 or 0 (1 is positive sentiment, 0 is negative sentiment.) Finally, the `dataset` column separates the data into training and test sets. There are no null values in the dataset--thanks, Hugging Face!


```python
print("Dataframe Info:")
print(df.info())
print("\n")
print("Dataframe Description:")
print(df.describe())
print("\n")
print("Number of unique values in each column:")
print(df.nunique())
```

We've got 2500 rows. Let's take a look at a random review to get a feel for how they sound.


```python
random_index = random.randint(0, len(df) - 1)
pprint(df.loc[random_index, 'text'])
```


```python
# Curious how this tokenization code works? We'll cover it in more detail at the end of this exercise.
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased") # this tokenizer will work for our smaller model
tokenized_reviews = df['text'].apply(lambda x: tokenizer.encode(x, add_special_tokens=True))
review_token_lengths = tokenized_reviews.apply(len)
print(f"Shortest review length (in tokens): {review_token_lengths.min()}")
print(f"Longest review length (in tokens): {review_token_lengths.max()}")
print(f"Average review length (in tokens): {review_token_lengths.mean()}")

```

Note the warning in the last cell's output above. Some of the examples in the dataset are longer than our model can intake. We'll need to be careful about how we handle the longer reviews in our dataset.

### Evaluating the base model

#### Checkpoint 1/3

Now that we've explored our data, let's evaluate the base model's performance with test data. This way, we'll have a basic idea of how much better our finetuned model is at classifying the sentiment of movie reviews relative to the model it was based on.

Hugging Face's Dataset library has a helpful method, `from_pandas`, that can convert a DataFrame into a Hugging Face Dataset.

Call the `from_pandas` method of `Dataset` below, passing in our DataFrame (`df`) as the argument.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
from datasets import Dataset

## YOUR SOLUTION HERE ##
dataset = Dataset.from_pandas(df)
```

#### Checkpoint 2/3

Next we'll tokenize the data.

Hugging Face provides a useful `.map` method to instantiated datasets. Just pass it a function that takes in the data you want tokenized and outputs the tokenized data.

We've defined the `tokenize_function` for you. At the bottom of the cell, use our `dataset`'s `.map()` method to tokenize the data. You'll do this by passing the `tokenize_function` as the first argument, and passing `batched=True` as the second argument so that we'll tokenize the text in batches.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def tokenize_function(examples):
    return tokenizer(examples['text'], padding="longest", truncation=True)

## YOUR SOLUTION HERE ##
tokenized_dataset = dataset.map(tokenize_function, batched=True)

```

Good. We'll now instantiate our model, a tiny version of BERT that will be great for learning the basics of writing finetuning code. Execute the cell below.


```python
model = AutoModelForSequenceClassification.from_pretrained("prajjwal1/bert-tiny", num_labels=2)
```

#### Checkpoint 3/3

While our warning correctly reminds us that bert-tiny is not ready for production use and should instead first be finetuned, we're going to evaluate it anyway by passing it our test data.

That way, we'll have a basic idea of whether or not our finetuning run actually improves the model's ability to classify movie reviews.

If you see some unfamiliar code in the cell below, don't worry. We'll cover everything in greater detail soon. For now, tell the model it's in 'evaluation mode' (and not 'training mode') by passing the arguments `do_train=False` and `do_eval=True` to the `TrainingArguments()` call.

Then, on the line where we define `eval_results`, run `trainer.evaluate()`. This will print `eval_results` to the console on the next line.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# this is a Hugging Face method that makes it easy to filter our dataset for only 'test' data
eval_dataset = tokenized_dataset.filter(lambda x: x['dataset'] == 'test')

## YOUR SOLUTION HERE ##
training_args = TrainingArguments(
    output_dir='./temp_results',  
    do_train=False,
    do_eval=True,
    seed=42
)

trainer = Trainer(
    model=model,
    args=training_args,
    eval_dataset=eval_dataset
)

## YOUR SOLUTION HERE ##
eval_results = trainer.evaluate()
print(eval_results)
```

Consider writing down the `eval_loss` number, as we'll be comparing it to the finetuned models later.
