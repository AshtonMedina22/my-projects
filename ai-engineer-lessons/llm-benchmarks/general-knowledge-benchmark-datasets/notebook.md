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

Run the setup cell below to import required libraries, load and process the MMLU dataset into a DataFrame, prepare a balanced sample dataset for evaluation, and load the pre-trained `google/flan-t5-small` model and tokenizer. 
 

_Note_: The steps that involve loading the dataset or the model might take 30 seconds to a minute!


```python
# Import necessary libraries
import pandas as pd
import torch
import numpy as np
import evaluate
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
```


```python
dataset=load_dataset("cais/mmlu", "all")
dataset

# Function to convert dataset to DataFrame
def dataset_to_df(data_split):
    data_list = []
    for example in data_split:
        data_list.append({
            'subject': example['subject'],
            'question': example['question'],
            'choices': example['choices'],
            'answer_index': example['answer']
        })
    return pd.DataFrame(data_list)

# Convert all four splits to DataFrames
test_df = dataset_to_df(dataset["test"])
validation_df = dataset_to_df(dataset["validation"])
dev_df = dataset_to_df(dataset["dev"])
auxiliary_train_df = dataset_to_df(dataset["auxiliary_train"])

```

    Downloading readme: 53.2kB [00:00, 81.9MB/s]
    Downloading metadata: 138kB [00:00, 208MB/s]
    Downloading data files:   0%|          | 0/4 [00:00<?, ?it/s]
    Downloading data:   0%|          | 0.00/3.50M [00:00<?, ?B/s][A
    Downloading data: 100%|██████████| 3.50M/3.50M [00:00<00:00, 29.5MB/s][A
    Downloading data files:  25%|██▌       | 1/4 [00:00<00:00,  8.14it/s]
    Downloading data: 100%|██████████| 408k/408k [00:00<00:00, 10.4MB/s]
    
    Downloading data: 100%|██████████| 76.5k/76.5k [00:00<00:00, 2.69MB/s]
    
    Downloading data:   0%|          | 0.00/47.5M [00:00<?, ?B/s][A
    Downloading data: 100%|██████████| 47.5M/47.5M [00:00<00:00, 267MB/s][A
    Downloading data files: 100%|██████████| 4/4 [00:00<00:00, 10.46it/s]
    Extracting data files: 100%|██████████| 4/4 [00:00<00:00, 2239.95it/s]
    Generating test split: 100%|██████████| 14042/14042 [00:00<00:00, 533264.67 examples/s]
    Generating validation split: 100%|██████████| 1531/1531 [00:00<00:00, 415065.57 examples/s]
    Generating dev split: 100%|██████████| 285/285 [00:00<00:00, 144334.30 examples/s]
    Generating auxiliary_train split: 100%|██████████| 99842/99842 [00:00<00:00, 250506.94 examples/s]


The MMLU dataset is loaded, covering multiple subjects across general knowledge topics.  

The dataset is converted into DataFrames:  
- `test_df` contains the test set of 14042 rows.  
- `validation_df` contains the validation set of 1531 rows.  
- `dev_df` contains the development set of 285 rows.  
- `auxiliary_train_df` contains the auxiliary training set of 99842 rows.

In the below code we've created a function to extract a diverse sample of subjects and used it to prepare `sample_data` for quick evaluation across a variety of topics.


```python
def extract_diverse_sample(dataframe, sample_size=10):
    np.random.seed(10)  # Set seed inside function to ensure reproducibility

    unique_subjects = dataframe['subject'].unique()
    selected_subjects = np.random.choice(unique_subjects, size=min(len(unique_subjects), sample_size), replace=False)

    # Sample one question per selected subject
    sample_df = dataframe[dataframe['subject'].isin(selected_subjects)].groupby('subject').sample(n=1, random_state=42)

    # If fewer than 10 subjects, randomly sample more to fill the rest
    if len(sample_df) < sample_size:
        remaining_samples = dataframe[~dataframe.index.isin(sample_df.index)].sample(
            n=sample_size - len(sample_df), random_state=42
        )
        sample_df = pd.concat([sample_df, remaining_samples])

    return sample_df.reset_index(drop=True)

# Extract sample data
sample_data = extract_diverse_sample(validation_df, sample_size=10)

# Display sample
sample_data

```

In the below code `tokenizer` and `model` are initialized using `T5Tokenizer` and `T5ForConditionalGeneration` from the pre-trained `google/flan-t5-small`, preparing them for generating answers to multiple-choice questions.

The `device` is set CPU for more stability, and the `model` is moved to the selected `device`.



```python
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline

# Load a smaller model with reasoning capabilities
print("Loading smaller model with reasoning capabilities...")
model_name = "google/flan-t5-small"  
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Use CPU
device = "cpu"
model.to(device)

print("Model loaded successfully")
     
```

### Checkpoint 1/5: Generate Predictions for Sample Questions
The `generate_prediction` function is defined to generate model predictions for each sample question. We've formatted and tokenized the input text, moved it to the device, and disabled gradients for efficient inference. Now:

1. Generate the model's prediction with the `inputs` and limit the responses to `50`, then store the result in `outputs`.
2. Decode the generated output into readable text using `tokenizer.decode()`, skipping special tokens and stripping whitespace, then store it in `predicted_text`.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
def generate_prediction(row):
    input_text = f"Question: {row['question']}\nChoices:\n" + "\n".join(row['choices'])
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True).to(device)
    with torch.no_grad():
        ## YOUR SOLUTION HERE ##
        outputs = 
    predicted_text = 
    return predicted_text

```

### Checkpoint 2/5: Compare Predictions with Correct Answers
We have defined a function `compare_and_collect()` to compare the model's prediction with the correct answer and return all the results. Now:

1. Extract the correct answer from the row's choices using the row's answer index and store it in `correct_answer`.
2. Compare the predicted text with the correct answer using `.lower()` for case-insensitive comparison and store the result in `is_correct`.


Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
def compare_and_collect(row, predicted_text):
    ## YOUR SOLUTION HERE ##
    correct_answer = 
    is_correct = 
    return {
        'subject': row['subject'],
        'question': row['question'],
        'choices': row['choices'],
        'actual_answer': correct_answer,
        'predicted_answer': predicted_text,
        'correct': is_correct
    }

```

### Checkpoint 3/5: Process All Sample Questions
We've set up the loop to process all the sample questions and  collect the results in a list to store them to DataFrame `results_df`. Now:

1. Call `generate_prediction` with the row to get the prediction and store it in `pred`.
2. Call `compare_and_collect` with the row and prediction to get the results and store them in `res`.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
results = []
for _, row in sample_data.iterrows():
    ## YOUR SOLUTION HERE ##
    pred = 
    res = 
    results.append(res)

results_df = pd.DataFrame(results)
results_df

```

### Checkpoint 4/5: Evaluate Model Performance
Now that `results_df` contains the model's predictions, let's assess overall performance of model using accuracy and F1 score:

1. Calculate accuracy using `accuracy_score()` by comparing the `correct` column against a reference list of `True` values with the same length.
2. Calculate F1 score using `f1_score()` with the same comparison, using `average` set to `binary`.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
from sklearn.metrics import accuracy_score, f1_score

## YOUR SOLUTION HERE ##
accuracy = 
f1 = 

print(f"\nModel Performance:")
print(f"Accuracy: {accuracy * 100:.2f}%")
print(f"F1 Score: {f1 * 100:.2f}%")

```

<details><summary style="display:list-item; font-size:16px; color:blue;"><strong>Model Performance Analysis</strong></summary><p></p><p><b>Accuracy: 20.00% -</b> The model correctly predicted 20% of the total cases.</p>
<p><b>F1 Score: 33.33% -</b> The balance between precision and recall, indicating room for improvement in distinguishing correct and incorrect predictions.</p>

<p><b>Interpretation:</b></p>
<ul>
    <li>Low Accuracy (20%) suggests that the model struggles with overall correctness.</li>
    <li>F1 Score (33.33%) being higher than accuracy indicates that while the model makes correct predictions, it may also have many false positives or false negatives.</li>
</ul>
</details>


### Checkpoint 5/5: Analyze Performance by Subject

Now that we've evaluated overall model performance, let's analyze how well it performed across different subjects.  

Group `results_df` by `subject` and compute the mean of `correct` column to determine the percentage of correct predictions per subject.  

Don’t forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
subject_performance = 

# Show performance by subject area (percentage of correct predictions per subject)
print("\nPerformance by subject:")
subject_performance

```

<details>
<summary style="display:list-item; font-size:16px; color:blue;"><strong>Performance Analysis by Subject</strong></summary>
<p><strong>High Accuracy (100% Correct Predictions):</strong> The model performed exceptionally well in subjects like <em>global_facts</em> and <em>high_school_us_history</em>, where all predictions were correct.</p>

<p><strong>Low Accuracy (0% Correct Predictions):</strong> In subjects like <em>astronomy</em>, <em>business_ethics</em>, and <em>high_school_physics</em>, the model failed to make any correct predictions.</p>

<p><strong>Performance Variation:</strong> The accuracy levels differ across subjects, indicating that the model performs well in certain domains but struggles in others.</p>
</details>

