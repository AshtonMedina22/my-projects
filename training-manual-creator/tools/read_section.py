import os


def _content_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", filename))


def read_section(section_number):
    """Reads a training manual section file from the content folder."""
    try:
        file_path = _content_path(f"section_{section_number}.txt")

        if not os.path.exists(file_path):
            return {"status": "error", "message": f"Training section {section_number} not found"}

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        return {
            "status": "success",
            "section_number": section_number,
            "content": content,
            "length": len(content),
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to read section: {str(e)}"}


read_section_tool_definition = {
    "type": "function",
    "function": {
        "name": "read_section",
        "description": (
            "Reads an existing training manual section. Use this when the assistant needs more information about "
            "a section before answering or revising, or when the user asks to read, summarize, inspect, or quote "
            "a section of the employee handbook."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "section_number": {
                    "type": "integer",
                    "description": "The section number to read, such as 1, 2, or 3.",
                }
            },
            "required": ["section_number"],
            "additionalProperties": False,
        },
        "strict": True,
    },
}
