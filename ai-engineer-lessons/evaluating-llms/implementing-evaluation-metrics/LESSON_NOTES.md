# Lesson Notes

## Perplexity

Perplexity estimates how likely a causal language model is to predict a sequence of text.

- Lower perplexity means the model finds the text more predictable.
- Higher perplexity means the model is more surprised by the text.
- It is most useful when comparing similar causal language models on the same text/data.

## BLEU

BLEU compares generated text against reference text using matching word sequences, called n-grams.

- Higher BLEU means the generated text overlaps more with the reference.
- BLEU was originally built for translation, but it is also used for text generation evaluation.
- BLEU does not fully capture creativity, meaning, or usefulness, so it should not be the only evaluation method.

## Portfolio Relevance

These metrics are useful when building projects that generate text, summarize text, translate text, or compare base vs fine-tuned model quality.
