from openai import OpenAI


client = OpenAI()

user_profile = {}
user_profile["dietary_restrictions"] = "vegetarian, gluten-free"
user_profile["cuisine_preferences"] = "Mediterranean, Italian, Mexican"
user_profile["ingredients_available"] = "chickpeas, spinach, tomatoes, rice, garlic, olive oil, lemon"

system_prompt = {
    "role": "system",
    "content": (
        "You are an expert food blogger and recipe developer. Generate HTML code "
        "for a recipe blog post that takes into account the user's dietary "
        "restrictions, preferred cuisine types, and available ingredients."
    ),
}

user_content1 = (
    "I want to create a recipe blog post for a user with the following profile:\n"
    f"Dietary restrictions: {user_profile['dietary_restrictions']}\n"
    f"Cuisine preferences: {user_profile['cuisine_preferences']}\n"
    f"Ingredients available: {user_profile['ingredients_available']}\n"
)

user_content2 = (
    "Please structure the blog post as HTML. Include a recipe title, a short "
    "description, an ingredients section, and numbered cooking instructions. "
    "Format the ingredients as an unordered list and the instructions as an "
    "ordered list."
)

user_content3 = (
    "Use only the ingredients listed in the user profile. Generate only one "
    "recipe blog post. Keep the recipe instructions to no more than six steps."
)

user_prompt = {
    "role": "user",
    "content": user_content1 + "\n" + user_content2 + "\n" + user_content3,
}

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[system_prompt, user_prompt],
)

print(response.choices[0].message.content)
