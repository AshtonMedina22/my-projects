import os


def _content_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", filename))


def delete_section(section_number):
    """Deletes a training manual section file from the content folder."""
    try:
        file_path = _content_path(f"section_{section_number}.txt")

        if not os.path.exists(file_path):
            return {"status": "error", "message": f"Training section {section_number} not found"}

        os.remove(file_path)

        return {
            "status": "success",
            "message": f"Training section {section_number} deleted successfully",
            "filename": f"section_{section_number}.txt",
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to delete section: {str(e)}"}


delete_section_tool_definition = {
    "type": "function",
    "function": {
        "name": "delete_section",
        "description": (
            "Deletes a training manual section file. Only call this when the user is completely certain that a "
            "section should be deleted. If deletion seems possible but the user has not clearly confirmed it, ask "
            "for confirmation before calling this tool."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "section_number": {
                    "type": "integer",
                    "description": "The section number to delete, such as 1, 2, or 3.",
                }
            },
            "required": ["section_number"],
            "additionalProperties": False,
        },
        "strict": True,
    },
}
