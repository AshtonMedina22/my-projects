from helpers import get_completion, populate_rag_query, make_rag_prompt, client_chroma, collection


# Checkpoint 1
def make_hyde_prompt(query):
    return f"""<INSTRUCTIONS>
Write a plausible paragraph-long answer to the query. Use language and terminology that would likely appear in the real source text, even if you are not certain of the answer.
</INSTRUCTIONS>

<QUERY>{query}</QUERY>
"""


# Checkpoint 2
query = "How do we know what the mind is?"

hyde_query_prompt = make_hyde_prompt(query)
hyde_query = get_completion(hyde_query_prompt)

print(hyde_query)

results = collection.query(
    query_texts=[hyde_query],
    n_results=3
)
print(results)


# Checkpoint 3
def answer_query_with_hyde(user_query):
    hyde_prompt = make_hyde_prompt(user_query)
    hyde_query = get_completion(hyde_prompt)
    result_str = populate_rag_query(hyde_query, n_results=3)
    rag_prompt = make_rag_prompt(user_query, result_str)
    rag_completion = get_completion(rag_prompt)

    return rag_completion


user_query = "How do we know what the mind is?"
answer = answer_query_with_hyde(user_query)
print(answer)
