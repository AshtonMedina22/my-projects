# Function Calling Checkpoints

## Checkpoint 1 - Define Dice Tool

```python
dice_tool_definition = {
    "type": "function",
    "function": {
        "name": "roll_dice",
        "description": "Roll one or more dice with a specified number of sides and return the individual rolls and their total.",
        "parameters": {
            "type": "object",
            "properties": {
                "sides": {
                    "type": "integer",
                    "description": "The number of sides on each die. For example, use 6 for a standard six-sided die."
                },
                "count": {
                    "type": "integer",
                    "description": "The number of dice to roll."
                }
            },
            "required": [],
            "additionalProperties": False
        },
        "strict": True
    }
}

print(json.dumps(dice_tool_definition, indent=2))
```

## Checkpoint 2 - Process Tool Calls

```python
def process_tool_calls(response):
    """
    Extract function call details from the API response.
    """
    message = response.choices[0].message

    if not hasattr(message, "tool_calls") or not message.tool_calls:
        return None
    
    # Remember that the message dict has a key tool_calls, which is a list with one item in it
    tool_call = message.tool_calls[0]
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)

    return {
        "id": tool_call.id,
        "function_name": function_name,
        "function_args": function_args
    }

# Define our tools list
tools = [dice_tool_definition]

# Send a request to the model
response = client.chat.completions.create(
    model="gpt-4.1",
    messages=[{"role": "user", "content": "Roll two six-sided dice for me."}],
    tools=tools
)

# Process the response
tool_call = process_tool_calls(response)
if tool_call:
    print("Tool call ID:", tool_call["id"])
    print("Function name:", tool_call["function_name"])
    print("Function arguments:", tool_call["function_args"])
else:
    print("No function call in the response")
```

## Checkpoint 3 - End-To-End Tool Execution

```python
def call_LLM_with_tool(user_query):
    """Complete end-to-end function calling workflow with multiple tools."""
    # Define tools
    tools = [dice_tool_definition]
    
    # Step 1: Initial request
    messages = [{"role": "user", "content": user_query}]
    response = client.chat.completions.create(
        model="gpt-4.1", 
        messages=messages,
        tools=tools
    )
    
    # Step 2: Check for function calls
    tool_call = process_tool_calls(response)
    if not tool_call:
        return response.choices[0].message.content
    
    # Step 3: Execute function
    tool_call_id = tool_call["id"]
    function_name = tool_call["function_name"]
    function_args = tool_call["function_args"]
    
    if function_name == "roll_dice":
        result = roll_dice(
            sides=function_args["sides"],
            count=function_args["count"]
        )
    else:
        result = {"error": f"Unknown function: {function_name}"}
    
    print(f"Function result: {result}")
    
    # # Step 4: Send result back to model
    messages.append(response.choices[0].message)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call_id,
        "content": json.dumps(result)
    })
    
    # # Step 5: Get final response
    final_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=messages
    )
    
    return final_response.choices[0].message.content

dice_response = call_LLM_with_tool("Roll three eight-sided dice for me.")
print(f"Final response: {dice_response}\n")
```
