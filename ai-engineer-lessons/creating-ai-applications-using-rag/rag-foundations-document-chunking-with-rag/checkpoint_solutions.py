import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter


# Setup from lesson
with open("Llama_Wikipedia_Cleaned.txt", "r") as file:
    content = file.read()


# Checkpoint 1
def split_content_into_equal_length(content, char_length):
    return [content[i:i + char_length] for i in range(0, len(content), char_length)]


split_content_into_equal_length(content, 300)[:3]


# Checkpoint 2
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1500,
    chunk_overlap=300
)

langchain_chunks = text_splitter.create_documents([content])

print(langchain_chunks[0])


# Checkpoint 3
chroma_client = chromadb.Client()

collection = chroma_client.create_collection(name="llama_chunks")

for index, chunk in enumerate(langchain_chunks):
    collection.add(
        ids=[f"chunk_{index}"],
        documents=[chunk.page_content],
        metadatas=[{
            "source": "https://en.wikipedia.org/wiki/Llama",
            "chunk_index": index
        }]
    )

results = collection.query(
    query_texts=["What are llamas used for?"],
    n_results=1
)

print(results)

