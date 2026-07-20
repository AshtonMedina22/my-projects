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
