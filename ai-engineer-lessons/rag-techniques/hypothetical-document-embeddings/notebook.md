Let's dive into another advanced technique: Hypothetical Document Embeddings (HyDE). HyDE introduces an innovative approach to the retrieval process in RAG systems.

In a standard RAG workflow, we embed the user's query directly for similarity search. HyDE, however, adds an intermediary step. Instead of embedding the query, we first use a language model to generate a hypothetical answer based on the query. This hypothetical answer is then embedded and used for the similarity search.

Why might this be beneficial? The model's imagined answer often contains terms that are likely to appear in relevant document chunks, potentially leading to more accurate retrievals than the original query alone.

In this exercise, we'll implement a basic HyDE search to gain hands-on experience with this technique. We'll continue using "The Mind and Its Education" by George Herbert Betts as our knowledge base, so prepare to explore the depths of human cognition through this advanced RAG method!

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

In the following cell, we import the helper functions we defined in the first exercise.


```python
from helpers import get_completion, populate_rag_query, make_rag_prompt, client_chroma, collection
```

#### Checkpoint 1/3

To create our HyDE RAG system we first need a prompt that will generate a hypothetical document given the user's query.

Fill in the function below with the rest of the prompt. Try, in your own words, instructing the model to do the following:

- try to answer the query
- if it doesn't know the answer, try to sound like it does
- use language it thinks will be in the actual answer
- make the answer roughly a paragraph long

Remember the general principles of prompt engineering. Models response better to positive language ("do this") than to negative language ("don't do this.") Language should be clear and concise.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def make_hyde_prompt(query):
    return f"""<INSTRUCTIONS>
## YOUR SOLUTION HERE ##
</INSTRUCTIONS>

<QUERY>{query}</QUERY>
"""

```

#### Checkpoint 2/3

Next, call the `make_hyde_prompt` function and send the result to OpenAI to retrieve the completion. (Use the helper function defined in the setup cell of this notebook.)

Finally, complete the Chroma query using the resulting hypothetical document to see what it retrieves.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
query = "How do we know what the mind is?"

## YOUR SOLUTION HERE ##
hyde_query_prompt =
hyde_query = 

print(hyde_query)

results = collection.query(
## YOUR SOLUTION HERE ##
)
print(results)
```

#### Checkpoint 3/3

Finally, let's put it all together. First make a HyDE prompt with the function we've defined above. Then pass it as the prompt to the language model, assigning it to  `hyde_query`. Use that query to format a collection of search results assigned to `result_str` (use the `populate_rag_query` helper function) and make the RAG prompt with `make_rag_prompt`. Send that prompt in a second call to the language model and you'll have successfully created a HyDE RAG system!

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def answer_query_with_hyde(user_query):
    ## YOUR SOLUTION HERE ##
    hyde_prompt = 
    hyde_query = 
    result_str = 
    rag_prompt = 
    rag_completion = 
    
    return rag_completion

user_query = "How do we know what the mind is?"
answer = answer_query_with_hyde(user_query)
print(answer)
```
