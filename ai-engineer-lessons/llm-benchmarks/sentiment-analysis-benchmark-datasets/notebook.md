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

#### Setup
Run the setup cell below to install and import necessary libraries, load the SST-2 dataset from the GLUE benchmark for sentiment analysis, and understand its content of movie reviews labeled as positive (1) or negative (0).


_Note_: The steps that involve loading the dataset or the model might take 30 seconds to a minute!


```python
# Import necessary libraries
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from datasets import load_dataset 
import warnings
warnings.filterwarnings("ignore")
```

**Loading and inspecting the dataset**


```python
# Load the SST-2 dataset
dataset = load_dataset("glue", "sst2")


# Convert the training and validation datasets to Pandas DataFrames
train_df = pd.DataFrame(dataset['train'])
validation_df = pd.DataFrame(dataset['validation'])
test_df = pd.DataFrame(dataset['test'])

# Display the first few rows of the training datasets
print("\nTraining Set Sample:")
print(train_df.head())

# (Optional) Use `.head()` to also take a look at the validation and test datasets!
```

The SST-2 (Stanford Sentiment Treebank) is a dataset consisting of movie reviews labeled as positive (1) or negative (0). The data is organized into a training dataset containing 67,349 samples, a validation dataset of 872 samples used and a test dataset of 1,821 samples. The labels are hidden in the test dataset to provide an unbiased final model evaluation.

**Loading the model**

The model we will be evaluating is a pretrained `DistilBERT` model, a lighter, faster version of BERT with similar performance.


```python
model_checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
model = AutoModelForSequenceClassification.from_pretrained(model_checkpoint, num_labels=2)
```

#### Note: Be sure to run the **Setup** cell above before begining with the checkpoints!

#### Checkpoint 1/4: Tokenization

We've defined a tokenization function to convert text into tokens that the model can understand. Apply this function to the dataset using `.map()` and set the argument `batched` to `True`.

The dataset format is set to return PyTorch tensors, with the necessary columns specified.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
def tokenize_function(examples):
    return tokenizer(examples['sentence'], truncation=True, padding='max_length', max_length=128)

### YOUR SOLUTION HERE ###
# Apply tokenization to the entire dataset
dataset = 

dataset.set_format(type='torch', columns=['input_ids', 'attention_mask', 'label'])
```

#### Checkpoint 2/4: Predict Outcomes on the Validation Sample

Check if the model can predict correctly on new data using a small sample from the validation set. 


A sample is taken from the `validation` set. The necessary inputs, `input_ids` and `attention_mask`, are prepared, and the  `label` is gathered for later comparison.

`torch.no_grad()` is defined to disable gradient calculation during prediction, optimizing memory usage and computational efficiency.

+ Pass `inputs` to the model to generate `outputs`, containing the raw predictions (`logits`).
+ Apply the `softmax()` function to these `logits` using `torch.nn.functional.softmax`, setting `dim=-1` to calculate probabilities across the correct axis. Store these probabilities in the `predictions`.
+ Determine the most likely class labels by finding the index with the highest probability in `predictions`. Store these in `predicted_labels`.

Don’t forget to run the cell and save the notebook before selecting "Test Work"! For additional support, open the "Jupyter Help" toggle at the top of the notebook.


```python
# Select a sample from the validation set
sample_data = dataset['validation'][:5]
inputs = {key: sample_data[key] for key in ['input_ids', 'attention_mask']}
labels = sample_data['label'].tolist()

### YOUR SOLUTION HERE ###
# Perform prediction
with torch.no_grad():
    outputs = 
    predictions = 
    predicted_labels = 

```

<details>
    <summary style="display:list-item; font-size:16px; color:blue;"><b>Why Use a Small Sample?</b></summary>
    <p> We're using a small sample from the validation to avoid running out of memory and computational limitations. This approach allows us to quickly evaluate the model’s performance without the extensive resource requirements of processing the full dataset. Feel free to try out larger samples in your local or using Google Colab. </p>
</details>


#### Checkpoint 3/4: Decoding and Displaying Predictions

We're now ready to convert the model's input data from tokenized IDs back to readable text and display the predictions alongside actual sentiments.

Decode each sequence in `input_ids` into readable sentences by applying the tokenizer's `decode()` method with `skip_special_tokens` enabled, to recover the original text and simplify the interpretation of the model's inputs.

Create DataFrame `results_df` to display: 

+ `sentences` for the readable text
+ `predicted_labels` for the model’s predicted sentiments
+ `labels` for the actual sentiments

Don’t forget to run the cell and save the notebook before selecting "Test Work"! For additional support, open the "Jupyter Help" toggle at the top of the notebook.


```python
### YOUR SOLUTION HERE ###
# Decode the sentences from the tokenizer
sentences = 

# Create a DataFrame to display the sentences, predicted sentiments, and actual sentiments
results_df = pd.DataFrame({
    'Sentence': 
    'Predicted Sentiment': 
    'Actual Sentiment': 
})

# Print the DataFrame
print("\nPredictions and Actual Labels:")
results_df
```

<details>
    <summary style="display:list-item; font-size:16px; color:blue;"><b>Note on Model Predictions</b></summary>
    <p>The table below shows a sample of prediction results along with their accuracy details:</p>
    <ul>
        <li>The <i>Predicted Sentiment</i> column contains the model's classification (0 = Negative, 1 = Positive).</li>
        <li>The <i>Actual Sentiment</i> column contains the correct labels from the dataset.</li>
        <li>If <i>Predicted Sentiment</i> ≠ <i>Actual Sentiment</i>, the model has made an incorrect prediction.</li>
        <li>In this sample, the model correctly classified both positive (1) and negative (0) sentiments.</li>
        <li>The model is not biased in this particular set of predictions.</li>
    </ul>
</details>

#### Checkpoint 4/4: Calculate Precision and Recall

Now that we can see our model's predictions, let's evaluate its performance using metrics from scikit-learn to understand how effectively it classifies sentiment.

Calculate `precision` and `recall` using the scikit-learn metrics functions with your actual and predicted sentiment values from `results_df`. Ensure you configure weighted averaging in both calculations.

Don't forget to run the cell and save the notebook before selecting "Test Work"! Open the "Jupyter Help" toggle at the top of the notebook for more details.


```python
# Import metrics from scikit-learn
from sklearn.metrics import precision_score, recall_score


### YOUR SOLUTION HERE ###
# Calculate precision and recall
precision = 
recall = 

# Print metrics
print(f"Model Precision: {precision:.4f}")
print(f"Model Recall: {recall:.4f}")
```

<details>
    <summary style="display:list-item; font-size:16px; color:blue;"><b>Note on Metrics Score</b></summary>
    <ul>
        <li>The precision score indicates how many predicted positives were actually correct</li>
        <li>The recall score indicates how many actual positives were correctly identified</li>
        <li> The metric scores here indicates the model correctly classifies all sentiments in our small sample dataset</li>
        <li>In the next exercise, we will evaluate model performance through benchmark metrics, which is essential to evaluate model performance</li>
    </ul>
</details>


```python

```
