As we continue our journey into advanced RAG techniques, we now turn our attention to Contextual Query Retrieval (CQR). This powerful method builds upon the foundations we've established in our previous exercises, taking our retrieval process to the next level.

CQR enhances the "retrieval" part of the RAG process by incorporating the context of the conversation. Instead of treating each query in isolation, CQR considers the entire conversation history when fetching relevant information. This approach significantly improves the relevance and coherence of the retrieved data, leading to more accurate and contextually appropriate responses.

This technique can dramatically improve the quality of interactions in applications like chatbots and virtual assistants, where the context of the conversation evolves over time.

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

In the following cell, we set up a pre-existing Chroma database and initialize the OpenAI client. Execute the cell before moving on.


```python
from helpers import get_completion, client_chroma, collection, populate_rag_query, make_rag_prompt

```

### Chat Memory

Below you'll see a collection of fictional chat entries in which a user is conversing with a chatbot.

As their conversation continues, the user may naturally ask questions that don't stand alone as effective model prompts.

For instance, `contextual_query` depends entirely on the chat history to be understood. This situations commonly arise when developing RAG applications in the context of a customized chatbot.

In cases like this, we'll need to intercept the user's query before sending it to the vector database. We'll then send it to a language model to clarify its ambiguities.


```python
chat_memory = [
    {"role": "user", "content": "Tell me about the nature of consciousness."},
    {"role": "assistant", "content": "Consciousness is like a stream that flows from birth to death. It's a continuous process that we can only observe in the present moment. The content of consciousness includes our thoughts, feelings, and will - the processes of knowing, feeling, and choosing."},
    {"role": "user", "content": "That's interesting. How does attention relate to consciousness?"},
    {"role": "assistant", "content": "Attention is the concentration of consciousness on a particular object or thought. It's like a wave in the stream of consciousness, where the object of attention stands out more prominently. Attention allows us to focus our mental energy, making the object of focus clearer and more defined in our mind."},
    {"role": "user", "content": "I've heard attention is important for mental efficiency. Is that true?"},
    {"role": "assistant", "content": "Yes, attention is crucial for mental efficiency. It's like focusing sunlight through a lens - it concentrates mental energy, allowing us to accomplish more in less time. Strong attention skills can significantly enhance our ability to learn, solve problems, and be productive in our mental tasks."}
]

contextual_query = "How does it affect our ability to think and work effectively?"
```

#### Checkpoint 1/3

First, let's concatenate the chat history so that it can easily be injected into a preliminary LLM prompt.

We've intitialized the empty string variable `chat_history` and started a for loop.

Add the role and content from each list item to the `chat_history` string and print it to the console.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
chat_history = ""

for message in chat_memory:
    ## YOUR SOLUTION HERE ##
    role =
    content = 
    chat_history += f"{role}: {content}\n\n"

print("Chat History:")
print(chat_history)


```

#### Checkpoint 2/3

Now let's prompt the model to rewrite our query given its chat context.

Fill out the missing sections of the prompt so that the model knows it should rewrite the query in the context of what has come before it. 

In the instructions, specify that the model is expected to rewrite the query using the chat history, then pass the `chat_history` and `latest_query` variables in their proper XML sections.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def rewrite_query(query, chat_history):
    prompt = f"""<INSTRUCTIONS>
## YOUR SOLUTION HERE ##
</INSTRUCTIONS>

<CHAT_HISTORY>
{## YOUR SOLUTION HERE ##}
</CHAT_HISTORY>

<LATEST_QUERY>
{## YOUR SOLUTION HERE ##}
</LATEST_QUERY>

Your rewritten query:"""
    
    return get_completion(prompt)

cqr_query = rewrite_query(contextual_query, chat_history)
print("ORIGINAL QUERY:")
print(contextual_query)
print("CQR QUERY:")
print(cqr_query)
```

#### Checkpoint 3/3

Finally, define `perform_cqr_rag` such that the query is refined using the chat history, then that refined query is used to populate the search results using the existing helper function, converted to a RAG prompt and sent to the LLM API.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def perform_cqr_rag(query, chat_history, n_results=2):
    # Rewrite the query using the chat history
    ## YOUR SOLUTION HERE ##
    refined_query = 
    result_str = 
    rag_prompt = 
    rag_completion = 
    return refined_query, rag_completion

refined_query, rag_completion = perform_cqr_rag(contextual_query, chat_history)
print(rag_completion)
```
