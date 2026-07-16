# Benchmarking LLMs on Multiple NLP Tasks

[View Solution Notebook](https://18c0f69e57fc436faa3a02a6bb1ddeff.cc-propeller.cloud/edit/notebook.html)



**Setup**

Run the cell below to import the necessary libraries, set the random seed for reproducibility, and check the GPU availability.





```python
import numpy as np
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer, AutoModelForQuestionAnswering
from transformers import pipeline
from datasets import load_dataset
from sklearn.metrics import precision_score, recall_score,  f1_score
import time
import random


# Set random seed for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)

# Check if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
```

  



In this project, we'll be benchmarking different language models on standard NLP tasks. Let's start by loading a pretrained DistilBERT model for sentiment analysis that has been fine-tuned on the Stanford Sentiment Treebank (SST-2) dataset. This model will classify text as having positive or negative sentiment.

## Task Group 1 - Benchmarking on Sentiment Analysis

### Task 1

We’ve already initialized the model and the tokenizer. Now, initialize the model for sequence classification and move it to the available device. 

Uncomment the print statement to display the confirmation message.


```python
# Define the model for sentiment analysis (SST-2)
MODEL_NAME_SENTIMENT = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer_sentiment = AutoTokenizer.from_pretrained(MODEL_NAME_SENTIMENT)
### YOUR CODE HERE ###
model_sentiment = 
# print(f"Sentiment analysis model and tokenizer are ready.")

```

### Task 2

The function `tokenize_sentiment_data()` is defined with input parameters `input_text`, `tokenizer`, and an optional `sequence_length` (default `128`) to process text into a format the model can understand.

+ Within the function, use the tokenizer to convert the input text into tokenized format, ensuring padding and truncation to the specified maximum length, returning PyTorch tensors.

+ Then, move all tokenized inputs to the device and assign them to `inputs` for GPU computation.



```python
def tokenize_sentiment_data(input_text, tokenizer, sequence_length=128):
    ### YOUR CODE HERE ###
    tokenized = 
    inputs = 
    return inputs

```

### Task 3  

The function `calculate_metrics()` is already defined with input parameters `true_labels` and `predictions` to calculate evaluation metrics for the model. Now, inside the function, calculate precision and recall scores using appropriate functions from `sklearn.metrics`, and return both scores as the output.





```python
def calculate_metrics(true_labels, predictions):
    ### YOUR CODE HERE ###
    precision = 
    recall = 
    return precision, recall

```

### Task 4 and 5 

To evaluate the model, a function named `evaluate_sentiment()` has been defined with input arguments `model`, `tokenizer`, and `dataset`. The model is set to evaluation mode using `model.eval()`, and the variables `correct`, `total`, `predictions`, and `true_labels` are initialized to track performance. 

Loop through each `item` in `dataset`:  
- Tokenize the sentence using `tokenize_sentiment_data()` with `item['sentence']` and `tokenizer`.  
- Generate model predictions by passing `inputs` to `model` and extracting the predicted label using `argmax`.  
- Append `prediction` to `predictions` and `item['label']` to `true_labels`.

Within the loop:
- Update `correct` by checking if `prediction` matches the true label.  
- Increment `total` by `1` to track the total number of samples.  

Calculate accuracy, precision, and recall scores, then return them as outputs of the function.


```python
def evaluate_sentiment(model, tokenizer, dataset):
    model.eval()  # Set model to evaluation mode
    correct = 0
    total = 0
    predictions = []
    true_labels = []
    
    for item in dataset:
        
         ### YOUR CODE HERE ###
        
        # Tokenize the sentence
        inputs = 
        
        # Get model predictions
        outputs = 
        prediction = 
        
        # Collect predictions and true labels
        predictions.append()
        true_labels.append()
        
        correct += 
        total += 
    
    
    accuracy = 
    
    precision, recall = 
    
    return accuracy, precision, recall

```

### Task 6

We've already loaded. The SST-2 dataset from the GLUE benchmark using `load_dataset`.

- Define `sample_size` as `500` to limit the number of samples used for evaluation.
- Generate a random subset of indices by using `random.sample()` on the dataset length while ensuring it does not exceed `sample_size`. 
- Create a smaller dataset using the `select()` function with `sampled_indices`.  


```python
# Load the SST-2 dataset (sentiment analysis dataset from GLUE)
sentiment_dataset = load_dataset("glue", "sst2", split="validation")

# Sample a subset for faster evaluation 
### YOUR CODE HERE ###
sample_size = 
sampled_indices = 
sentiment_dataset = 

```

### Task 7

Evaluate the sentiment analysis model by calling `evaluate_sentiment()` with `model_sentiment`, `tokenizer_sentiment`, and `sentiment_dataset`, and store the results in `accuracy`, `precision`, and `recall`. 

Uncomment the print statements to display the sentiment analysis accuracy, precision, and recall.


```python
# Evaluate the model
### YOUR CODE HERE ###
accuracy, precision, recall = 

# print(f"Sentiment Analysis Accuracy: {accuracy:.2f}")
# print(f"Sentiment Analysis Precision: {precision:.2f}")
# print(f"Sentiment Analysis Recall: {recall:.2f}")
```

## Task Group 2 Benchmarking Qustion and Answer



### Task 8 

Now, we're going to set up a model for benchmarking question answering using a pretrained transformer model. The model is defined as `distilbert-base-uncased-distilled-squad`, a smaller, optimized version of BERT fine-tuned on the SQuAD dataset for extractive question answering.  

- Initialize the tokenizer using the model name and save it to the variable `tokenizer_qna`.  
- Initialize and save the question answering model to the device using the model name in the variable `model_qna`.



```python
# Define the model for question answering (SQuAD)
MODEL_NAME_QNA = "distilbert-base-uncased-distilled-squad"

### YOUR CODE HERE ###
tokenizer_qna = 
model_qna = 




```

### Task 9, 10 and 11

We've defined a function named `evaluate_qna()` with input arguments `model`, `tokenizer`, and `dataset` to evaluate the model. The model is set to evaluation mode using `model.eval()`, and the variables `correct`, `total`, `exact_matches`, and `f1_scores` are initialized to track performance.  

Loop through each `item` in `dataset`, extracting the values of `question`, `context`, and `answers`.
- Tokenize `question` and `context` using tokenizer with padding and truncation to a maximum length of `512` tokens, returning PyTorch tensors. 
- Move the tokenized input tensors to `device` to leverage GPU acceleration if available.  
- Perform a forward pass through `model` using the tokenized inputs to obtain predicted start and end logits.  
- Determine `start_idx` and `end_idx` by selecting the highest probability positions from the `start_logits` and `end_logits`.


Convert the predicted token indices into a text string using `tokenizer.convert_tokens_to_string()` to form the `predicted_answer`.  
- Retrieve the correct answer from `answers['text'][0]` and normalize both `predicted_answer` and `true_answer` by stripping spaces and converting them to lowercase.  
- Compute `exact_match` by checking if `predicted_answer` matches `true_answer` exactly, and append the result to `exact_matches`.
- Compute the `f1` score using `f1_score()` from `sklearn` and append the result to `f1_scores`.  
- Update `correct` by adding `exact_match` and increment `total` by `1` for each example processed.  



Compute the following evaluation metrics:
 
- Compute `accuracy` by dividing the total number of correct exact matches by the total number of examples.  
- Compute `avg_f1` by averaging the values in `f1_scores` to assess how well the predicted answer overlaps with the true answer.  
- Compute `avg_exact_match` by averaging the values in `exact_matches` to get the proportion of predictions that exactly match the true answer.  

Return `accuracy`, `avg_exact_match`, and `avg_f1` as the final evaluation metrics of the question-answering model.  


```python
def evaluate_qna(model, tokenizer, dataset):
    model.eval()  # Set model to evaluation mode
    correct = 0
    total = 0
    exact_matches = []
    f1_scores = []
    
    for item in dataset:
        question = item['question']
        context = item['context']
        answers = item['answers']
        
        ### YOUR CODE HERE ###
        tokenized = 
        inputs = 
        outputs = 
        start_score, end_score = 
        
        start_idx = 
        end_idx = 
        
        predicted_answer = 
        
        exact_match = 
        exact_matches.append(exact_match)
        
        f1 = 
        f1_scores.append(f1)
        
        correct += 
        total += 
    
    accuracy = 
    avg_f1 = 
    avg_exact_match = 
    
    return accuracy, avg_exact_match, avg_f1

```

### Task 12  

We've already loaded the SQuAD dataset using `load_dataset`, specifying `"squad"` as the dataset name and selecting the validation split.  

- Define `sample_size` as `100` to limit the number of examples used for evaluation.  
- Generate a random subset of indices using a sampling function to randomly select `sample_size` elements while ensuring it does not exceed the dataset length.  
- Create a smaller dataset using a selection function that retrieves only the randomly sampled indices. 



```python
# Load the SQuAD dataset (question answering dataset)
qna_dataset = load_dataset("squad", split="validation")

# Sample a subset for faster evaluation 
### YOUR CODE HERE ###
sample_size = 
sampled_indices = 
qna_dataset = 
```

### Task 13

Evaluate the question answering model by calling `evaluate_qna()` with `model_qna`, `tokenizer_qna`, and `qna_dataset`, and store the results in `qna_accuracy`, `qna_exact_match`, and `qna_f1`. 

Uncomment the print statements to display the sentiment analysis accuracy, precision, and recall.


```python
# Evaluate the model
### YOUR CODE HERE ###
qna_accuracy, qna_exact_match, qna_f1 = 

# print(f"Question Answering Accuracy: {qna_accuracy:.2f}")
# print(f"Question Answering Exact Match: {qna_exact_match:.2f}")
# print(f"Question Answering F1 Score: {qna_f1:.2f}")
```

## Task Group 3: Combining results



### Task 14 and 15

Now that we have implemented individual benchmarks for sentiment analysis and question answering, let's create a function to run both evaluations and consolidate the results.  

The function `run_all_benchmarks()` is already defined, and an empty dictionary `all_results` is initialized to store benchmark results.  

- Call `evaluate_sentiment()` with `model_sentiment`, `tokenizer_sentiment`, and `sentiment_dataset`, and store the returned values in `sentiment_accuracy`, `sentiment_precision`, and `sentiment_recall`.  
- Store the sentiment analysis results in `all_results["sentiment_analysis"]` under the keys `"accuracy"`, `"precision"`, and `"recall"`.

Within the function:

+ Call `evaluate_qna()` with `model_qna`, `tokenizer_qna`, and `qna_dataset`, and store the returned values in `qna_accuracy`, `qna_exact_match`, and `qna_f1`.
+ Store the question answering results in `all_results["question_answering"]` under the keys `"accuracy"`, `"exact_match"`, and `"f1_score"`.

Return the dictionary `all_results` as the output of the function.




```python
def run_all_benchmarks():
    all_results = {}

    # Evaluate Sentiment Analysis
    print("\n=== Running Sentiment Analysis Benchmark ===")

    ### YOUR CODE HERE ###
    sentiment_accuracy, sentiment_precision, sentiment_recall = 
    all_results["sentiment_analysis"] = {
        "accuracy": 
        "precision": 
        "recall": 
    }

    # Evaluate Question Answering
    print("\n=== Running Question Answering Benchmark ===")

    ### YOUR CODE HERE ###
    qna_accuracy, qna_exact_match, qna_f1 = 
    
    all_results["question_answering"] = {
        "accuracy": 
        "exact_match": 
        "f1_score": 
    }

    return all_results



```

### Task 16 

Now that we have implemented the function to evaluate both sentiment analysis and question answering, let's execute the benchmark and display the results.  

+ Call `run_all_benchmarks()` and store the returned dictionary in `benchmark_results`.    
+ Uncomment the print statement to output the dictionary `benchmark_results`, which contains evaluation metrics for both sentiment analysis and question answering.  




```python
# Run all benchmarks
### YOUR CODE HERE ###
benchmark_results = 

# Print the results
# print("\nBenchmark Results:")
# print(benchmark_results)
```
