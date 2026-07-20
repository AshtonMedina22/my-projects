# Paste-Ready Checkpoint Snippets

## Chat Interface Basics

Use these values inside the `st.info` block:

```python
tool_call_info['function_name']
json.dumps(tool_call_info['function_args'], indent=2)
json.dumps(tool_call_info['result'], indent=2)
```

## write_section.py

```python
f.write(content)
```

Tool description:

```python
"Writes a new training manual section or fully revises an existing section. Use this only when the user explicitly asks to create, save, update, or revise training documentation. The content should use a precise, professional employee-training tone. When revising a section, rewrite and save the complete section text, preserving any parts the user did not ask to change."
```

## read_section.py

Success dictionary values:

```python
"section_number": section_number,
"content": content,
"length": len(content)
```

Tool description:

```python
"Reads an existing training manual section. Use this when the assistant needs more information about a section before answering or revising, or when the user asks to read, summarize, inspect, or quote a section of the employee handbook."
```

## delete_section.py

```python
os.remove(file_path)
```

Tool description:

```python
"Deletes a training manual section file. Only call this when the user is completely certain that a section should be deleted. If deletion seems possible but the user has not clearly confirmed it, ask for confirmation before calling this tool."
```

## lookup_contact.py

Case-insensitive comparison:

```python
if name.lower() == contact_name.lower():
```

Tool description:

```python
"Looks up team members, departments, and key internal contacts from the company directory. Use this when training manual content relies on a person, department, support role, or contact reference, or when the user asks about a person or role. Pass the exact person or role name as the contact_name."
```

## handler.py Imports

```python
from .write_section import write_section, write_section_tool_definition
from .read_section import read_section, read_section_tool_definition
from .delete_section import delete_section, delete_section_tool_definition
from .lookup_contact import lookup_contact, lookup_contact_tool_definition
```

## handler.py Registry

```python
FUNCTION_REGISTRY = {
    "write_section": write_section,
    "read_section": read_section,
    "delete_section": delete_section,
    "lookup_contact": lookup_contact
}
```

## handler.py Tools List

```python
TOOLS = [
    write_section_tool_definition,
    read_section_tool_definition,
    delete_section_tool_definition,
    lookup_contact_tool_definition
]
```

## OpenAI Tool Call Parameter

```python
tools=TOOLS
```
