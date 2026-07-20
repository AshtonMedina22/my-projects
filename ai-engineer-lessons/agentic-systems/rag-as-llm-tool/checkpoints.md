# RAG As LLM Tool Checkpoints

## `tools/search_help_center.py`

```python
import json

def search_help_center(query):
    """
    Search the company help center for FAQs.
    """
    with open("data/help_center_faq.json", "r") as f:
        faq_data = json.load(f)
    
    if query in faq_data:
        return faq_data[query]
    else:
        return f"Sorry, I don't have information about '{query}' in our help center yet. Please contact support for assistance."

# Tool definition with explicit FAQ topics listed
retrieval_tool_definition = {
    "type": "function",
    "function": {
        "name": "search_help_center",
        "description": "Search the company help center FAQ for customer service questions. Use this function when the user asks about one of these supported topics: refund policy, shipping time, reset password, cancel subscription, track order, contact support, product warranty, or size guide. Call the function by passing the best matching search keyword exactly as a string in the query argument. If the user's question is not represented by one of these FAQ keywords, do not call this function; answer that the information is not available in the help center and suggest contacting support.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search terms related to one of the available topics",
                    "enum": [
                        "refund policy",
                        "shipping time", 
                        "reset password",
                        "cancel subscription",
                        "track order",
                        "contact support",
                        "product warranty",
                        "size guide"
                    ]
                }
            },
            "required": ["query"]
        }
    }
}
```

## `tools/handler.py`

```python
"""
Tool handler for the Streamlit LLM chat application.

To add a new tool:
1. Create a new Python file in the tools directory with your function
2. Define the function and its tool_definition dictionary (following OpenAI's schema)
3. Import the function and tool_definition in this file
4. Add the function to FUNCTION_REGISTRY
5. Add the tool_definition to TOOLS list
"""

import json
from .roll_dice import roll_dice, dice_tool_definition
from .search_help_center import search_help_center, retrieval_tool_definition

# Function registry - add new functions here
FUNCTION_REGISTRY = {
    "roll_dice": roll_dice,
    "search_help_center": search_help_center
}

# Tool definitions - add new tool definitions here
TOOLS = [
    dice_tool_definition,
    retrieval_tool_definition
]


def process_tool_calls(response):
    
    """
    Extract function call details from the API response.
    """
    message = response.choices[0].message
    
    if not hasattr(message, "tool_calls") or not message.tool_calls:
        return None
    
    # Get the first tool call
    tool_call = message.tool_calls[0]
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)
    return {
        "id": tool_call.id,
        "function_name": function_name,
        "function_args": function_args
    }


def execute_function(function_name, function_args):
    """
    Execute a function from the registry with the given arguments.
    """
    if function_name in FUNCTION_REGISTRY:
        return FUNCTION_REGISTRY[function_name](**function_args)
    else:
        return {"error": f"Unknown function: {function_name}"}


def get_completion_with_tools(client, messages):
    """
    Get a completion from the model, handling tool calls if necessary.
    
    Args:
        client: OpenAI client instance
        messages: List of message dictionaries with role and content
        
    Returns:
        tuple: (response_content, updated_messages)
    """
    # Step 1: Initial request with tools
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=messages,
        tools=TOOLS
    )
    
    # Step 2: Check for function calls
    tool_call = process_tool_calls(response)
    tool_call_info = None
    if not tool_call:
        # No tool call, return regular response
        return response.choices[0].message.content, messages + [{"role": "assistant", "content": response.choices[0].message.content}], tool_call_info
    
    # Step 3: Execute function
    function_name = tool_call["function_name"]
    function_args = tool_call["function_args"]
    result = execute_function(function_name, function_args)
    tool_call_info = {
        "id": tool_call["id"],
        "function_name": function_name,
        "function_args": function_args,
        "result": result
    }
    
    # Step 4: Build updated messages with tool call and result
    updated_messages = messages.copy()
    
    # Add the assistant's message with tool call
    assistant_message = response.choices[0].message
    updated_messages.append({
        "role": "assistant",
        "content": assistant_message.content,
        "tool_calls": [{
            "id": tool_call["id"],
            "type": "function",
            "function": {
                "name": function_name,
                "arguments": json.dumps(function_args)
            }
        }]
    })
    
    # Add the tool result
    updated_messages.append({
        "role": "tool",
        "tool_call_id": tool_call["id"],
        "content": json.dumps(result)
    })
    
    # Step 5: Get final response
    final_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=updated_messages
    )
    
    final_content = final_response.choices[0].message.content
    updated_messages.append({"role": "assistant", "content": final_content})
    
    return final_content, updated_messages, tool_call_info
```

## `main.py`

```python
from openai import OpenAI
import streamlit as st
from tools.handler import get_completion_with_tools
import json

st.title("Retrieval Chat")

# Initialize client - the API key and base URL are automatically configured
client = OpenAI()

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Handle user input
if prompt := st.chat_input("Ask me something about customer service."):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Display assistant response
    with st.chat_message("assistant"):
        try:
            # Get completion with tool support
            assistant_reply, updated_messages, tool_call_info = get_completion_with_tools(
                client=client,
                messages=st.session_state.messages
            )
            if tool_call_info:
                st.info(f"Tool Executed: `{tool_call_info['function_name']}`")
                st.write("Input:")
                st.json(tool_call_info["function_args"])
                st.write("Output:")
                st.json(tool_call_info["result"])
                
            # Display the reply
            st.markdown(assistant_reply)
            
            # Update chat history with the complete interaction
            # (This includes tool calls if any were made)
            st.session_state.messages = updated_messages
            
        except Exception as e:
            st.error(f"Error: {str(e)}")
            # Try to provide more details about the error
            if hasattr(e, 'response'):
                st.write("Response details:", e.response)
```
