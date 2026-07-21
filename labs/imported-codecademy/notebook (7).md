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
import torch
import torch.nn.functional as F
import math
import numpy as np
import pandas as pd
```

#### Checkpoint 1/3

Let's now implement the attention mechanism from scratch and apply it to the following text sequence: `"The playful fox chases butterflies"`.

We'll start by creating **Q-vectors** for each token in the sequence.

**A.** We've tokenized the text sequence to the variable `tokens`. Let's initialize random embeddings with size `8` dimensions for each token. Save the embedding size to the variable `d`, then use `torch.randn()` to create the random embeddings, and save the embeddings to the variable `E`.

**B.** Next, let's initialize the weight matrix `Wq` with random weight values using a linear layer with the same dimensions as the embedding size, and without bias parameters. 

**C.** Create the Q-vectors for each token using the weight matrix and save them to the variable `Q`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
torch.manual_seed(42)
text = "The playful fox chases butterflies"
tokens = ["the", "playful", "fox", "chases", "butterflies"]

## YOUR SOLUTION HERE ##
d = 8
E = torch.randn(len(tokens), d)
Wq = torch.nn.Linear(d, d, bias=False)
Q = Wq(E)

# Show output - tokens, embeddings, and Q-vectors
print("Tokens:", tokens)
print("Embedding size:", E.shape)
print("Token Embeddings:\n", E)
print("Q-vectors:", Q)
```

#### Checkpoint 2/3

Let's now implement the full self-attention mechanism. 

Create a function named `compute_self_attention` that returns the attention scores, attention weights, and context vectors for each token. 

**A.** The function should take in two inputs: `embeddings` that are the pretrained embeddings for each token in the text sequence, and `seed` that controls the random initialization of values in the weight matrices.

**B.** Extract the embedding size using `embeddings.shape`, and use the embedding size to create the following weight matrices: `Wq`, `Wk`, and `Wv`. Then, use the weight matrices to create their respective Q, K, and V vectors: `Q`, `K`, and `V`.

**C.** Calculate the attention scores using the Q and K vectors, then calculate the attention weights using the softmax function, and, lastly, create the context vectors using the attention weights and V vectors. 

**D.** Apply the function to the random embeddings `E` while setting the random seed to `42`. Be sure to save the following variables:
- `attn_scores`: attention scores
- `attn_weights`: attention weights
- `context`: context vectors

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
def compute_self_attention(embeddings, seed=42):
    torch.manual_seed(seed)
    T, d = embeddings.shape

    Wq = torch.nn.Linear(d, d, bias=False)
    Wk = torch.nn.Linear(d, d, bias=False)
    Wv = torch.nn.Linear(d, d, bias=False)

    Q = Wq(embeddings)
    K = Wk(embeddings)
    V = Wv(embeddings)

    scores = Q @ K.transpose(-2, -1) / math.sqrt(d)
    weights = F.softmax(scores, dim=-1)
    context = weights @ V
    return scores, weights, context

attn_scores, attn_weights, context = compute_self_attention(E, seed=42)

# Show output - attention scores, weights, and context vectors
print("Attention Scores (Unnormalized):\n", attn_scores)
print("Attention Weights (Normalized):\n", attn_weights)
print("Context Vectors\n", context)
```

#### (Optional) Checkpoint 3/3

We've created the function in the following Jupyter notebook cell that visualizes the attention weights in a heatmap. 

Apply the function using the tokens in our text sequence and the attention weights we computed. 

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import seaborn as sns
import matplotlib.pyplot as plt
%matplotlib inline

def plot_attention_heatmap(tokens, attn_weights):
    attn = attn_weights.detach().cpu()
    T = len(tokens)
    
    plt.figure(figsize=(T, T))
    sns.heatmap(
        attn,
        xticklabels=tokens,
        yticklabels=tokens,
        cmap="YlGnBu",
        annot=True,
        fmt=".3f",
        cbar=True)

    plt.xlabel("Key")
    plt.ylabel("Query")
    plt.title("Attention Heatmap")
    plt.xticks(rotation=45)
    plt.yticks(rotation=0)
    plt.show()

## YOUR SOLUTION HERE ##
plot_attention_heatmap(tokens, attn_weights)
plt.show()
```

How would you interpret the attention weights for the token `fox`? That is, how much does the token `fox` (as the Query) attend to each token in the sequence (as Keys)?

<details><summary style="display:list-item; font-size:16px; color:blue;">Interpretation</summary>

We should remember that the attention scores and weights were computed using **randomly initialized** values for both the embeddings and weight matrices. 

Therefore, these numbers **do not correspond** to any meaningful values until training. 

But if we pretend that these values were meaningful, we would say that:
- `fox` pays the strongest attention to `the` (0.4089), meaning that ~41% of its attention goes to `the`.
- `fox` pays the least attention to `butterflies` (0.051).

</details>


```python

```
