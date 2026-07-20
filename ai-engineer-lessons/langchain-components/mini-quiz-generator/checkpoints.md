# Mini Quiz Generator Checkpoints

## Build Individual Chains

```python
question_chain = LLMChain(
    llm=llm,
    prompt=question_prompt,
    output_key="question",
)

answer_chain = LLMChain(
    llm=llm,
    prompt=answer_prompt,
    output_key="answer",
)
```

These output keys are used by `SequentialChain` to move the generated question into the answer chain.

## Compose Sequential Chain

```python
quiz_chain = SequentialChain(
    chains=[question_chain, answer_chain],
    input_variables=["topic"],
    output_variables=["question", "answer"],
    verbose=True,
)
```

`SequentialChain` runs the chains in order. The `question` output key from `question_chain` becomes the input used by `answer_chain`.

## Run Quiz Generator

```python
topic = input("Enter a quiz topic: ")

response = quiz_chain.invoke({"topic": topic})

print("\nGenerated Question:")
print(response["question"])

print("\nGenerated Answer:")
print(response["answer"])
```

The dictionary passed to `.invoke()` must match the chain input variable names. The returned response can be accessed with bracket notation, such as `response["question"]` and `response["answer"]`.
