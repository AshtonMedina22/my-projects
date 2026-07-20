import os


def _content_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", filename))


def write_section(section_number, content):
    """Writes content to a training manual section file in the content folder."""
    try:
        file_path = _content_path(f"section_{section_number}.txt")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

        return {
            "status": "success",
            "message": f"Training section {section_number} saved successfully",
            "filename": f"section_{section_number}.txt",
            "length": len(content),
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to write section: {str(e)}"}


write_section_tool_definition = {
    "type": "function",
    "function": {
        "name": "write_section",
        "description": (
            "Writes a new training manual section or fully revises an existing section. Use this only when the "
            "user explicitly asks to create, save, update, or revise training documentation. The content should "
            "use a precise, professional employee-training tone. When revising a section, rewrite and save the "
            "complete section text, preserving any parts the user did not ask to change."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "section_number": {
                    "type": "integer",
                    "description": "The section number to write, such as 1, 2, or 3.",
                },
                "content": {
                    "type": "string",
                    "description": "The complete section content to write to the file.",
                },
            },
            "required": ["section_number", "content"],
            "additionalProperties": False,
        },
        "strict": True,
    },
}
