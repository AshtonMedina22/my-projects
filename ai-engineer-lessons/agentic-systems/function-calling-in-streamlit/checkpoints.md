# Function Calling In Streamlit Checkpoints

## `tools/handler.py`

```python
import json
from tools.roll_dice import roll_dice, dice_tool_definition

# Function registry - add new functions here
FUNCTION_REGISTRY = {
    "roll_dice": roll_dice
}

# Tool definitions - add new tool definitions here
TOOLS = [
    dice_tool_definition
]
```

Inside `get_completion_with_tools()`:

```python
response = client.chat.completions.create(
    model="gpt-4.1",
    messages=messages,
    tools=TOOLS
)
```

```python
tool_call = process_tool_calls(response)
```

```python
result = execute_function(function_name, function_args)
```

## `main.py`

Initialize tool call storage:

```python
if "tool_calls" not in st.session_state:
    st.session_state.tool_calls = {}
```

Look up tool call info while rendering history:

```python
tool_call_info = st.session_state.tool_calls[i]
```

Call the handler with keyword arguments:

```python
assistant_reply, updated_messages, tool_call_info = get_completion_with_tools(
    client=client,
    messages=st.session_state.messages
)
```

## Full `main.py`

```python
from openai import OpenAI
import streamlit as st
from tools.handler import get_completion_with_tools
import json

st.title("Function Calling Chat")

# Initialize client - the API key and base URL are automatically configured
client = OpenAI()

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Initialize tool call storage separately
if "tool_calls" not in st.session_state:
    st.session_state.tool_calls = {}

# Display chat history
for i, message in enumerate(st.session_state.messages):
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        
        # Check if there's tool info for this message index
        if i in st.session_state.tool_calls:
            tool_call_info = st.session_state.tool_calls[i]
            st.info(f"Tool Executed: `{tool_call_info['function_name']}`")
            st.write("Input:")
            st.json(tool_call_info["function_args"])
            st.write("Output:")
            st.json(tool_call_info["result"])

# Handle user input
if prompt := st.chat_input("Ask to roll a dice?"):
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
            
            # If there was a tool call, store it separately indexed by message position
            if tool_call_info:
                # Find the assistant message that corresponds to this tool call
                # It should be the last assistant message in updated_messages
                for idx in range(len(st.session_state.messages) - 1, -1, -1):
                    if st.session_state.messages[idx]["role"] == "assistant":
                        st.session_state.tool_calls[idx] = tool_call_info
                        break
            
        except Exception as e:
            st.error(f"Error: {str(e)}")
            # Try to provide more details about the error
            if hasattr(e, 'response'):
                st.write("Response details:", e.response)
```
