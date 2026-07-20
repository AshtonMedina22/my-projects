from rag_setup import collection, get_completion, make_rag_prompt


# Checkpoint 1
def get_previous_and_next_chunks(chunk_idx):
    previous_chunk = collection.get(where={"chunk_idx": {"$eq": chunk_idx - 1}})
    next_chunk = collection.get(where={"chunk_idx": {"$eq": chunk_idx + 1}})

    return previous_chunk, next_chunk


# Checkpoint 2
def expanded_search_results(original_chunk):
    original_chunk_idx = original_chunk["metadatas"][0]["chunk_idx"]
    previous_chunk, next_chunk = get_previous_and_next_chunks(original_chunk_idx)
    result_str = ""
    for chunk in [previous_chunk, original_chunk, next_chunk]:
        if len(chunk["metadatas"]) > 0:
            metadata = chunk["metadatas"][0]
            formatted_result = f"""<SEARCH RESULT>
            <DOCUMENT>{chunk["documents"][0]}</DOCUMENT>
            <METADATA>
            <TITLE>{metadata["title"]}</TITLE>
            <AUTHOR>{metadata["author"]}</AUTHOR>
            <CHUNK_IDX>{metadata["chunk_idx"]}</CHUNK_IDX>
            <URL>{metadata["source_url"]}</URL>
            </METADATA>
            </SEARCH RESULT>"""
            result_str += formatted_result
    return result_str


original_demo_chunk = collection.get(where={"chunk_idx": {"$eq": 151}})
expanded_results = expanded_search_results(original_demo_chunk)
print(expanded_results)


# Checkpoint 3
def make_decoupled_rag_prompt(query, n_results=1):
    search_results = collection.query(query_texts=[query], n_results=n_results)
    total_result_str = ""
    for doc, metadata in zip(search_results["documents"][0], search_results["metadatas"][0]):
        chunk = {
            "documents": [doc],
            "metadatas": [metadata],
        }
        expanded_result = expanded_search_results(chunk)
        total_result_str += expanded_result
    rag_prompt = make_rag_prompt(query, total_result_str)
    return rag_prompt


prompt = make_decoupled_rag_prompt("What is the best way to learn a complex, challenging subject?")
rag_completion = get_completion(prompt)
print(rag_completion)
