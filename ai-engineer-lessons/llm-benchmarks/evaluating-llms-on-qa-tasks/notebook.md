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

Run the setup cell to install necessary libraries, load the SQuAD dataset, and convert it into DataFrames. The pre-trained DistilBERT model and tokenizer, both fine-tuned on SQuAD, are loaded for the question-answering task.


_Note_: The steps that involve loading the dataset or the model might take 30 seconds to a minute!





```python
# import necessary libraries
import evaluate
from transformers import pipeline, AutoTokenizer, AutoModelForQuestionAnswering
from datasets import load_dataset, load_metric
import torch
import pandas as pd
```


```python
# Load Dataset
dataset = load_dataset("squad")
print("\nDataset Structure:")
print(dataset)

# Convert to DataFrames
train_df = pd.DataFrame({
    'question': dataset['train']['question'],
    'context': dataset['train']['context'],
    'answer': [ans['text'][0] for ans in dataset['train']['answers']]
})

validation_df = pd.DataFrame({
    'question': dataset['validation']['question'],
    'context': dataset['validation']['context'],
    'answer': [ans['text'][0] for ans in dataset['validation']['answers']]
})

# Initialize the model and tokenizer for question answering
model = AutoModelForQuestionAnswering.from_pretrained('distilbert-base-uncased-distilled-squad')
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased-distilled-squad')

```

    Downloading readme: 7.62kB [00:00, 15.4MB/s]
    Downloading data files:   0%|          | 0/2 [00:00<?, ?it/s]
    Downloading data:   0%|          | 0.00/14.5M [00:00<?, ?B/s][A
    Downloading data: 100%|██████████| 14.5M/14.5M [00:00<00:00, 77.0MB/s][A
    Downloading data files:  50%|█████     | 1/2 [00:00<00:00,  5.23it/s]
    Downloading data: 100%|██████████| 1.82M/1.82M [00:00<00:00, 23.9MB/s]
    Downloading data files: 100%|██████████| 2/2 [00:00<00:00,  7.36it/s]
    Extracting data files: 100%|██████████| 2/2 [00:00<00:00, 1743.99it/s]
    Generating train split: 100%|██████████| 87599/87599 [00:00<00:00, 609559.45 examples/s]
    Generating validation split: 100%|██████████| 10570/10570 [00:00<00:00, 667044.72 examples/s]


    
    Dataset Structure:
    DatasetDict({
        train: Dataset({
            features: ['id', 'title', 'context', 'question', 'answers'],
            num_rows: 87599
        })
        validation: Dataset({
            features: ['id', 'title', 'context', 'question', 'answers'],
            num_rows: 10570
        })
    })


#### Note: Be sure to run the **Setup** cell above before completing the checkpoints!

### Checkpoint 1/4: Configure Model and Load Evaluation Metric

Now, we're going to prepare the model for evaluation and identify the necessary metrics to measure performance. The `device` is already set to GPU if available, or CPU otherwise, and the `model` is moved to the selected device. Now:

1. Switch the `model` to evaluation mode to disable training-related behaviors like dropout.
2. Set the `metric` as the 'squad' metric using Hugging Face's `load_metric`.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
# Move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Set the model to evaluation mode
model.eval()

### YOUR SOLUTION HERE ###
# Load the SQuAD evaluation metric
metric = 

print("Loaded metric details:\n\n", metric)
```

<details>
<summary><b>SQuAD Evaluation Metric Loaded</b></summary>

<p>The SQuAD evaluation metric is successfully downloaded and ready to use.</p>

<ul>
    <li><b>Metric Type:</b> squad (used for question answering tasks)</li>
    <li><b>What the Metric Needs:</b>
        <ul>
            <li><b>Predictions:</b> Each prediction must have:
                <ul>
                    <li><b>id:</b> A unique ID for each question</li>
                    <li><b>prediction_text:</b> The model's predicted answer</li>
                </ul>
            </li>
            <li><b>References (Correct Answers):</b> Each reference must have:
                <ul>
                    <li><b>id:</b> Same ID as the prediction to match them</li>
                    <li><b>answers:</b> A list of correct answers</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><b>What the Metric Calculates:</b>
        <ul>
            <li><b>Exact Match (EM):</b> How many predicted answers exactly match a correct answer.</li>
            <li><b>F1 Score:</b> How much of the predicted answer overlaps with the correct answer, even if it's not exact.</li>
        </ul>
    </li>
</ul>

<p>The metric is now ready to check model performance after adding predictions and correct answers.</p>

</details>


### Checkpoint 2/4: Extract Answers Predicted by the Model

The `get_answer()` function is defined to extract the model's predicted answer. The input question and context have been tokenized, moved to the device, and passed through the model. Now extract the answer:

1. Identify `answer_start` as the index with the highest confidence score by applying `argmax()` on `outputs.start_logits`.
2. Determine `answer_end` using `argmax()` on `outputs.end_logits`, adding `1` to include the complete answer span.
3. Extract `answer` by decoding the tokens between `answer_start` and `answer_end` from `inputs['input_ids']` using `tokenizer.decode()`.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
def get_answer(row):
    # Tokenization and device handling
    inputs = tokenizer(row['question'], row['context'], return_tensors='pt', padding=True, truncation=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    # Pass inputs through model
    outputs = model(**inputs)
    
    ### YOUR SOLUTION HERE ###
    answer_start = 
    answer_end = 
    answer = 
    return answer, inputs
```

### Checkpoint 3/4: Format Predictions for Evaluation

The function `add_to_metric()` formats and adds batches to the evaluation metric. Now we need to:

1. Create a `predictions` list that includes a dictionary with the current index as `id` and the predicted answer as `prediction_text`.
2. Create a `references` list containing a dictionary with the current index as `id` and `answers` containing a dictionary with:
   - `text`: a list with the correct answer from `row['answer']`
   - `answer_start`: a list containing `[0]`

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.



```python
def add_to_metric(i, answer, row):
    ### YOUR SOLUTION HERE ###
    predictions = 
    references = 
    metric.add_batch(predictions=predictions, references=references)
```

### Checkpoint 4/4: Run Evaluation Loop and Compute Scores

Now it's time to put everything together and see how well our model performs! We'll run the evaluation loop on a subset of the validation dataset under `torch.no_grad()` to disable gradient calculations for efficiency.

1. For each row, call the `get_answer()` function to get the predicted `answer` and `inputs`.
2. After processing all rows, compute the `final_scores` from the metric.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.



```python
num_samples = 100
with torch.no_grad():
    for i, row in validation_df.head(num_samples).iterrows():
        ## YOUR SOLUTION HERE ##
        answer, inputs = 
        add_to_metric(i, answer, row)

## YOUR SOLUTION HERE ##
final_scores = 
print(f"F1 Score: {final_scores['f1']:.2f}")
print(f"\nExact Match Score: {final_scores['exact_match']:.2f}")
```

<details>
<summary><b>Model Performance Summary</b></summary>

<p> The F1 score indicates the model is good at capturing relevant words even when the full answer does not match exactly.
</p>

<p> The Exact Match score suggests that some answers are close but not exact, meaning the model may be rephrasing or missing minor details.
</p>

<p><b>Potential Improvement</b><br>
Using a larger model (e.g., <i>bert-large-uncased-whole-word-masking-finetuned-squad</i>) might improve performance.
</p>

</details>

