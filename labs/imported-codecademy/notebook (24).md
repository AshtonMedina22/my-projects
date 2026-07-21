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

Run the following cell to import the libraries we'll use and tell the logger to be quiet.


```python
import torch
from transformers import AutoModelForSequenceClassification, logging
import time

logging.set_verbosity_error() # this just clears our cell output of some clutter
```

#### Checkpoint 1/3

We'll first use the `torch.cuda` module to learn more about the GPUs we have available.

- you can find out whether or not a GPU is available with `torch.cuda.is_available()`
- you can find out *how many* GPUs are available with `torch.cuda.device_count()`
- you can find out what the name of the GPUs are, given they exist, with `torch.cuda.get_device_name()`

Fill in the three vars below using these three methods then execute the cell. Don't alter any of the other lines or add any other code to the cell.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
is_gpu_available = torch.cuda.is_available()

## YOUR SOLUTION HERE ##
num_of_devices = torch.cuda.device_count()

## YOUR SOLUTION HERE ##
if torch.cuda.is_available():
    device_name = torch.cuda.get_device_name()

print("Is CUDA available? ", is_gpu_available)
print("Number of CUDA devices: ", num_of_devices)
print("CUDA device name: ", device_name)
```

#### Checkpoint 2/3

One very common pattern you'll see in machine learning code is encapsulated in the following line:

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```
It finds out whether or not we have a GPU available and, if so, assigns it to `device`. Otherwise, `device` is `"cpu"`. This pattern enables what's called "device-agnostic code," meaning the code itself doesn't know whether or not we've got GPU access, but will work in either case.

Datasets and models are moved to our `device` using the `.to()` method. For instance, to initialize a 3x3 PyTorch tensor with random weights and then assign it to the GPU, we'd write

```python
tensor = torch.rand(3,3).to(device)
```
Moving a model to the GPU is the same method. For model `ML_model`, you'd simply write `ML_model.to(device)` (assuming we've defined `device` the way we did above.)

Using this information, fill out the cell below.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# device should be 'cuda' if GPU is available, else cpu
## YOUR SOLUTION HERE ##
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

## YOUR SOLUTION HERE ##
# move this tensor to the available device
tensor = torch.rand(2, 2).to(device)

model = AutoModelForSequenceClassification.from_pretrained("prajjwal1/bert-tiny", num_labels=2)
## YOUR SOLUTION HERE ##
model.to(device)

print("Device: ", device)
print("Tensor: ", tensor)
print("Model device: ", model.device)

```

#### Checkpoint 3/3

Notice how the model's device is returned as `"cuda:0"`? That's because it's indexed as the *first* GPU in what might be an array of many GPUs. We only have one GPU we'll use, but in larger scale training runs, you might find additional GPUs assigned to `"cuda:1"`, `"cuda:2"`, and so on.

Finally, let's perform a small experiment to see how much the GPU speeds up our computation.

First, assign to the variable `cpu_tensor` a randomly-initialized PyTorch tensor with 1,000 rows and 1,000 columns. You can do so with `torch.rand(num_rows, num_columns)`. We'll then add all the values together using the `.sum()` method.

Then, under the `torch.cuda.is_available()` if check, assign to the variable `gpu_tensor` another randomized 1,000 x 1,000 tensor, but pass `device=device` as the third argument.

Execute the code cell to see how much faster the GPU can sum every number in a 1,000 by 1,000 tensor than the CPU.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
start_time = time.time()
## YOUR SOLUTION HERE ##
cpu_tensor = torch.rand(1000, 1000)
cpu_sum = cpu_tensor.sum()
cpu_time = time.time() - start_time
print("CPU time: ", cpu_time)

if torch.cuda.is_available():
    start_time = time.time()
## YOUR SOLUTION HERE ##
    gpu_tensor = torch.rand(1000, 1000, device=device)
    gpu_sum = gpu_tensor.sum()
    gpu_time = time.time() - start_time
    print("GPU time: ", gpu_time)
    print("Speedup: ", cpu_time / gpu_time)
```
