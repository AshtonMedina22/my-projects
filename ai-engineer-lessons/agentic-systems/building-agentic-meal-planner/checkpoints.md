# Building an Agentic Meal Planner Checkpoints

These snippets map to checklist items 1-14 from the lesson.

## Steps 1-4 - Draft Plan

```python
def draft_plan(params):

    system_prompt = """You are a registered dietician who writes weekly dinner plans."""

    user_prompt = f"""
    <instructions>
 Your task is to create a  7-day **dinner** plan for a family of {params["people"]} people.

- Assign around {params["daily_calories"]} calories *per person* each day
- Keep your estimated total cost less than or equal to ${params["budget_usd"]}  
- One or more of the family's members have the following allergies: {", ".join(params["allergens"])}.
Do not include any of these allergens in your plan.
IMPORTANT - we already have these ingredients on hand:  

{", ".join(params["pantry"])}
Use as MANY of those pantry items as you reasonably can while still meeting the other constraints.
    </instructions>

    <schema>
Return your answer as pure JSON (no markdown, no comments) matching
exactly this schema:
{schema_string}
    </schema>
"""

    raw_json = get_completion(user_prompt,
                              system_prompt,
                              json_mode=True
                              )

    return json.loads(raw_json)
```

## Steps 5-7 - Critique Plan

```python
def critique_plan(plan, params):

    system_prompt = """You are a stern dietary QA inspector."""

    user_prompt = f"""
    <instructions>
    Here is the proposed plan (raw JSON):

{json.dumps(plan)}

Check for rule violations:

1. The total_cost must be less than or equal to {params["budget_usd"]}
2. Each day's calories must be within ±15 % of {params["daily_calories"]}
3. NONE of these allergens may appear: {', '.join(params["allergens"])}
4. *Every* pantry item ({', '.join(params["pantry"])}) must appear at
   least once in the week.  Bonus points for using them more often.

Place any violation inside **fixes**.

Then think of nice-to-have tweaks (better variety, seasonal veg, quicker
prep, etc.). Put those ideas in **suggestions**.
</instructions>

<schema>
Reply with JSON matching this schema:
{{"fixes":[], "suggestions":[]}}
Output ONLY the JSON. No markdown backticks, no comments, no extra text.
</schema>
"""

    raw = get_completion(user_prompt,
                         system_prompt,
                         json_mode=True
                         )

    return json.loads(raw)
```

## Steps 8-10 - Revise Plan

```python
def revise_plan(plan, fixes, suggestions, params):
    system_prompt = """You are a senior meal planner applying corrections."""
    user_prompt = f"""
    <instructions>
Your task is to apply the following corrections to this meal plan:
{json.dumps(plan)}

Here are the mandatory fixes:
{json.dumps(fixes)}

Optional but welcome suggestions:
{json.dumps(suggestions)}
Apply every fix.  Use suggestions only if they don't break the rules.
Return the **updated** plan as plain JSON (same schema, no extra text).
</instructions>

<schema>
Return your answer as pure JSON (no markdown, no comments) matching
exactly this schema:
{schema_string}
</schema>
"""

    raw = get_completion(user_prompt,
                         system_prompt,
                         json_mode=True)
    return json.loads(raw)
```

## Steps 11-14 - Assemble Workflow

```python
MAX_PASSES = 3

def build_plan(params):

    plan = draft_plan(params)

    for _ in range(MAX_PASSES):

        critique = critique_plan(plan, params)

        if not critique["fixes"] and not critique["suggestions"]:
            break

        plan = revise_plan(
            plan,
            critique["fixes"],
            critique["suggestions"],
            params
        )

    return plan


if __name__ == "__main__":

    final_plan = build_plan(user_inputs)

    print("\nFINAL PLAN")
    print(json.dumps(final_plan, indent=2))

    groceries = build_grocery_list(final_plan, user_inputs["pantry"])

    print("\nGROCERY LIST")
    print(json.dumps(groceries, indent=2))
```
