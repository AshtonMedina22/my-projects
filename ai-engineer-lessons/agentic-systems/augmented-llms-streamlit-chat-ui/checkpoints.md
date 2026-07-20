# Streamlit Chat UI Checkpoints

Paste this full block into `main.py`.

```python
from openai import OpenAI
import streamlit as st

st.title("Streamlit Chat UI Demo")

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
if prompt := st.chat_input("What's up?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Display assistant response
    with st.chat_message("assistant"):
        try:
            # Create chat completion
            response = client.chat.completions.create(
                model="gpt-4.1",
                messages=st.session_state.messages
            )
            
            # Extract the assistant's reply
            assistant_reply = response.choices[0].message.content
            
            # Display the reply
            st.markdown(assistant_reply)
            
            # Add to chat history
            st.session_state.messages.append(
                {"role": "assistant", "content": assistant_reply}
            )
            
        except Exception as e:
            st.error(f"Error: {str(e)}")
            # Try to provide more details about the error
            if hasattr(e, 'response'):
                st.write("Response details:", e.response)
```
