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

We'll start by loading in the text of the Wikipedia article on Llamas. Run the code cell below to import this file and assign it to the `content` variable.


```python
# Scraped from https://en.wikipedia.org/wiki/Llama
with open("Llama_Wikipedia_Cleaned.txt", "r") as file:
    content = file.read()
```

#### Checkpoint 1/3

Now we'll explore a few different strategies from chunking text, from the simplest to the most sophisticated.

Let's first explore how to split text without the use of a high-level library. Below, we've written a simple function `split_content_into_equal_length` that chunks out our document in the most naive way possible. It takes two parameters: `content` and `char_length`. `char_length` is the length of the each chunk in characters. `content` is the text that we want to split.

Using the function we defined, split the content into chunks of 300 characters each and return the first three chunks using the slice method.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def split_content_into_equal_length(content, char_length):
    return [content[i:i+char_length] for i in range(0, len(content), char_length)]

## YOUR SOLUTION HERE ##
split_content_into_equal_length(content, )[]
```

Read through the resulting chunks above. Can you identify the issues with this naive approach? How might these chunks be problematic for a language model trying to understand the content? Show the toggle below to see the answer.

<details>By cutting off each chunk after a certain number of characters, we often cut words up before they're finished. And nearly all the time, the word the chunk cuts on comes before the end of a sentence. This abrupt start and finish to the chunks provides incomplete information to the language model when performing RAG. We need to find a better way! </details>

While the naive approach is simple, it's clearly not ideal for natural language processing tasks. We could try splitting the text at sentence boundaries.

In the cell below, we split the chunks every time we encounter a period and a space (`". "`).


```python
def simple_sentence_splitter(text, chunk_size=5):
    # Split text based on a period followed by a space, which is a common end of sentence marker
    sentences = text.split('. ')
    chunks = []

    # Group sentences into chunks of 'chunk_size'
    for i in range(0, len(sentences), chunk_size):
        chunk = '. '.join(sentences[i:i+chunk_size]) + '.'
        chunks.append(chunk)

    return chunks

# Example usage with the 'content' variable
content_chunks = simple_sentence_splitter(content, 5)
print(content_chunks[:3])
```

This is an obvious improvement on the naive character splitting. However, it's got some obvious holes: what about question marks and other forms of sentence-ending punctuation, for instance?

We also have yet to implement overlapping chunks, while the complexity of our code keeps increasing. Wouldn't it be nice if we could use a library that did this easily, so that we could prototype RAG applications faster? This is where higher-level libraries like LangChain come in, providing advanced functionality out of the box.

LangChain is a framework for developing applications powered by language models. It provides a suite of tools for working with text, including advanced text splitters. You can find more information in the LangChain documentation: https://python.langchain.com/docs/modules/data_connection/document_transformers.

We'll use Langchain's `RecursiveCharacterTextSplitter` to chunk our document.

The `RecursiveCharacterTextSplitter` tries to split the text at the largest level first and progresses recursively through smaller and smaller splits. For instance, if it can break a document at the paragraph level, it will. If it doesn't find a break at its character limit at the paragraph level, it will resort to spllitting at the sentence level. It also supports creating overlapping chunks without any headaches.

Let's start by importing the `RecursiveCharacterTextSplitter` class from the `langchain.text_splitter module` as shown below.


```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
```

Next, we create an instance of the `RecursiveCharacterTextSplitter` class called `text_splitter`. We pass three arguments:

- `separators`: A list of strings that the splitter will use to split the text. The splitter will try to split on these in order, moving to the next one if the current one is not found. Here, it's set to `["\n\n", "\n", ". ", "? ", "! "]`
- `chunk_size`: The maximum size of each chunk, in characters. Here, it's set to 600.
- `chunk_overlap`: The number of characters of overlap between adjacent chunks. Here, it's set to 50.


```python
text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n\n", "\n", ". ", "? ", "! "],  # List of characters to split on
    chunk_size=600,  # The maximum size of your chunks
    chunk_overlap=50,  # The maximum overlap between chunks
)
```

We then use the `create_documents` method of our `text_splitter` instance to split the content string into chunks. This method takes a list of strings as input (in this case, a list with a single string, `content`), and returns a list of `Document` objects, each representing a chunk.

Let's save this result in the variable `langchain_chunks` as shown below.


```python
langchain_chunks = text_splitter.create_documents([content])
```

The result is a list of `document` objects each representing a chunk, we can look at each chunk using the index.


```python
langchain_chunks[:1]
```

#### Checkpoint 2/3

Create an instance of the `RecursiveCharacterTextSplitter` class called `text_splitter` and use only two parameters: `chunk_size` and `chunk_overlap`. Set `chunk_size` to 1500 and set `chunk_overlap` to 300. Use the `create_documents` method to split `content` into chunks. Save this result in the variable `langchain_chunks` and print the first `document` object of the `langchain_chunks`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
# Create a text splitter
text_splitter = 

## YOUR SOLUTION HERE ##
# Split the 'content' into chunks
langchain_chunks = 

## YOUR SOLUTION HERE ##
# Print the first document
langchain_chunks[:1]
```

#### Checkpoint 3/3

Next, you'll review what we covered last time and start up a new Chroma collection after instantiating the client. Name the collection `llama_chunks`.

Then you'll loop through the `langchain_chunks` and upload each one to Chroma.

You can ensure each id is unique by making its id some variation of the `index`. Access the text from the `Document` object and pass it to `documents`.

You'll notice we've got a third argument we're passing this time, `metadatas`. Chroma allows you to attach metadata about each chunk when you add it. In this case, we'll add the chunk's `index` and a URL to the llama Wikipedia page it comes from.

Finally, pass to `.query()` a question about llamas and see what you find out!

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import chromadb


## YOUR SOLUTION HERE ##
# Instantiate a Chroma client
chroma_client = 

## YOUR SOLUTION HERE ##
# Create a new collection named "llama_chunks"
collection = 

# Iterate over the langchain_chunks using a for loop and enumerate
for index, chunk in enumerate(langchain_chunks):
    # Add a new document to the collection
    collection.add(
        ## YOUR SOLUTION HERE ##
        ids=,  
        documents=,  
        metadatas=[{"source": "https://en.wikipedia.org/wiki/Llama",
                    "chunk_index": index}] 
    )

## YOUR SOLUTION HERE ##
results = collection.query()

print(results)
```
