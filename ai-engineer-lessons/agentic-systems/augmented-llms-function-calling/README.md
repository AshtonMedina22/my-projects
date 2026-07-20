# Augmented LLMs - Function Calling

Lesson notes for exposing Python functions as tools to an OpenAI chat model.

## Goal

Define a `roll_dice` function as an OpenAI tool, let the model request a tool call, execute the function locally, then send the tool result back to the model for a final natural-language response.

## Concepts

- OpenAI tool schemas
- JSON Schema parameters
- `message.tool_calls`
- Parsing tool-call arguments with `json.loads`
- Executing local Python functions from model-requested tool calls
- Returning tool results through `role: "tool"`

## Checkpoint Snippets

Use `checkpoints.md` for paste-ready notebook code.
