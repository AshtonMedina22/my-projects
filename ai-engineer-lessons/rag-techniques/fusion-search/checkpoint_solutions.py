from helpers import get_completion, populate_rag_query, make_rag_prompt
import json


# Checkpoint 1
def generate_subquestions(query):
    prompt = f"""<INSTRUCTIONS>
Given the following user query, generate a list of 2-4 subquestions that would help in answering the original query. 
Return the result as JSON with the key "data" and the list as its value. 
Only output valid JSON and no other characters.
Do not output markdown backticks. Just output raw JSON only.
</INSTRUCTIONS>

<QUERY>{query}</QUERY>
"""
    response = get_completion(prompt)
#     if the model generates invalid json, uncomment the print line and inspect what went wrong
#     print(response)
    subquery_dict = json.loads(response)
    return subquery_dict["data"]


generate_subquestions("What should I eat for dinner tonight?")


# Checkpoint 2
def get_and_concat_subquestions(query):
    subquestions = generate_subquestions(query)
    subquestion_context = []
    for subquestion in subquestions:
        result_str = populate_rag_query(subquestion)
        rag_prompt = make_rag_prompt(subquestion, result_str)
        answer = get_completion(rag_prompt)
        subquestion_context.append(f"Q: {subquestion}\nA: {answer}")
    return "\n\n".join(subquestion_context)


# Checkpoint 3
def fusion_search(query):
    print(f"Original query: {query}")
    subquestion_context = get_and_concat_subquestions(query)
    print("Subquestion context:", subquestion_context)
    final_prompt = f"""<INSTRUCTIONS>
Use the supporting Q&A pairs in the <SUBQUESTION_INFO> section to answer the original query. Combine the subquestion answers into one complete response.
</INSTRUCTIONS>

<SUBQUESTION_INFO>
{subquestion_context}
</SUBQUESTION_INFO>

<ORIGINAL_QUERY>{query}</ORIGINAL_QUERY>

Final Answer:"""

    final_answer = get_completion(final_prompt)
    return final_answer


user_query = "How should we approach learning, given what we know about the mind?"
result = fusion_search(user_query)

print("\nFinal Result:")
print(result)
