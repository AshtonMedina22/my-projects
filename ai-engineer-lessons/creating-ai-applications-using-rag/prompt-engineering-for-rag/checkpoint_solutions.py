def make_rag_prompt(query, result_str):
    return f"""
Instructions:
Your task is to answer the following user question. The search results of a document search have been included to give you more context. Use the information in Search Results to help you answer the question accurately.
Not all information in the search results will be useful. However, if you find any information that's useful for answering the user's question, draw from it in your answer.

User question:
{query}

Search Results:
{result_str}

Your answer:
"""


def get_RAG_completion(query, n_results=3):
    search_results = collection.query(query_texts=[query], n_results=n_results)
    result_str = ""
    for result in search_results["documents"][0]:
        result_str += result
    formatted_query = make_rag_prompt(query, result_str)
    print("\n********This is the RAG prompt********\n")
    print(formatted_query)
    print("\n*********************************\\n")
    return get_completion(formatted_query, system_prompt)


get_RAG_completion("What was the plot of Spike Jonze's 'Her'?")


def make_cited_rag_prompt(query, result_str):
    return f"""
Instructions:
Your task is to answer the following user question. The search results of a document search have been included to give you more context. Use the information in Search Results to help you answer the question accurately.
Not all information in the search results will be useful. However, if you find any information that's useful for answering the user's question, draw from it in your answer.
At the end of your answer, cite the URL of the search result your answer draws from. Use the following format:
<Your answer here>. Source: <URL of the search result your answer comes from here>

User question:
{query}

Search Results:
{result_str}

Your answer:
"""


def get_cited_RAG_completion(query, n_results=3):
    search_results = collection.query(query_texts=[query], n_results=n_results)
    result_str = ""
    for result in search_results["documents"][0]:
        result_str += result
    formatted_query = make_cited_rag_prompt(query, result_str)
    print("\n********This is the cited RAG prompt********\n")
    print(formatted_query)
    print("\n*********************************\\n")
    return get_completion(formatted_query, system_prompt)


get_cited_RAG_completion("What was the plot of Spike Jonze's 'Her'?")

