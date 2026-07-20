<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!
    
[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:
    
1. Add your solution to the cell with `## YOUR SOLUTION HERE ## `.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
4. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)

**Setup: The setup cell takes a couple of minutes to execute. You can run it before reading the narrative to save some time.**

We will start by reusing some code we went over in previous exercises: loading and splitting text data from files, storing the chunks in a Chroma collection with metadata, and setting up an OpenAI client. We then query the collection to retrieve the most relevant chunk for a given question.

For our example documents, we'll be using the Wikipedia pages for three sci-fi/AI films: *Her*, *2001*, and *WALL-E*.


```python
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openai import OpenAI


chroma_client = chromadb.Client()

collection = chroma_client.get_or_create_collection(name="prompt_practice")

text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n\n", "\n", ". ", "? ", "! "],  # List of characters to split on
    chunk_size=2000,  # The maximum size of your chunks
    chunk_overlap=400,  # The maximum overlap between chunks
)

texts = [
    {"file": "2001.txt", "url": "https://en.wikipedia.org/wiki/2001:_A_Space_Odyssey", "title": "2001: A Space Odyssey"},
    {"file": "Her.txt", "url": "https://en.wikipedia.org/wiki/Her_(film)", "title": "Her"},
    {"file": "WALLE.txt", "url": "https://en.wikipedia.org/wiki/WALL-E", "title": "WALL-E"}
]

for idx, text in enumerate(texts):
    with open(text["file"], "r") as f:
        content = f.read()
    text['chunks'] = text_splitter.create_documents([content])
    for chunk_idx, chunk in enumerate(text['chunks']):
        collection.add(
            documents=[chunk.page_content],
            ids=[f"{idx}-{chunk_idx}"],
            metadatas={"chunk_idx": chunk_idx, "url": text["url"], "title": text['title']}

        )


client = OpenAI()

collection.query(query_texts=["Who did Kubrick partner with in 2001?"], n_results=1)
```

Now that we're set up, we can get started prompting.

Let's first create an easy way to prompt the LLM (in this case, GPT-4).

We define the function `get_completion`, which sends a user prompt and a system prompt to the OpenAI API to generate a completion using the specified model. The `system_prompt` is set to define the assistant's role as a helpful RAG search assistant.


```python
def get_completion(user_prompt, system_prompt, model="gpt-4"):
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return completion.choices[0].message.content


system_prompt = "You are a helpful RAG search assistant who uses results from a search engine to answer user queries."
```

RAG (Retrieval-Augmented Generation) uses a vector database to retrieve text chunks relevant to a query, which are then inserted into a prompt. The prompt is fed to a language model that generates an informed answer by incorporating the retrieved information. Let's see how to assemble the prompts now.

#### Checkpoint 1/3

Complete the `make_rag_prompt` function to generate a RAG prompt based on a given query and search results. It takes the following parameters.
- `query`: The user's question or query.
- `result_str`: The search results obtained from a document search, to be used as context for answering the query.

Inside the function, return a prompt using an f-string that includes the following components:
- Instructions for the model. We've written this one for you as an example, but read it carefully as a guide for writing your own, similar prompts in the future.
- The user's question.
- The search results.

Your task below is to pass the variables corresponding to the user's query and the stringified search results from the vector database underneath the lines `User question:` and `Search Results:` respectively.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def make_rag_prompt(query, result_str):
  return f"""
Instructions:
Your task is to answer the following user question. The search results of a document search have been included to give you more context. Use the information in Search Results to help you answer the question accurately.
Not all information in the search results will be useful. However, if you find any information that's useful for answering the user's question, draw from it in your answer.

User question:
## YOUR SOLUTION HERE ##


Search Results:
## YOUR SOLUTION HERE ##


Your answer:
"""
```

#### Checkpoint 2/3

Now we'll take the RAG prompt our function outputs and build the rest of the RAG functionality around it in a new function.

Complete the `get_RAG_completion` function to retrieve relevant search results, format the RAG prompt, and generate a completion using the RAG prompt. It takes two parameters:

- `query`: The user's question or query.
- `n_results`: The number of search results to retrieve (default is 3).

Inside the function, perform the following steps:

- Query the Chroma collection to retrieve the relevant search results based on the user's query. Use the `collection.query` method with the appropriate parameters. Take a look at the example in the setup cell if you need to jog your memory. 

- Call the `make_rag_prompt` function, passing the user's query and the concatenated search results as arguments, to format the RAG prompt. It should be assigned to the `formatted_query` variable.

- Return the `get_completion` function, passing the formatted RAG prompt as the user prompt and use the existing `system_prompt` as the system prompt, to generate the final completion.


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def get_RAG_completion(query, n_results=3):
    ## YOUR SOLUTION HERE ##
    search_results =
    result_str = ""
    for result in search_results["documents"][0]:
        result_str += result
    ## YOUR SOLUTION HERE ##
    formatted_query =
    print("\n********This is the RAG prompt********\n")
    print(formatted_query)
    print("\n*********************************\\n")
    return

get_RAG_completion("What was the plot of Spike Jonze's 'Her'?")
```

#### Checkpoint 3/3

Now you'll practice tweaking the prompt to coax the model into citing the sources it uses in its answer.

Append the following text at the end of the "Instructions" section in the prompt:
`At the end of your answer, cite the URL of the search result your answer draws from. Use the following format:
<Your answer here>. Source: <URL of the search result your answer comes from here>`

At the bottom of the cell, we call the same query we used in the last checkpoint. Compare it to the existing example to see how well the model managed to cite its sources.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def make_cited_rag_prompt(query, result_str):
  return f"""
Instructions:
Your task is to answer the following user question. The search results of a document search have been included to give you more context. Use the information in Search Results to help you answer the question accurately.
Not all information in the search results will be useful. However, if you find any information that's useful for answering the user's question, draw from it in your answer.
## YOUR SOLUTION HERE ##

User question:
{query}

Search Results:
{result_str}

Your answer:
"""

def get_cited_RAG_completion(query, n_results=3):
    ## YOUR SOLUTION HERE ##
    search_results = collection.query(query_texts=[query], n_results=n_results)
    result_str = ""
    for result in search_results["documents"][0]:
        result_str += result
    ## YOUR SOLUTION HERE ##
    formatted_query = make_cited_rag_prompt(query, result_str)
    print("\n********This is the cited RAG prompt********\n")
    print(formatted_query)
    print("\n*********************************\\n")
    return get_completion(formatted_query, system_prompt)

get_cited_RAG_completion("What was the plot of Spike Jonze's 'Her'?")
```
