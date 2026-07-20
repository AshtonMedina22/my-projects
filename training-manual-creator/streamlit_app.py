import json
import os

import streamlit as st
from openai import OpenAI

from tools.handler import get_completion_with_tools, get_demo_completion_with_tools


st.set_page_config(
    page_title="Training Manual Creator",
    page_icon="T",
    layout="wide",
)


def build_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


def render_tool_call(tool_call_info):
    with st.expander(f"Tool executed: {tool_call_info['function_name']}", expanded=True):
        col1, col2 = st.columns(2)
        with col1:
            st.caption("Input")
            st.json(tool_call_info["function_args"])
        with col2:
            st.caption("Output")
            st.json(tool_call_info["result"])


client = build_client()

st.title("Training Manual Creator")
st.write(
    "An augmented LLM app that can read, write, revise, delete, and enrich employee handbook sections "
    "through local tools."
)

with st.sidebar:
    st.header("Available Tools")
    st.write("read_section")
    st.write("write_section")
    st.write("delete_section")
    st.write("lookup_contact")
    st.divider()
    if client:
        st.success("OpenAI API key detected.")
    else:
        st.warning("Demo mode: set OPENAI_API_KEY to enable live LLM tool calling.")
    if st.button("Reset chat"):
        st.session_state.messages = []
        st.session_state.tool_calls = {}
        st.rerun()

if "messages" not in st.session_state:
    st.session_state.messages = []

if "tool_calls" not in st.session_state:
    st.session_state.tool_calls = {}

if not st.session_state.messages:
    st.info(
        "Try: 'Read section 1 and summarize it', 'Look up Sarah Chen', "
        "or 'Write section 3 about badge access'."
    )

for i, message in enumerate(st.session_state.messages):
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if i in st.session_state.tool_calls:
            render_tool_call(st.session_state.tool_calls[i])

if prompt := st.chat_input("Help me create training documentation..."):
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        try:
            if client:
                assistant_reply, updated_messages, tool_call_info = get_completion_with_tools(
                    client=client,
                    messages=st.session_state.messages,
                )
            else:
                assistant_reply, updated_messages, tool_call_info = get_demo_completion_with_tools(
                    messages=st.session_state.messages
                )

            if tool_call_info:
                render_tool_call(tool_call_info)

            st.markdown(assistant_reply)
            st.session_state.messages = updated_messages

            if tool_call_info:
                for idx in range(len(st.session_state.messages) - 1, -1, -1):
                    if st.session_state.messages[idx]["role"] == "assistant":
                        st.session_state.tool_calls[idx] = tool_call_info
                        break
        except Exception as e:
            st.error(f"Error: {str(e)}")
            if hasattr(e, "response"):
                st.write("Response details:", e.response)
