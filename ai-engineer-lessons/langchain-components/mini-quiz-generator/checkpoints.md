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
