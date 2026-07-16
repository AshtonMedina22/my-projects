# OpenAI Python API: Recipe Blog Notes

## Objective

Build a recipe generator for a food blog that provides tailored recipe recommendations using:

- User dietary preferences
- Ingredients on hand
- Favorite cuisines
- Prompt engineering for blog-ready formatting

## Original Lesson Prompt

As a new food blogger looking to create the next big culinary hub for your readers, build a recipe generator that provides tailored recipe recommendations by giving the model context about the user's dietary preferences, ingredients on hand, and cuisine favorites.

The lesson focuses on formatting model output recipes in the best format for a blog.

## Checkpoint Log

### Tasks 1-14

Completed the full Recipe Blog script:

- Imported `OpenAI` from `openai`.
- Created `client = OpenAI()`.
- Created `user_profile`.
- Added dietary restrictions, cuisine preferences, and available ingredients.
- Created `system_prompt` with `role="system"` and instruction content.
- Built `user_content1`, `user_content2`, and `user_content3`.
- Created `user_prompt` with `role="user"` and combined content.
- Called `client.chat.completions.create()`.
- Printed `response.choices[0].message.content`.

The output should be HTML code for a single blog-ready recipe post.

## Final Code

See `script.py`.
