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

**Setup**

Run the setup cell below to import the necessary libraries from `transformers` and `datasets` and to load the SST-2 dataset from the GLUE benchmark for sentiment analysis.

The dataset is converted into `train_df`, `validation_df`, and `test_df` to structure the training, validation, and test splits for easier access and analysis.

_Note_: The steps that involve loading the dataset or the model might take 30 seconds to a minute!


```python
# Import Required Libraries
import transformers
import pandas as pd
import numpy as np
from datasets import load_dataset, load_metric
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer

# load dataset
dataset = load_dataset("glue", "sst2")

# Convert the training and validation datasets to Pandas DataFrames
train_df = pd.DataFrame(dataset['train'])
validation_df = pd.DataFrame(dataset['validation'])
test_df = pd.DataFrame(dataset['test'])
```

**Loading the model** 

The pre-trained `DistilBERT` model and its tokenizer are loaded for evaluating model performance using benchmark dataset metrics.  

The dataset is tokenized for uniform input length and set to return PyTorch tensors for evaluation.  



```python
# Loading the model and the tokenizer
model_checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(model_checkpoint)
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

def tokenize_function(examples):
    return tokenizer(examples["sentence"], truncation=True, padding="max_length",max_length=128)

# Tokenize the dataset in batches and set format to return PyTorch tensors
dataset = dataset.map(tokenize_function, batched=True)
dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "label"])
```

**Load Evaluation Metric**  

The Hugging Face evaluation metric is loaded to identify suitable metrics to evaluate the model’s performance on the `sst2` GLUE task.


```python
metric = load_metric("glue", "sst2")
print("Loaded metric details:\n\n", metric)

```


<details>
<summary style="display:list-item; font-size:16px; color:blue;">Note on Evaluation Metrics for SST-2</summary>
<ul>
    For the SST-2 task from the GLUE benchmark, <strong>accuracy</strong> is the primary evaluation metric, reflecting the percentage of sentiments correctly classified. This focus on <strong>accuracy</strong> is suitable for this balanced binary classification task, where both positive and negative classes are well-represented.</li>

</details>




_Note_: Be sure to run the **Setup** cells above before completing the checkpoints!

### Checkpoint 1/3: Compute Evaluation Metrics   

Now that we have the model's predictions, let's compute evaluation metrics to assess its performance:  

1. Extract `logits` and `labels` from the evaluation dataset to separate model outputs from actual labels.  

2. Use `np.argmax()` on `logits` along the correct axis to determine the predicted class for each input.  

3. Compute the evaluation metrics by passing `predictions` and `labels` as `references` into the metric computation function.  

Don’t forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
### YOUR SOLUTION HERE ###
def compute_metrics(eval_pred):
    logits, labels = 
    predictions = 
    return metric.compute(predictions=predictions, references=labels)

```

### Checkpoint 2/3: Initialize Trainer for Evaluation

1. Set up the `trainer` to evaluate model performance.  

2. Evaluation settings are already defined in `training_args`, with a batch size of `64`, evaluation enabled, and external logging disabled.  

3. Initialize `trainer` to manage the evaluation process:  
    - Assign the pre-trained model to `model`.  
    - Use `args` to apply `training_args`, ensuring the evaluation settings are followed.  
    - Set `eval_dataset` to the `validation` dataset for assessment.  
    - Attach `compute_metrics` to calculate model performance.  

Don’t forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.



```python
training_args = TrainingArguments(
    output_dir='./results',
    do_eval=True,
    per_device_eval_batch_size=64,  
    report_to="none"                
)

### YOUR SOLUTION HERE ###
trainer = Trainer(
    model=
    args=
    eval_dataset=
    compute_metrics=
)

```

### Checkpoint 3/3: Evaluate Model and Extract Accuracy

Now that we have set up the trainer, let's evaluate the model using the validation dataset and extract the accuracy score:

1. Call `evaluate()` on `trainer` to compute evaluation metrics on the validation dataset.  

2. Extract the `"eval_accuracy"` score from the evaluation results and store it in `accuracy`.  

Don’t forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
### YOUR SOLUTION HERE ###

# Evaluate the model
evaluation_results = 
# Extract and print the accuracy score
accuracy = 
print(f"GLUE Accuracy: {accuracy:.4f}")  
```

<details>
<summary style="display:list-item; font-size:16px; color:blue;">Note on Model Performance Metrics</summary>
<ul>
    The fine-tuned DistilBERT model achieved 91.06% accuracy on the SST-2 validation dataset from the GLUE benchmark.


- The model correctly classified 91.06% of the sentiment analysis samples.
- SST-2 is a binary classification task, meaning the model predicts whether a sentence has a positive (1) or negative (0) sentiment.
- 91.06% accuracy is a strong result, especially for a lightweight model like DistilBERT, meaning it has learned to classify sentiments quite well.


</ul>
</details>

