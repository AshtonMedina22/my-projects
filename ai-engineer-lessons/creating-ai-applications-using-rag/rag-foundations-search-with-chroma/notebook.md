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

Run the setup cell to import our vector database and instantiate our embedding model.


```python
import chromadb
embedding_function = chromadb.utils.embedding_functions.DefaultEmbeddingFunction()
```

**Embedding Strings**

Now that we've received an introduction to the relevant concepts, let's practice performing some similarity search of our own.

First, we instantiate the `all-MiniLM-L6-v2` embedding model from Sentence Transformers, which is included in the Chroma package by default. This pre-trained language model has 384 dimensions for each embedding, which means each piece of text will be represented by a 384-dimensional vector.

You can read more about this model here: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

Let's start by embedding a simple string of text using this model. Run the code cell below to see how to get the embedding for a string.


```python
embedding = embedding_function(["Welcome to this RAG course!"])
print(embedding[0][:5]) # we only print the first five values
```

    [0.011329571716487408, 0.052544090896844864, 0.07574588060379028, 0.0004700662975665182, -0.0421183742582798]


As we can see, `embedding_function` takes a list of strings and returns a list of embeddings. In the example cell, we only print the first five values of the embedding of "Welcome to this RAG course!" However, the full embedding is vector with 384 dimensions.

#### Checkpoint 1/3

Create an embedding for a custom text of your choice using the `embedding_function`. Replace the value of `text_to_embed` with your own text. Remember that the `embedding_function` accepts a single list as an argument.

After generating the embedding, you'll print its length to confirm that it has the expected 384 dimensions. The `embedding_function` will return a list. The embedding will be the first item in that list.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Embed a custom text
text_to_embed = "Replace this with your own text"

## YOUR SOLUTION HERE ##
# Generate embedding of your text
my_embedding =

# Print the length of the embedding to confirm it has 384 dimensions
## YOUR SOLUTION HERE ##
```

**Creating and Populating a Chroma Collection**

OK, we now know how to generate embeddings, which we can use to conduct similarity search.

Now, let's explore storing and searching embeddings with Chroma. We'll start by initializing a Chroma client, creating a collection, and adding sample data.

The Chroma client is the primary interface for interacting with the Chroma vector database. We'll use the client to create a *collection*, where we'll store our vectors. 

In the code cell below, we initialize a Chroma client, create a collection, and add two embeddings with their corresponding documents and ids.

Finally, we look at the first few rows of the new collection with the `.peek()` method.


```python
# Initialize the Chroma client
chroma_client = chromadb.Client()

# Create a new collection
collection = chroma_client.create_collection(name="my_test_collection")

my_docs = ["This is a document", "This is another document"]
embeddings = embedding_function(my_docs)

# Add some sample data to the collection
collection.add(
    embeddings=embeddings,
    documents=my_docs,
    ids=["id1", "id2"]
)

# Peek at the first few rows of the collection
collection.peek()
```

#### Checkpoint 2/3

Create a new collection using `chroma_client.create_collection` and give it a name of your choice. Save this in the given variable `my_collection`.

Next, generate embeddings for the three documents in the `docs` list using the `embedding_function`. Remember: the embeddings function accepts a list of strings and returns a list of embeddings.

Finally, pass the embeddings and docs to their corresponding parameters in `my_collection.add()` and use the `peek()` method to display the first few rows of your new collection.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
# Create a new collection
my_collection =

# Generate embeddings for the three documents
## YOUR SOLUTION HERE ##
docs = ["document one", "document two", "document three"]
embeddings = 

# Add the embeddings and documents to the collection
my_collection.add(
    ## YOUR SOLUTION HERE ##
    embeddings=,
    documents=,
    ids=["id1", "id2", "id3"]
)

# Peek at the first few rows of the new collection
## YOUR SOLUTION HERE ##
```

Note that there's an empty list for `metadatas` revealed when we `peek` at the collection. We'll introduce metadata and its filterin in a forthcoming exercise.

For now, let's find out how to search our collection for similar embeddings.

 **Semantic Search with Chroma**

Chroma supports several distance metrics for performing semantic search, including cosine similarity, L2 norm, and inner product. Let's create a collection that uses cosine similarity.


```python
# Create a new Chroma collection that uses cosine similarity
cosine_collection = chroma_client.get_or_create_collection(
        name="cosine_collection",
        metadata={"hnsw:space": "cosine"}
    )
```

In this code block, we create a new Chroma collection called `cosine_collection` using the `get_or_create_collection()` method of the Chroma client, passing a second named argument for metadata.

The `metadata` parameter accepts a dictionary that allows us to configure the behavior of the collection. In this case, we set the "hnsw:space" key to "cosine", which tells Chroma to use cosine similarity as the distance metric for the HNSW (Hierarchical Navigable Small World) index that powers the semantic search.

Now, let's add some sample documents to this collection. Notice that we don't have to generate the embeddings ourselves - Chroma will do that for us using the embedding model we set up earlier.

To show how similarity search works, we'll add to our new collection the following two statements:

- In this document, we'll talk about big cats: tigers, mountain lions, panthers, and other ferocious felines.
- In this document we'll discuss the solar system: moons, planets, and asteroids. We'll also talk about the sun and the stars.

In more naive forms of search, to retrieve either of these documents we'd likely need to include in our query words that are already in the document. Part of the magic of embedding-based semantic search is that we don't need to share words with the document in our query to retrieve it during a search.


```python
# Add two documents to the cosine_collection
cosine_collection.add(
    documents=["In this document, we'll talk all about big cats. Tigers, mountain lions, panthers, and other ferocious felines.",
               "In this document we'll discuss the solar system: moons, planets, and asteroids. We'll also talk about the sun and the stars."],
    ids=["id1", "id2"]
)

# Peek at the first few rows of the cosine_collection
cosine_collection.peek()
```

Now, let's perform a semantic search.

Queries are performed with the `.query()` method. We can pass multiple queries to the `query_texts` argument at once, though in this case we only pass one. The other argument, `n_results`, specifies how many documents are returned.

Notice how the query returns the relevant document, even though the words in the query don't appear in the document string.


```python
# Perform a semantic search on the cosine_collection
cosine_collection.query(query_texts=["I'm in the mood to read about wildlife, animals and nature."], n_results=1)
```

#### Checkpoint 3/3

Using the `.add()` method, add the following document strings to the `cosine_collection`.

- The internal combustion engine was a groundbreaking invention that paved the way for the modern automobile.
- The North Pole is among the coldest places on the planet, home to polar bears, seals, and penguins.

Give these documents the ids `"id3"` and `"id4"`, respectively.

Then, perform a query that returns the document with `"id3"` (the one about the internal combustion engine) without using any of the words in the document's string. Specify you want only one result returned from the query.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Add the new documents and IDs to the cosine_collection
cosine_collection.add(
  ## YOUR SOLUTION HERE ##
    documents=[],
    ids=[]
)

# Perform a semantic search to find a document about cars, without using any of the words in the original document
## YOUR SOLUTION HERE ##
cosine_collection.query()
```
