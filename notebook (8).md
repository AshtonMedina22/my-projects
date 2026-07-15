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
Run the following cell to import libraries and helper function.


```python
from transformers import AutoTokenizer, AutoModel, AutoModelForCausalLM 
import torch
```

#### Checkpoint 1/4

Load a smaller, BERT-variant named **DistilBERT** from Hugging Face that is under the name `"distilbert-base-uncased"`.

Here's a table summarizing the difference between BERT and DistilBERT:

| Model               | Layers | Hidden Size | Parameters (approx.) | Relative Size | Summary                                                                                                                              |
| ------------------- | ------ | ----------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **BERT-base**       | 12     | 768         | 110 million     | 100%          | Original full BERT model trained with next sentence prediction and masked language modeling.                                       |
| **DistilBERT-base** | 6      | 768         | 66 million      | ~60%          | Distilled version of BERT-base with half the layers and no next sentence prediction objective. Retains ~97% of BERT’s performance. |

**A.** Save the model name string to the variable `distilbert_model_name`.

**B.** Load the matching tokenizer using `AutoTokenizer` to the variable `distilbert_tokenizer`.

**C.** Load the matching architecture and pretrained weights using `AutoModel` to the variable `distilbert_model`.

**D.** Use the tokenizer on the given sentence `text = "The playful fox chases butterflies"` and save the tokenized text to the variable `distilbert_inputs`

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
text = "The playful fox chases butterflies"

## YOUR SOLUTION HERE ##
distilbert_model_name = "distilbert-base-uncased"
distilbert_tokenizer = AutoTokenizer.from_pretrained(distilbert_model_name)
distilbert_model = AutoModel.from_pretrained(distilbert_model_name)

distilbert_inputs = distilbert_tokenizer(
    text,
    padding=True,
    truncation=True,
    return_tensors="pt"
)

# Show output - distilbert inputs
print(distilbert_inputs)
```

#### Checkpoint 2/4

Load the tokenized text into the pretrained DistilBERT model and extract its final hidden representations for each token.

**A.** Run the inputs `distilbert_inputs` through the model in inference mode using `torch.no_grad()` and save the outputs to the variable `distilbert_outputs`.

**B.** Access the final hidden state from `distilbert_outputs` containing  and save them to the variable `distilbert_last_hidden_state`.

Print the shape of the final hidden state and the rich, context-aware embedding vectors for each token.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
with torch.no_grad():
    distilbert_outputs = distilbert_model(**distilbert_inputs)
    
distilbert_last_hidden_state = distilbert_outputs.last_hidden_state

# Show output - distilbert rich, context-aware token vectors
print("Last Hidden State Shape:", distilbert_last_hidden_state.shape)
print(distilbert_last_hidden_state)
```

#### Checkpoint 3/4

Load a smaller, GPT-variant named **DistilGPT-2** from Hugging Face under the name `"distilgpt2"`. 

Here's a table summarizing the difference between GPT-2 and DistilGPT-2:

| Model             | Layers | Hidden Size | Parameters (approx.) | Relative Size | Summary                                                                                                                          |
| ----------------- | ------ | ----------- | -------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **GPT-2 (small)** | 12     | 768         | 124 million     | 100%          | Original GPT-2 model trained for autoregressive (left-to-right) language modeling. Generates text by predicting the next token.          |
| **DistilGPT-2**   | 6      | 768         | 82 million      | ~66%          | Distilled version of GPT-2 with half the layers. Retains most of GPT-2’s text-generation quality while being faster and smaller. |

**A.** Save the model name string to the variable `distilgpt_model_name`.

**B.** Load the matching tokenizer using `AutoTokenizer` and save it to the variable `distilgpt_tokenizer`.

**C.** Load the model architecture and pretrained weights using `AutoModelForCausalLM` to the variable `distilgpt_model`.

**D.** Tokenize the given prompt `prompt = "The playful fox chases butterflies"` and save the tokenized prompt to the variable `distilgpt_inputs`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
prompt = "The playful fox chases butterflies"

## YOUR SOLUTION HERE ##
distilgpt_model_name = "distilgpt2"
distilgpt_tokenizer = AutoTokenizer.from_pretrained(distilgpt_model_name)
distilgpt_model = AutoModelForCausalLM.from_pretrained(distilgpt_model_name)

distilgpt_inputs = distilgpt_tokenizer(prompt, return_tensors="pt")

# Show output - GPT2 inputs
print(distilgpt_inputs)
```

#### Checkpoint 4/4

Use the pretrained **DistilGPT-2** model to generate new text based on the given prompt.

**A.** Run the inputs `distilgpt_inputs` through the model in inference mode using `torch.no_grad()` and save the outputs to the variable `distilgpt_outputs`.
- Generate `50` new tokens and allow random sampling for creative generation.
- Be sure that the random seed is set to `0` with `torch.manual_seed(0)`.

**B.** Decode the generated token IDs in `distilgpt_outputs` back into human-readable text using the tokenizer's `decode()` method and save the it to the variable `generated_text`.

Print out the generated text.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
torch.manual_seed(0)

## YOUR SOLUTION HERE ##
with torch.no_grad():
    distilgpt_outputs = distilgpt_model.generate(
        **distilgpt_inputs,
        max_new_tokens=50,
        do_sample=True
    )

generated_text = distilgpt_tokenizer.decode(distilgpt_outputs[0])

# Show output - generated text
print(generated_text)
```

⚠️ **Disclaimer**: 

Text generated by large language models like GPT-2 or DistilGPT-2 is not **filtered** or **moderated**. The output may sometimes include bias, incorrect statements, inappropriate, or harmful language.

This exercise is for **educational purposes** to demonstrate how to generate text with pretrained transformers. Please use neutral, non-sensitive prompts when experimenting. 


```python

```
