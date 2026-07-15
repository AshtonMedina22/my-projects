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

We've preloaded a NumPy array below. The attribute `dtype` gives us the array's data type. The attribute `itemsize` gives us the size of an item in the array in bytes. Run the cell below to examine the output.


```python
import numpy as np
numbers = np.array([1.23456, 2.3456, 3.456, 7.56, 15.6745], dtype = 'float32')
print("Data type: ", numbers.dtype)
print("Bytes needed per element: ", numbers.itemsize)
```

**Checkpoint (1/3): Changing Data Types in NumPy**

We've written some code below to convert `numbers` to an array of FP16 numbers using the type `np.float16` function. Run the following cell to examine how the numbers change.


```python
f16_numbers = np.float16(numbers)
f16_bytes_per_element = f16_numbers.itemsize
print(f16_numbers)
print("Bytes needed per element: ", f16_bytes_per_element)
```

(Note that the precision has already gone down!) Now, similar to the above, you can use the `int8` type in NumPy, `np.int8`, as a function to convert its element to the signed integer datatype. 

Apply `np.int8` function to `numbers` and store the result as an array `int8_numbers`. Create a variable `int8_bytes_per_element` and set it to the bytes needed per element in this new array. Print both values to examine the output. 

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
### YOUR SOLUTION HERE ###
int8_numbers = np.int8(numbers)
int8_bytes_per_element = int8_numbers.itemsize

print(int8_numbers)
print("Bytes needed per element: ", int8_bytes_per_element)
```

**Checkpoint (2/3): Quantization in NumPy**

We will assume that the original array `numbers` in the previous checkpoint represent weights in a deep-learning model and test a toy function to quantize it.

While the above method converted the values in the numbers array to integers, it could be better. It merely rounded down the numbers to get an integer value and lost some information in the original array. For instance, if all the weights were numerical values `< 1`, `np.int8` would round them down to `0`! To do justice to the original array, we'd need to account for its range of values relative to the range of numbers that the data type can represent.

We've written a simple function in the cell below to quantize arrays using a type of quantization known as "Absmax quantization". Run this cell to define the function.


```python
def quantize(x):
    # scaling the values
    scale = 127 / max(abs(x))
    # quantizing
    quantized_value = (scale * x).round()
    return quantized_value.astype(np.int8)
```

Apply this function to the array `numbers` and store the result as `quantized_array`. Print the array and its `itemsize` to examine the result.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
## YOUR SOLUTION HERE ##
quantized_array = quantize(numbers)

print(quantized_array)
print("Bytes needed per element: ", quantized_array.itemsize)

```

**Checkpoint (3/3): Quantization in Hugging Face**

We've successfully quantized an array from a `float32` array that requires 4 bytes of memory per element to an `int8` array that requires only a single byte per element! What would it mean to do the same for a large transformer model with huge weight matrices? How much would the computational memory of the model decrease?

Luckily, we can answer these questions very easily with Hugging Face's `bitsandbytes` library. The documentation for this package is available at the following link: [https://huggingface.co/docs/bitsandbytes/main/en/index](https://huggingface.co/docs/bitsandbytes/main/en/index). We've already written some code below that calculates the memory footprint of `distilgpt2`, a lighter version of the GPT-2 model. Run the following cell to view the model size in bytes.


```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
torch.manual_seed(19)

model_id = 'distilgpt2'
model = AutoModelForCausalLM.from_pretrained(model_id)
print("Model size in bytes: ", model.get_memory_footprint())
```

Add two more arguments to the `from_pretrained` method to get the 8-bit quantized version of `distilgpt2` as follows:
- Set `device_map` to `'auto'`
- Set `load_in_8bit` to `True`

Uncomment the line that prints the model size and run the cell.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
int8_quantized_model = AutoModelForCausalLM.from_pretrained(model_id,
                                                            ### YOUR SOLUTION HERE ###
                                                            device_map='auto',
                                                            load_in_8bit=True
                                             )
print("8-bit Quantized model size in bytes: ", int8_quantized_model.get_memory_footprint())
```
