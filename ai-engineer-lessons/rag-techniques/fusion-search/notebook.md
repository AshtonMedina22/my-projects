 Building on our exploration of Contextual Query Retrieval (CQR), let's now dive into another advanced RAG technique: Fusion Search. This method introduces an innovative approach to handling complex queries in RAG systems.

In a standard RAG workflow, we typically process a single query to retrieve relevant information. Fusion Search, however, breaks down a complex query into multiple subqueries. Each subquery is then processed individually through the RAG system, and the results are combined to form a comprehensive answer.

Why might this be beneficial? By decomposing complex questions, we can often retrieve more precise and relevant information, especially when dealing with dense or challenging texts. This approach also mimics how humans might tackle complex problems by breaking them down into smaller, more manageable parts.

In this exercise, we'll implement a basic Fusion Search to gain hands-on experience with this technique. We'll continue using "The Mind and Its Education" by George Herbert Betts as our knowledge base. We'll also gain some valuable experience converting outputs into parseable code, which is great preparation for developing AI agents.

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

In the following cell, we import the helpers defined in the first exercise. We also import the `json` library.


```python
from helpers import get_completion, populate_rag_query, make_rag_prompt
import json
```

In fusion search, we first split the query into a list of subqueries. We then loop through the subqueries and send RAG prompts to a language model for each of them.

This requires doing something you may be unfamiliar with: prompt engineering some JSON!

In the example cell, we'll prompt the model for JSON, get it back, and parse it so we can use it as a regular Python dict.


```python
response = get_completion("""<INSTRUCTIONS>
Generate valid JSON with the key "data" and a list of 1,2,3.
Only generate the JSON. Do not output any additional characters.
Do not output markdown backticks. Just raw JSON.
</INSTRUCTIONS>
                          
YOUR JSON:""")
our_loaded_json = json.loads(response)
for number in our_loaded_json['data']:
    print(f"Number: {number}")
```

#### Checkpoint 1/3

In fusion search, we first prompt the model with the original query and instruct it to break the query down into a list of subqueries.

We've written the prompt for you in the cell. First, send it to the language model via `get_completion`. Then parse the model's output into a dictionary via the method seen in the example cell.

*Note: Though models are getting increasingly better about consistenly outputting valid JSON, there's a small chance the model might output invalid JSON. If this happens, try inspecting the model's output before it's parsed, tweaking the prompt and trying again.*

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def generate_subquestions(query):
    prompt = f"""<INSTRUCTIONS>
Given the following user query, generate a list of 2-4 subquestions that would help in answering the original query. 
Return the result as JSON with the key "data" and the list as its value. 
Only output valid JSON and no other characters.
Do not output markdown backticks. Just output raw JSON only.
</INSTRUCTIONS>

<QUERY>{query}</QUERY>
"""
    response = get_completion(prompt)
#     if the model generates invalid json, uncomment the print line and inspect what went wrong
#     print(response)
    subquery_dict = json.loads(response)
    return subquery_dict['data']

generate_subquestions("What should I eat for dinner tonight?")
```

#### Checkpoint 2/3
Now assemble these function calls into a higher-order function that generates the subquestions and concatenates their answers into a string.

First, prompt the model to create the subquestions using our existing function.

Then, perform a RAG search with each subquestion in the for loop using our existing helper functions.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def get_and_concat_subquestions(query):
    subquestions = generate_subquestions(query)
    subquestion_context = []
    for subquestion in subquestions:
        result_str = populate_rag_query(subquestion)
        rag_prompt = make_rag_prompt(subquestion, result_str)
        answer = get_completion(rag_prompt)
        subquestion_context.append(f"Q: {subquestion}\nA: {answer}")
    return "\n\n".join(subquestion_context)
```

#### Checkpoint 3/3

We're ready to put it all together now.

The `fusion_search` function should take in a query, generate a concatenated list of all subquestions and their answers using the function we just defined, and then pass everything to the model in a final RAG prompt.

First get the concatenated subqueries and assign them to `subquestion_context`.

Then, fill in the instructions in the final prompt. Tell the model that it was see a list of supporting Q&As in the `<SUBQUESTION_INFO>` section which it should use to inform its answer. Use your own words.

Be advised: this may take a while to successfully execute.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def fusion_search(query):
    print(f"Original query: {query}")
    subquestion_context = get_and_concat_subquestions(query)
    print("Subquestion context:", subquestion_context)
    final_prompt = f"""<INSTRUCTIONS>
Using the following information from subquestions, answer the original query.
</INSTRUCTIONS>

<SUBQUESTION_INFO>
{subquestion_context}
</SUBQUESTION_INFO>

<ORIGINAL_QUERY>{query}</ORIGINAL_QUERY>

Final Answer:"""

    final_answer = get_completion(final_prompt)
    return final_answer

user_query = "How should we approach learning, given what we know about the mind?"
result = fusion_search(user_query)

print("\nFinal Result:")
print(result)
```
