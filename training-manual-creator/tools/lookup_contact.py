import json
import os


def _content_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", filename))


def lookup_contact(contact_name):
    """Looks up team member or contact information from the team directory."""
    try:
        file_path = _content_path("team_directory.json")

        if not os.path.exists(file_path):
            return {"status": "error", "message": "Team directory not found"}

        with open(file_path, "r", encoding="utf-8") as f:
            contacts = json.load(f)

        contact_info = None
        matched_name = None
        for name, description in contacts.items():
            if name.lower() == contact_name.lower():
                matched_name = name
                contact_info = description
                break

        if contact_info:
            return {
                "status": "success",
                "contact": matched_name,
                "description": contact_info,
            }

        return {
            "status": "not_found",
            "message": f"Contact '{contact_name}' not found",
            "available_contacts": list(contacts.keys()),
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to lookup contact: {str(e)}"}


lookup_contact_tool_definition = {
    "type": "function",
    "function": {
        "name": "lookup_contact",
        "description": (
            "Looks up team members, departments, and key internal contacts from the company directory. Use this "
            "when training manual content relies on a person, department, support role, or contact reference, or "
            "when the user asks about a person or role. Pass the exact person or role name as the contact_name."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "contact_name": {
                    "type": "string",
                    "description": "The person, team, or role to look up, such as 'Sarah Chen' or 'IT Support'.",
                }
            },
            "required": ["contact_name"],
            "additionalProperties": False,
        },
        "strict": True,
    },
}
