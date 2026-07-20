from helpers import get_completion, client_chroma, collection, populate_rag_query, make_rag_prompt


chat_memory = [
    {"role": "user", "content": "Tell me about the nature of consciousness."},
    {"role": "assistant", "content": "Consciousness is like a stream that flows from birth to death. It's a continuous process that we can only observe in the present moment. The content of consciousness includes our thoughts, feelings, and will - the processes of knowing, feeling, and choosing."},
    {"role": "user", "content": "That's interesting. How does attention relate to consciousness?"},
    {"role": "assistant", "content": "Attention is the concentration of consciousness on a particular object or thought. It's like a wave in the stream of consciousness, where the object of attention stands out more prominently. Attention allows us to focus our mental energy, making the object of focus clearer and more defined in our mind."},
    {"role": "user", "content": "I've heard attention is important for mental efficiency. Is that true?"},
    {"role": "assistant", "content": "Yes, attention is crucial for mental efficiency. It's like focusing sunlight through a lens - it concentrates mental energy, allowing us to accomplish more in less time. Strong attention skills can significantly enhance our ability to learn, solve problems, and be productive in our mental tasks."},
]

contextual_query = "How does it affect our ability to think and work effectively?"


# Checkpoint 1
chat_history = ""

for message in chat_memory:
    role = message["role"]
    content = message["content"]
    chat_history += f"{role}: {content}\n\n"

print("Chat History:")
print(chat_history)


# Checkpoint 2
def rewrite_query(query, chat_history):
    prompt = f"""<INSTRUCTIONS>
Rewrite the latest user query so it can stand alone as a clear search query. Use the chat history to resolve any unclear pronouns or missing context.
</INSTRUCTIONS>

<CHAT_HISTORY>
{chat_history}
</CHAT_HISTORY>

<LATEST_QUERY>
{query}
</LATEST_QUERY>

Your rewritten query:"""

    return get_completion(prompt)


cqr_query = rewrite_query(contextual_query, chat_history)
print("ORIGINAL QUERY:")
print(contextual_query)
print("CQR QUERY:")
print(cqr_query)


# Checkpoint 3
def perform_cqr_rag(query, chat_history, n_results=2):
    # Rewrite the query using the chat history
    refined_query = rewrite_query(query, chat_history)
    result_str = populate_rag_query(refined_query, n_results)
    rag_prompt = make_rag_prompt(refined_query, result_str)
    rag_completion = get_completion(rag_prompt)
    return refined_query, rag_completion


refined_query, rag_completion = perform_cqr_rag(contextual_query, chat_history)
print(rag_completion)
