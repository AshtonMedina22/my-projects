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

Run the setup cell to import Chroma and Langchain's `RecursiveCharacterTextSplitter`.  The variable `files` gives us some details about the two files we will upload.


```python
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter

files = [
    {
        "title": "Anthropology of Food",
        "source_url": "https://openstax.org/details/books/introduction-anthropology",
        "filename": "anthro_food.txt"
  },
  {
        "title": "Anthropology of Art, Music, and Sport",
        "source_url": "https://openstax.org/details/books/introduction-anthropology",
        "filename": "anthro_art.txt"
  }
]

```

#### Checkpoint 1/4

We've initialized a Chroma client using `chromadb.PersistentClient("./")` to persist the Chroma vector database. Now, create a collection with the variable name `collection` by using the Chroma client's `get_or_create_collection()` method with the following specifications: 
- Set the `name` argument to a new collection named `"RAG_Assistant"`. 
- Set metadata parameter to specify cosine similarity as the distance metric for the HNSW index.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
# Instantiate a Chroma persistent client
client = chromadb.PersistentClient("./")


## YOUR SOLUTION HERE ##


```

#### Checkpoint 2/4
Next, we will create a text splitter instance using the `RecursiveCharacterTextSplitter()` class in LangChain. Define the instance as `text_splitter` with the following arguments: 
- `separators` set to `["\n\n", "\n", ". ", "? ", "! "]`
- `chunk_size` set to `1500`, 
- `chunk_overlap`set to`200`.  

Once your text splitter is correctly defined, it will use the file in files, `anthro_food.txt`, as the content and create a list of document chunks.  The first document will be print to verify your code worked correctly.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
#Read first file content
with open(f"./{files[0]['filename']}", "r") as file:
  content = file.read()


# Create a text splitter
## YOUR SOLUTION HERE ##




# Split the 'content' into chunks
chunks = text_splitter.create_documents([content])

# Print the first document
chunks[:1]
```

#### Checkpoint 3/4

Now, you'll loop through each file, create chunks from the text splitter, and upload each to Chroma. Three empty lists are instantiated, which hold information about each document:
- `documents` and `ids` are lists of strings holding the text and a unique identifier.  
- `metadata` is a list of dictionaries which can hold metadata about each document, like the title, chunk index, and source URL.  

We've already written the loop for this that appends the retrieved metadata and indices. Use the `page_content` attribute to append to `documents` within the loop.

 
**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
#Create empty lists to store each document, metadata, and id
documents = []
metadatas = []
ids = []

#Loop through each file in files
for file_info in files:
    with open(f"./{file_info['filename']}", "r") as file:
        content = file.read()
        #Use text_splitter to create documents
        chunks = text_splitter.create_documents([content])
        #iterate over every chunk
        for index, chunk in enumerate(chunks):
            #Append to metadata list with "title", "source_url", and "index"
            metadatas.append({
                "title": file_info["title"],
                "source_url": file_info["source_url"],
                "chunk_idx": index
            })
            #Append to ids each index
            ids.append(f"{file_info['filename']}_{index}")
            
            #Append to documents each chunk.page_content
            ### YOUR SOLUTION HERE ###
            
        
            
```

#### Checkpoint 4/4

Finally, pass to `.query()` a question about art or food in anthropology to verify that the database successfully accepted the chunks. 
 
**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
#Add all documents to the collection
collection.add(documents=documents, metadatas=metadatas, ids=ids)

#Verify documents were added to collection with a sample query
### YOUR SOLUTION HERE ###


```

<details><summary style="display:list-item; font-size:16px; color:blue;"> Notice anything interesting? </summary>

Notice that the results are returned as a dictionary and the cosine similarities for each result is also returned with the key `distances`.
Consider experimenting with different queries and parameters and notice the change in your results. For example, how close (or far) are your results for unrelated queries?

Great job, we've solidified our knowledge by creating a persistent Chroma database, added documents, and queried the results -- we are ready to integrate these results within our Streamlit app!


```python

```
