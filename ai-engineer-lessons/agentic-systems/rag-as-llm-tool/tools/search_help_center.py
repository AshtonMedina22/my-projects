import json


def search_help_center(query):
    """
    Search the company help center for FAQs.
    """
    with open("data/help_center_faq.json", "r") as f:
        faq_data = json.load(f)
    
    if query in faq_data:
        return faq_data[query]
    else:
        return f"Sorry, I don't have information about '{query}' in our help center yet. Please contact support for assistance."


# Tool definition with explicit FAQ topics listed
retrieval_tool_definition = {
    "type": "function",
    "function": {
        "name": "search_help_center",
        "description": "Search the company help center FAQ for customer service questions. Use this function when the user asks about one of these supported topics: refund policy, shipping time, reset password, cancel subscription, track order, contact support, product warranty, or size guide. Call the function by passing the best matching search keyword exactly as a string in the query argument. If the user's question is not represented by one of these FAQ keywords, do not call this function; answer that the information is not available in the help center and suggest contacting support.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search terms related to one of the available topics",
                    "enum": [
                        "refund policy",
                        "shipping time", 
                        "reset password",
                        "cancel subscription",
                        "track order",
                        "contact support",
                        "product warranty",
                        "size guide"
                    ]
                }
            },
            "required": ["query"]
        }
    }
}
