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

Run the setup cell below to install and import necessary libraries, load the SQuAD (Stanford Question Answering Dataset) dataset, and prepare it for a question-answering task. This involves transforming the dataset into DataFrame format for easy handling and visualization.

_Note_: The steps that involve loading the dataset or the model might take 30 seconds to a minute!



```python
# Import necessary libraries
import pandas as pd
import numpy as np
from transformers import DistilBertTokenizer, DistilBertForQuestionAnswering, pipeline
from datasets import load_dataset

```

**Loading and inspecting the dataset**


```python
# Load Dataset
dataset = load_dataset("squad")
print("\nDataset Structure:\n\n",dataset)

# 5. Convert to DataFrames
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

print("\nTraining Set Sample:")
train_df.head()

# (Optional) Use `.head()` to also take a look at the validation dataset!
```

**SQuAD Dataset Overview:**

The **SQuAD (Stanford Question Answering Dataset)** is a reading comprehension dataset for question-answering tasks. It includes a training dataset containing 87,599 samples and a validation dataset of 10,570 samples, each with a question, context, and answer(s). It is widely used to train and evaluate extractive question-answering models. 

#### Note: Be sure to run the **Setup** cell above before completing the checkpoints!

### **Checkpoint 1/2: Initialize Tokenizer and QA Pipeline**  

Configure the `tokenizer` and `qa_pipeline` for `'question-answering'`:  

1. The `model` is already initialized for question answering using `DistilBERT` .  
2. Load the corresponding `tokenizer` to preprocess input text.  
3. Set up `qa_pipeline` with `'question-answering'`, linking it to `model` and `tokenizer` for processing and answering questions.  

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
# Initialize model and tokenizer
model = DistilBertForQuestionAnswering.from_pretrained('distilbert-base-uncased-distilled-squad')

## YOUR SOLUTION HERE ##
tokenizer =
# Setup the QA pipeline
qa_pipeline = 

```

### **Checkpoint 2/2: Generate Predictions on a Sample**  

1. Use `qa_pipeline` to generate predictions for a selected sample from `validation_df`, storing the prediction details in `results`, an empty list.  

2. Iterate through `sample_validation`, extracting `context` and `question` for each row.  

3. Pass the extracted `question` and `context` into `qa_pipeline` to generate `answer`, which includes the predicted response and confidence score.  

4. Append a dictionary to `results` for each output, containing the `Question`, truncated `Context` (200 characters), `Predicted Answer`, and `Score`.  

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
# Use a small sample from the validation dataset for a quick demonstration
sample_validation = validation_df.sample(n=5, random_state=1)

# Generate predictions for the sample
results = []

## YOUR SOLUTION HERE ##
for _, row in sample_validation.iterrows():
    context = 
    question = 
    answer = 
    results.append({
        'Question': 
        'Context': 
        'Predicted Answer': 
        'Score': 
    })

# Display the results
results_df = pd.DataFrame(results)
results_df
```

<details>
<summary style="display:list-item; font-size:16px; color:blue;"><b>Model Performance Analysis</b></summary>
<p><b>High-confidence answers are mostly correct.</b><br>
Example: <i>Who started at tight end for the Panthers?</i> → Predicted: <i>Greg Olsen</i> (Score: 0.99) <br>
The model performs well on fact-based, direct questions.
</p>

<p><b>Low-confidence answers are often incomplete or unclear.</b><br>
Example: <i>How do academic results in former Model C schools compare?</i> → Predicted: <i>better</i> (Score: 0.38) <br>
The model struggles with open-ended or complex questions.
</p>

<p><b>Confidence scores help gauge reliability.</b><br>
Higher scores indicate more confident and likely more accurate predictions.
</p>
</details>


<details>
<summary style="display:list-item; font-size:16px; color:blue;"><b>Next Step</b></summary>

<ul>
    <li>Evaluate the model on the entire validation dataset using benchmarking metrics to quantify performance.</li>
    <li>If confidence scores are low, consider fine-tuning the model for improved results.</li>
</ul>

</details>

