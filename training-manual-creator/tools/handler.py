"""
Tool handler for the Training Manual Creator.

The handler exposes local file and directory tools to the LLM through OpenAI
function calling. It keeps the Streamlit app small while making the tool layer
easy to extend.
"""

import json

from .delete_section import delete_section, delete_section_tool_definition
from .lookup_contact import lookup_contact, lookup_contact_tool_definition
from .read_section import read_section, read_section_tool_definition
from .write_section import write_section, write_section_tool_definition


FUNCTION_REGISTRY = {
    "write_section": write_section,
    "read_section": read_section,
    "delete_section": delete_section,
    "lookup_contact": lookup_contact,
}

TOOLS = [
    write_section_tool_definition,
    read_section_tool_definition,
    delete_section_tool_definition,
    lookup_contact_tool_definition,
]


SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "You are a careful training manual assistant. Use the available tools when the user asks to read, "
        "write, revise, delete, or enrich employee handbook sections. Do not invent contact details; use "
        "lookup_contact for people and departments. Ask for confirmation before destructive changes unless "
        "the user clearly asked to delete a section."
    ),
}


def process_tool_calls(response):
    """Extract the first function call details from an OpenAI response."""
    message = response.choices[0].message

    if not hasattr(message, "tool_calls") or not message.tool_calls:
        return None

    tool_call = message.tool_calls[0]
    return {
        "id": tool_call.id,
        "function_name": tool_call.function.name,
        "function_args": json.loads(tool_call.function.arguments),
    }


def execute_function(function_name, function_args):
    """Execute a registered local function."""
    if function_name in FUNCTION_REGISTRY:
        return FUNCTION_REGISTRY[function_name](**function_args)
    return {"status": "error", "message": f"Unknown function: {function_name}"}


def _with_system_prompt(messages):
    if messages and messages[0].get("role") == "system":
        return messages
    return [SYSTEM_PROMPT] + messages


def get_completion_with_tools(client, messages):
    """
    Get a completion from the model, executing a single tool call when requested.

    Returns:
        tuple: (response_content, updated_messages, tool_call_info)
    """
    request_messages = _with_system_prompt(messages)
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=request_messages,
        tools=TOOLS,
    )

    tool_call = process_tool_calls(response)
    tool_call_info = None

    if not tool_call:
        content = response.choices[0].message.content
        return content, messages + [{"role": "assistant", "content": content}], tool_call_info

    function_name = tool_call["function_name"]
    function_args = tool_call["function_args"]
    result = execute_function(function_name, function_args)
    tool_call_info = {
        "id": tool_call["id"],
        "function_name": function_name,
        "function_args": function_args,
        "result": result,
    }

    updated_messages = request_messages.copy()
    updated_messages.append(
        {
            "role": "assistant",
            "content": response.choices[0].message.content,
            "tool_calls": [
                {
                    "id": tool_call["id"],
                    "type": "function",
                    "function": {
                        "name": function_name,
                        "arguments": json.dumps(function_args),
                    },
                }
            ],
        }
    )
    updated_messages.append(
        {
            "role": "tool",
            "tool_call_id": tool_call["id"],
            "content": json.dumps(result),
        }
    )

    final_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=updated_messages,
    )

    final_content = final_response.choices[0].message.content
    updated_messages.append({"role": "assistant", "content": final_content})

    filtered_messages = [
        msg
        for msg in updated_messages
        if msg["role"] in {"user", "assistant"} and not msg.get("tool_calls")
    ]

    return final_content, filtered_messages, tool_call_info


def get_demo_completion_with_tools(messages):
    """Small local fallback so the portfolio app remains usable without an API key."""
    prompt = messages[-1]["content"].lower()
    tool_call_info = None

    if "section 1" in prompt or "section_1" in prompt:
        result = read_section(1)
        tool_call_info = {"function_name": "read_section", "function_args": {"section_number": 1}, "result": result}
        reply = "Demo mode read Section 1. It welcomes Joe, explains the mission and values, and lists first-week onboarding steps."
    elif "section 2" in prompt or "section_2" in prompt or "it setup" in prompt:
        result = read_section(2)
        tool_call_info = {"function_name": "read_section", "function_args": {"section_number": 2}, "result": result}
        reply = "Demo mode read Section 2. It covers computer setup, security rules, common applications, and IT help channels."
    elif "sarah" in prompt:
        result = lookup_contact("Sarah Chen")
        tool_call_info = {"function_name": "lookup_contact", "function_args": {"contact_name": "Sarah Chen"}, "result": result}
        reply = "Demo mode looked up Sarah Chen. She is the HR Director for employee relations, benefits, and policy questions."
    elif "it support" in prompt or "technical" in prompt:
        result = lookup_contact("IT Support")
        tool_call_info = {"function_name": "lookup_contact", "function_args": {"contact_name": "IT Support"}, "result": result}
        reply = "Demo mode looked up IT Support. They handle computer issues, software installation, and network problems."
    else:
        reply = (
            "Demo mode is active because OPENAI_API_KEY is not configured. Try asking me to read section 1, "
            "read section 2, look up Sarah Chen, or look up IT Support."
        )

    return reply, messages + [{"role": "assistant", "content": reply}], tool_call_info
