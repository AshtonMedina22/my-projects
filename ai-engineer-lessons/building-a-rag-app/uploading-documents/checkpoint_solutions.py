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


# Checkpoint 1
client = chromadb.PersistentClient("./")

collection = client.get_or_create_collection(
    name="RAG_Assistant",
    metadata={"hnsw:space": "cosine"}
)


# Checkpoint 2
with open(f"./{files[0]['filename']}", "r") as file:
    content = file.read()

text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n\n", "\n", ". ", "? ", "! "],
    chunk_size=1500,
    chunk_overlap=200
)

chunks = text_splitter.create_documents([content])

chunks[:1]


# Checkpoint 3
documents = []
metadatas = []
ids = []

for file_info in files:
    with open(f"./{file_info['filename']}", "r") as file:
        content = file.read()
        chunks = text_splitter.create_documents([content])
        for index, chunk in enumerate(chunks):
            metadatas.append({
                "title": file_info["title"],
                "source_url": file_info["source_url"],
                "chunk_idx": index
            })
            ids.append(f"{file_info['filename']}_{index}")
            documents.append(chunk.page_content)


# Checkpoint 4
collection.add(documents=documents, metadatas=metadatas, ids=ids)

collection.query(
    query_texts=["What role does food play in anthropology?"],
    n_results=3
)

