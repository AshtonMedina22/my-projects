# Assignment Notes

Build a Training Manual Creator chatbot that can use four local tools:

- `write_section`
- `read_section`
- `delete_section`
- `lookup_contact`

The app stores handbook section files in `content/` and contact information in `content/team_directory.json`.

The LLM should use tool definitions to decide when to read, write, delete, or look up contact information, and the Streamlit UI should display tool calls with inputs and outputs.
