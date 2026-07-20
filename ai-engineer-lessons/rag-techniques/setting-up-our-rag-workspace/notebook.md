Now that we've covered the basics of RAG and built an end-to-end real-life application, we are ready to move on to advanced techniques. As we have seen, RAG is a two-part process -- the first is the "retrieval" part which is responsible for fetching the relevant information from a large amount of text.  We achieved this by querying our ChromaDB.  The second is the "generation" part which generates a response based on the query and the retrieved information as input.  We achieved this by constructing a RAG prompt with the queried documents and sending this to an existing model using OpenAI's API.  


In this lesson, we'll explore a variety of more elaborate systems at the intersection of the vector database and the prompted LLM.

For our text data we will use the textbook *The Mind and Its Education* by George Herbert Betts, which is available on Project Gutenberg here: https://www.gutenberg.org/files/20220/20220-h/20220-h.htm

In this first exercise, we'll get a Chroma vector database and some helper functions intialized so we can rapidly tour a variety of RAG techniques throughout the lesson.

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

In the following cell, we import Chroma, Langchain, and OpenAI. We also define the metadata of the document we'll be using for RAG.


```python
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openai import OpenAI

book_metadata =  {
        "title": "The Mind and Its Education", 
        "author" : "George Herbert Betts",
        "source_url": "https://www.gutenberg.org/ebooks/20220",
        "filename": "themind.txt"
  }
```

#### Checkpoint 1/3

First, initialize the OpenAI client assigned to `client_openai` by calling `OpenAI()`.

Then, call the client's `.chat.completions.create()` method and pass it the following values:

- for `model`, pass `"gpt-4"`
- for `messages`, pass a list containing two dicts:
    - one dict with the `"role"` key `"system"` and the `"content"` key `"You are a helpful assistant connected to a database for document search."`
    - one dict with the `"role"` key `"user"` and the `"content"` key `prompt`

This `get_completion` helper function will make it easy for us to prompt the model throughout the lesson.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
client_openai = 

def get_completion(prompt):
    ## YOUR SOLUTION HERE ##
    response = (
        model=,
        messages=[
            {},
            {},
        ]
    )
    return response.choices[0].message.content

```

#### Chunking the Document

In the next cell, we'll initialize a recursive text splitter and create chunks of our text with it.

Be sure to execute this cell before moving onto the next checkpoint.


```python
text_splitter = RecursiveCharacterTextSplitter(
    separators=[". ", "? ", "! "],
    chunk_size=2000,
    chunk_overlap=300,
)
with open("themind.txt", "r") as file:
    content = file.read()
chunks = text_splitter.create_documents([content])


```

#### Checkpoint 2/3
Now we will create a new persistent Chroma collection.

Use Chroma's `.PersistentClient()` method to initialize a database that will persist throughout the lesson. Pass the method the desired route to our collection, `"./advanced"`.

Then use the Chroma client's `.get_or_create_collection()` method. Pass the method the `name` `"advanced"` and indicate we'll use cosine similarity with `metadata={"hnsw:space": "cosine"}`.

Fill in the missing sections of the cell.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
client_chroma = 
collection = 
```

#### Uploading the chunks

Now that our collection is initialized we can upload to it the chunks we made earlier.

We enumerate through the list of chunks, accessing the chunk's text in `chunk.page_content`, then add a chunk index to its metadata and upload the document, its id, and its metadata to our Chroma collection.

Be sure to execute this cell before moving on to the next one.


```python
for idx, chunk in enumerate(chunks):
    doc_text = chunk.page_content
    book_metadata["chunk_idx"] = idx
    collection.add(
        documents=[doc_text],
        ids=[f"{book_metadata['title']}_{idx}"],
        metadatas=[book_metadata]
    )
```

#### Formatting the search results
Now we'll define a helper function that takes a user query and returns a well-formatted, pseudo-XML string of the search results. This will make it easier to experiment throughout the lesson.

Don't forget to execute this cell before moving on.


```python
def populate_rag_query(query, n_results=1):
    search_results = collection.query(query_texts=[query], n_results=n_results)
    result_str = ""
    for idx, result in enumerate(search_results["documents"][0]):
        metadata = search_results["metadatas"][0][idx]
        formatted_result = f"""<SEARCH RESULT>
        <DOCUMENT>{result}</DOCUMENT>
        <METADATA>
        <TITLE>{metadata['title']}</TITLE>
        <AUTHOR>{metadata['author']}</AUTHOR>
        <CHUNK_IDX>{metadata['chunk_idx']}</CHUNK_IDX>
        <URL>{metadata['source_url']}</URL>
        </METADATA>
        </SEARCH RESULT>"""
        result_str += formatted_result
    return result_str
```

#### Checkpoint 3/3

Finally, create the RAG prompt to send to the LLM.

Write out the instructions to the model in your own words in the `<INSTRUCTIONS>` section.

Consider how you might guide the model to:
 - Use the search results effectively
 - Handle cases where information isn't available
 - Provide credibility to its answers by citing sources

Note we've included a  `<EXAMPLE CITATION>` that can show the model how its cited sources should look.

To wrap it up, pass the correct variables in the `<USER QUERY>` and `<SEARCH RESULTS>` sections to finish the function.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.



```python
def make_rag_prompt(query, results):
    return f"""<INSTRUCTIONS>
    ## YOUR SOLUTION HERE ##
   <EXAMPLE CITATION>
   Answer to the user query in your own words, drawn from the search results.
   - "Direct quote from source material backing up the claim" - [Source: Title, Author, Chunk: chunk index, Link: url]
   </EXAMPLE CITATION>
   </INSTRUCTIONS>

    <USER QUERY>
    </USER QUERY>

    <SEARCH RESULTS>
    </SEARCH RESULTS>
    
    Your answer:"""
```
