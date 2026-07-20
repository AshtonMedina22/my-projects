import chromadb

embedding_function = chromadb.utils.embedding_functions.DefaultEmbeddingFunction()


# Checkpoint 1
text_to_embed = "Retrieval augmented generation helps AI answer questions using relevant source documents."

my_embedding = embedding_function([text_to_embed])

print(len(my_embedding[0]))


# Checkpoint 2
chroma_client = chromadb.Client()

my_collection = chroma_client.create_collection(name="rag_foundations_collection")

docs = ["document one", "document two", "document three"]
embeddings = embedding_function(docs)

my_collection.add(
    embeddings=embeddings,
    documents=docs,
    ids=["id1", "id2", "id3"]
)

my_collection.peek()


# Checkpoint 3 setup from lesson
cosine_collection = chroma_client.get_or_create_collection(
    name="cosine_collection",
    metadata={"hnsw:space": "cosine"}
)

cosine_collection.add(
    documents=[
        "In this document, we'll talk all about big cats. Tigers, mountain lions, panthers, and other ferocious felines.",
        "In this document we'll discuss the solar system: moons, planets, and asteroids. We'll also talk about the sun and the stars."
    ],
    ids=["id1", "id2"]
)

# Checkpoint 3 answer
cosine_collection.add(
    documents=[
        "The internal combustion engine was a groundbreaking invention that paved the way for the modern automobile.",
        "The North Pole is among the coldest places on the planet, home to polar bears, seals, and penguins."
    ],
    ids=["id3", "id4"]
)

cosine_collection.query(
    query_texts=["I want to learn about how powered machines changed personal transportation."],
    n_results=1
)

