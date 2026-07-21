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

Below we import the libraries we'll use for our finetune. Take a look at the specific modules we're importing from `transformers`--they'll do the heavy lifting for us on our finetuning run.


```python
from transformers import AutoTokenizer, TrainingArguments, AutoModelForSequenceClassification, Trainer
from datasets import  Dataset
import pandas as pd
import torch
```

#### Checkpoint 1/4

In the cell below, write a line that assigns "cuda" to `torch.device` if "cuda" is available, else assigns device "cpu".

Next, convert the imported DataFrame into a Hugging Face Dataset with the `Dataset.from_pandas()` method we covered earlier.

After that conversion, we split it into training and test sets using the 'dataset' column in the original data. 

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
data = pd.read_csv('imdb_data.csv')
## YOUR SOLUTION HERE ##
full_dataset = Dataset.from_pandas(data)

training_set = full_dataset.filter(lambda example: example['dataset'] == 'train')
test_set = full_dataset.filter(lambda example: example['dataset'] == 'test')
```

#### Checkpoint 2/4

Now, in the `tokenize_function`, tokenize the examples' `text` column, set the padding to the longest sequence in the batch and enable truncation to ensure all sequences are of the same length.
 
Then, map the `training_set` and `test_set` to the `tokenize_function` with `batched` set to True. This will apply the tokenization in batches which is more efficient.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased") # this tokenizer will work for our smaller model
## YOUR SOLUTION HERE ##

def tokenize_function(examples):
    return tokenizer(examples["text"], padding="longest", truncation=True)

tokenized_training_set = training_set.map(tokenize_function, batched=True)
tokenized_test_set = test_set.map(tokenize_function, batched=True)

```

#### Checkpoint 3/4

Remember the TrainingArguments we defined when we evaluated the base model? Well, now we'll dive a little deeper.

We've filled out many of these Training Arguments to sensible settings. 

- `output_dir` is where the model's output is saved. Don't change this, as we need to save results in `temp_results`. As the name suggests, these are wiped frequently, so don't expect to save anything there.
- `warmup_steps` specifies the length of the warm up phase at the start of training. Gradually increasing the learning rate at the start of training can help the model avoid bad outcomes early in the training process.
- `weight_decay` helps prevent overfitting by reducing the magnitude of the model's weights.
- `logging_dir` specifies where to save the training logs
- `learning_rate`, as you should know already, refers to the size of the steps the optimizer takes for each iteration of gradient descent
-  `save_strategy` specifies how we wish to save checkpoints of the model across different epochs. Don't change this value.

Now, you need to specify the number of training epochs and the batch size for both training and evaluation.
Finetuning requires fewer epochs than pretraining.

Set `num_train_epochs` to 3, `per_device_train_batch_size` to 12, and `per_device_eval_batch_size` also to 12.


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
training_args = TrainingArguments(
    output_dir="./temp_results", # do not change this
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
    learning_rate=1e-4,
    save_strategy="no", # do not change this
    ## YOUR SOLUTION HERE ##
    num_train_epochs=3,
    per_device_train_batch_size=12,
    per_device_eval_batch_size=12,
)


model = AutoModelForSequenceClassification.from_pretrained("prajjwal1/bert-tiny", num_labels=2)
```

#### Checkpoint 4/4
We've defined our training arguments and instantiated our model. Now we need to move the model to the GPU.

Use the variable we defined in the first cell to move the model to the GPU if it's available.

In the code below that line, we put everything together in Hugging Face's `Trainer` class. Now that the trainer has the model, the arguments, and both datasets, we simply need to call `trainer.train()` to perform our finetuning run.

When you're done, evaluate the model's results with `trainer.evaluate()` on the final line of the cell.

*Note: You may wonder, 'Why do we not need to move anything other than the model to the GPU in this code? The answer is that the always-ergonomic Hugging Face moves our data over with the `Trainer` class for us. Gotta love that comfortable developer experience!* 


```python
## YOUR SOLUTION HERE ##
model.to(device)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_training_set,
    eval_dataset=tokenized_test_set
)

## YOUR SOLUTION HERE ##
trainer.train()
trainer.evaluate()
```

Remember our evaluation loss from the base BERT model? So long as you ran the random seed code in that exercise, your loss value in that initial evaluation should've been 0.7226571440696716. The `eval_loss` above is quite the improvement, right?

Finally, we'll run the line `model.save_pretrained("./our_finetuned_model")`. This will save the model so we can use it on our own, which we'll go over in greater depth in the next exercise.


```python
model.save_pretrained("./our_finetuned_model")
```
