<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!
    
[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:
    
1. Add your solution to the cell with `## YOUR SOLUTION HERE ## `.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
4. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)

**Setup**

Run the following cell to import libraries and datasets.


```python
# Important: Don't run this cell more than once.
from transformers import GPT2LMHeadModel, GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained("distilgpt2")
model = GPT2LMHeadModel.from_pretrained("distilgpt2")


from transformers import set_seed
set_seed(10) # Don't change this value.
```

**Checkpoint 1/4: Greedy Search**

![A flow chart showing the pathways of text generation. It starts with the word "My" from which two lines branch out into dog and fish. The line going to dog has the number 0.7 and the one to fish has the number 0.5. These numbers represent the probabilities of the words being generated as the next token. "My dog" can now branch out into three words, "is", "walked" and "barked" with the numbers on the lines being 0.2, 0.4, and 0.3. Alternately "My fish" branches out to "swims", "died" and "eats" with probabilities 0.8, 0.6 and 0.5 respectively.](https://static-assets.codecademy.com/Courses/into-to-transformers/greedy.png)

In greedy search, the model chooses the likeliest next token at each step in the sequence. In the diagram above, the numbers on each line represent the model's understanding of that token's probability of being next in the sequence. Try it out by uncommenting and executing the code cell below.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
prompt = "The capital of France is"
inputs = tokenizer.encode(prompt, return_tensors="pt")

greedy_outputs = model.generate(inputs, max_length=50, pad_token_id=tokenizer.eos_token_id) #(Don't mind the `pad_token_id` bit there; it's just included to avoid a warning message.)

print(tokenizer.decode(greedy_outputs[0]))
```

This approach certainly leaves much to be desired. Note in the diagram above how very likely tokens hidden behind less likely ones (such as 'swims') are obscured in this approach. Our next strategy, beam search, tries to mitigate this problem.

**Checkpoint 2/4: Beam Search**

![A flow chart showing the pathways of text generation. It starts with the word "My" from which two lines branch out into dog and fish. The line going to dog has the number 0.7 and the one to fish has the number 0.5. These numbers represent the probabilities of the words being generated as the next token. "My dog" can now branch out into three words, "is", "walked" and "barked" with the numbers on the lines being 0.2, 0.4, and 0.3. Alternately "My fish" branches out to "swims", "died" and "eats" with probabilities 0.8, 0.6 and 0.5 respectively. At the end of each line, the total cumulative probability is calculated. For instance, for "My dog walked", the total value is 0.7+0.4 = 1.1. For "My fish swims", this would be 0.5 +0.8 = 1.3, which is the highest probability of the set of choices.](https://static-assets.codecademy.com/Courses/into-to-transformers/beam.png)

It evaluates several paths (beams) further into the sequence, and calculates their total probability before choosing the one with the highest sum. In the diagram above, each beam is a dashed red line. The beam with the highest probability is "My fish swims." There are three beams displayed, but that value can be defined by the user via the `num_beams` parameter passed to `model.generate()`.

Let's try it. Modify the call the `model.generate()` below such that it performs beam search using 5 beams. Don't touch anything else.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
prompt = "The capital of France is"
inputs = tokenizer.encode(prompt, return_tensors="pt")

## YOUR SOLUTION HERE ##
beam_outputs = model.generate(
    inputs, 
    max_length=50,
    num_beams=5,
    early_stopping=True,
    pad_token_id=tokenizer.eos_token_id,
    #set number of beams
)

print(tokenizer.decode(beam_outputs[0])) 
```

While beam search can potentially find better sequences (and thus generate better outputs) than greedy search, as you can see above it struggles with the same problem greedy search did in our earlier example: it can easily get stuck in a loop of repeating itself.


**Checkpoint 3/4: n-gram penalty**

One technique to prevent this repetition is via setting n-gram penalties. An "n-gram" is just a sequence of tokens of length $n$. Setting an n-gram penalty means preventing any sequence of length $n$ from repeating itself over the course of the output.

We set the n-gram penalty by passing our desired size of $n$ via the argument `no_repeat_ngram_size` in the `generate` method. Set that value to `2` inside the `model.generate()` call and see how it changes the output below.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
prompt = "The capital of France is"
inputs = tokenizer.encode(prompt, return_tensors="pt")

## YOUR SOLUTION HERE ##
ngram_outputs = model.generate(
    inputs, 
    max_length=50,
    num_beams=5, 
    no_repeat_ngram_size=2,
    early_stopping=True,
    pad_token_id=tokenizer.eos_token_id,
    # set n-gram penalty   
)


print(tokenizer.decode(ngram_outputs[0])) 

```

OK, that's an improvement! However, as you can imagine, preventing *any* repetitions of n-length can be too restrictive for a variety of uses. Imagine a sports article about women’s soccer that’s only allowed to say “women’s soccer” one time!

**Checkpoint 4/4: Sampling**


Another problem with our current configuration is that the text is not quite random enough. As it turns out, human text is a lot more random. To make our text more natural, let's tell GPT-2 to select the next token at random from among a handful of likely candidates. We'll do so by setting `do_sample` to `True`.

To improve its performance, we'll also turn down the temperature some to prevent the least likely outputs, as they're quite zany. We'll also instruct the model to choose from among the top 50 most likely completions (`top_k`).

To attempt more natural, human text, set the following parameters in the `model.generate()` function:

- Set `do_sample` to `True`
- Set the `temperature` to `0.6`
- Set the `top_k` to `50`

Then run the cell.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
prompt = "The capital of France is"
inputs = tokenizer.encode(prompt, return_tensors="pt")


set_seed(10) # Because sampling involves random number generation, we need to set the seed an additional time.

## YOUR SOLUTION HERE ##
sample_outputs = model.generate(
    inputs,
    no_repeat_ngram_size=2,
    max_new_tokens=40,
    do_sample=True,
    temperature=0.6,
    top_k=50,
    pad_token_id=tokenizer.eos_token_id,
    # set do_sample, temperature and top_k
)

print(tokenizer.decode(sample_outputs[0]))


```

As you can see, it doesn't make the most sense, but we've succeeded in generating much more natural text than we started with in the beginning!


```python

```
