As we saw in the video, decoupling refers to the separation of the query embedding from the returned search results.

This way, the two parts can be optimized separately.  This can lead to improved performance because the retrieval model can focus solely on finding the most relevant information, while the generation model can concentrate on generating high-quality responses based on the retrieved data. 

There are many ways to decouple the query from the results returned, but we will start by improving our retrieval process.  Instead of including just the most relevant chunk, we'll include the previous and following chunks. 

This approach forces the model to see more context than it found in the retrieved chunk alone and can improve the final generated response.

It's a little like the overlapping chunks technique we discussed earlier. By forcing the model to see more context, we can pick up on important knowledge that might not be included in the retrieved chunk.

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

In the following cell, we import the helper functions we wrote in the last exercise.


```python
from helpers import (
    client_openai,
    get_completion,
    client_chroma,
    collection,
    make_rag_prompt
)
```

As we mentioned earlier, we'll decouple our RAG search by adding the preceding and succeeding chunk for each retrieved result when it's completion time.

To accomplish this, we'll use Chroma's `.get()` method.  

The `.get()` method is used to retrieve information from a collection -- this could include getting values associated with specific ids or based on certain criteria. 

For example, to retrieve the information for chunk 151, which was assigned the unique id `The Mind and Its Education_151`, we'd call `collection.get('The Mind and Its Education_151')`.

Check out the Chroma docs for more information: https://docs.trychroma.com/reference/py-collection#get


```python
# To retrieve an entry by id, pass the id to get()
collection.get('The Mind and Its Education_151')
```

You can also use `where` clauses within the `.get()` query to filter on different metadata. Note the query syntax.


```python
# To retrieve an entry by a field value, pass the field name and value to get() like so
collection.get(where={"chunk_idx": { "$eq": 151}})
```

One thing to keep in mind in our implementation, when an `id` is not found in the collection, a dictionary is still returned.  For example, `collection.get(where={"chunk_idx": {"$eq": 999999999}})` returns the dictionary:

```
{'ids': [],
 'embeddings': None,
 'metadatas': [],
 'documents': [],
 'uris': None,
 'data': None}
 ```

 You may want to check for a length greater than zero if your production code depends on these results being populated.

#### Checkpoint 1/3

Define a function `get_next_and_previous_chunks`, which takes in the chunk index (`chunk_idx`) of the retrieved search result and returns the preceding and succeeding chunks.

Use the `.get()` method, passing in the `"chunk_idx"` to the `where` argument. The previous chunk should be one less than the current chunk's index, and the succeeding chunk should be one more.

*Note: You could also use the `.get()` method with a list of IDs, given that our ID scheme is `f"{document_title}_{chunk_idx}`". This is a totally valid approach and would likely be slightly faster! However, we want to give you some practice filtering metadata with `where=`, especially since you might use some other ID technique in your own database.*


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def get_previous_and_next_chunks(chunk_idx):
    ## YOUR SOLUTION HERE ##
    previous_chunk = 
    next_chunk = 
    
    return previous_chunk, next_chunk
```

#### Checkpoint 2/3
Next, let's define a function that accepts the original chunk and returns a formatted string of search results for the preceding, current, and succeeding chunk.

Remember that the `original_chunk` is a dictionary with the following shape:

```python
{'ids': ["The Mind and Its Education_1"],
 'embeddings': [0.234234],
 'metadatas': [{"chunk_idx": 1, "title": "title here", "author": "author here", "source_url": "url here"}],
 'documents': ["chunk text here"],
}
```
Inside the function body, first extract the chunk index of the original chunk. Then call `get_previous_and_next_chunks` and assign the results to the variables listed. Finally, pass in the appropriate values inside the f-string in the specified XML areas.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def expanded_search_results(original_chunk):
    ## YOUR SOLUTION HERE ##
    original_chunk_idx = 
    previous_chunk, next_chunk =
    result_str = ""
    for chunk in [previous_chunk, original_chunk, next_chunk]:
        if len(chunk["metadatas"])>0:
            metadata = chunk["metadatas"][0]
            ## YOUR SOLUTION HERE ##
            formatted_result = f"""<SEARCH RESULT>
            <DOCUMENT></DOCUMENT>
            <METADATA>
            <TITLE></TITLE>
            <AUTHOR></AUTHOR>
            <CHUNK_IDX></CHUNK_IDX>
            <URL></URL>
            </METADATA>
            </SEARCH RESULT>"""
            result_str += formatted_result
    return result_str

original_demo_chunk = collection.get(where={"chunk_idx": {"$eq": 151}})
expanded_results = expanded_search_results(original_demo_chunk)
print(expanded_results)
```

Look through the total output of the formatted string above to confirm you've attached the previous and next chunks to the search results.

#### Checkpoint 3/3

Now let's fit it all together with our existing helper functions.

First, get the original search results from the query and assign them to `search_results`. Then obtain the expanded result from `expanded_search_results` and add it to the `total_result_str` string. Finally, pass the query and result string to `make_rag_prompt` and assign it to `rag_prompt`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def make_decoupled_rag_prompt(query, n_results=1):
    ## YOUR SOLUTION HERE ##
    search_results = 
    total_result_str = ""
    for doc, metadata in zip(search_results['documents'][0], search_results['metadatas'][0]):
        chunk = {
            'documents': [doc],
            'metadatas': [metadata]
        }
        ## YOUR SOLUTION HERE ##
        expanded_result = 
        total_result_str 
        rag_prompt = 
    return rag_prompt

# given a search result, we can get everything back in a formatted string
prompt = make_decoupled_rag_prompt("What is the best way to learn a complex, challenging subject?")
rag_completion = get_completion(prompt)
print(rag_completion)
```
