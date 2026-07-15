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
Run the following cell to import libraries and helper function.

**MLP Task: Predict Hotel Cancellations Using Booking Data**

In this exercise, you will use PyTorch and neural networks to predict hotel cancellations using [real-world hotel booking data](https://www.kaggle.com/datasets/jessemostipak/hotel-booking-demand) from a resort hotel. 

The goal is to compare the performance of neural networks with different architectures (layers and activation functions).

The testing dataset has already been cleaned and pre-processed. It is loaded into PyTorch dataset objects `test_dataset` and `test_loader` for batching and placed onto the GPU device.


```python
# Load test data
import torch
import pandas as pd
import numpy as np
torch.manual_seed(42)

# Load Testing data
TEST_CSV  = "datasets/bookings_test.csv"
test_df  = pd.read_csv(TEST_CSV)

# Testing Features + Target Distribution
TARGET = "is_canceled"
input_features = [x for x in test_df.columns if x not in TARGET]
print("# of Input Features:", len(input_features))
print()

print("Testing Target Distribution:")
print(test_df[TARGET].value_counts().to_frame("count").assign(pct=lambda x: (x["count"] / x["count"].sum() * 100).round(2)))
print()

# Load to GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
X_test = torch.from_numpy(test_df[input_features].values).float().to(device)
y_test = torch.from_numpy(test_df[TARGET].values).float().view(-1, 1).to(device)

y_true = y_test.cpu().numpy().ravel()
print("Testing size:", y_test.shape)

# Create TensorDataset and DataLoader
from torch.utils.data import TensorDataset, DataLoader
test_dataset = TensorDataset(X_test, y_test)

batch_size = 32
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

# Check device
print("Device:", device)
```

**Prediction Loop with the `predict` Function**


```python
def predict(model, dataloader, device="cpu"):
    model.eval()
    all_logits = []
    all_predictions = []

    with torch.no_grad():
        for batch_X, _ in dataloader:
            batch_X = batch_X.to(device)

            # Forward pass
            logits = model(batch_X)

            # Convert logits to predicted labels
            probs = torch.sigmoid(logits)
            preds = (probs >= 0.5).float()
            
            all_logits.append(logits.cpu().numpy())
            all_predictions.append(preds.cpu().numpy())

    y_logits = np.concatenate(all_logits).ravel()
    y_pred = np.concatenate(all_predictions).ravel()

    return y_logits, y_pred
```

**Pre-Trained MLP with ReLU Activation**


```python
import torch
import torch.nn as nn
torch.manual_seed(42)

class SimpleMLP(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.fc1   = nn.Linear(input_size, hidden_size)
        self.fc2   = nn.Linear(hidden_size, hidden_size)
        self.fc3   = nn.Linear(hidden_size, output_size)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x) 
        return x

mlp_relu = SimpleMLP(155, 360, 1).to(device)
state_dict_relu = torch.load(
    "models/mlp_relu_weights.pt",
    map_location=device,
    weights_only=True
)
mlp_relu.load_state_dict(state_dict_relu)
y_logits_relu, y_pred_relu = predict(mlp_relu, test_loader, device=device)
```

#### Checkpoint 1/3

Re-create the previous MLP architecture similarly with three fully connected layers, except replace the ReLU activation layers with **GELU activation layers**.

**A.** Initialize a GELU activation layer named `gelu`. In the forward pass, be sure to apply the GELU activations similarly in the following order:
- First layer → GELU activation → second layer → GELU activation → third layer → output.

**B.** Instantiate the model to the variable `mlp_gelu` with an input feature size of `155`, a hidden layer size of `360`, and an output size of `1`.

**C.** Load the pre-trained weights (from a model we've trained) saved in `"models/mlp_gelu_weights.pt"` into `state_dict_gelu` and into the model.

**D.** Generate predictions with the `predict` function. Save the output logits to `y_logits_gelu` and predicted labels to `y_pred_gelu`. Be sure to specify the device from the setup cell.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import torch
import torch.nn as nn
torch.manual_seed(42)

## YOUR SOLUTION HERE ##
class SimpleMLP_GELU(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.fc1   = nn.Linear(input_size, hidden_size)
        self.fc2   = nn.Linear(hidden_size, hidden_size)
        self.fc3   = nn.Linear(hidden_size, output_size)
        self.gelu = nn.GELU()

    def forward(self, x):
        x = self.gelu(self.fc1(x))
        x = self.gelu(self.fc2(x))
        x = self.fc3(x)
        return x

input_features = 155
hidden_neurons = 360
output_classes = 1

mlp_gelu = SimpleMLP_GELU(input_features, hidden_neurons, output_classes).to(device)
state_dict_gelu = torch.load(
    "models/mlp_gelu_weights.pt",
    map_location=device,
    weights_only=True
)
mlp_gelu.load_state_dict(state_dict_gelu)

y_logits_gelu, y_pred_gelu = predict(mlp_gelu, test_loader, device=device)
```

#### Checkpoint 2/3

Re-create the previous MLP architecture similarly with three fully connected layers, except add additional **BatchNorm** layers after the first and second linear layers. Use **ReLU** activation. 

**A.** After the first linear layer `fc1`, add a BatchNorm layer named `bn1`. After the second linear layer `fc2`, add another BatchNorm layer named `bn2`. 

In the forward pass, be sure to apply the transformations in the following order:
- 1st linear layer → 1st BatchNorm → ReLU activation → 2nd linear layer → 2nd BatchNorm → ReLU activation → 3rd linear layer → output.

**B.** Instantiate the model to the variable `mlp_batchnorm` with an input feature size of `155`, a hidden layer size of `360`, and an output size of `1`.

**C.** Load the pre-trained weights (from a model we've trained) saved in `"models/mlp_batchnorm_weights.pt"` into `state_dict_batchnorm` and into the model.

**D.** Generate predictions with the `predict` function. Save the output logits to `y_logits_batchnorm` and predicted labels to `y_pred_batchnorm`. Be sure to specify the device from the setup cell.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
import torch
import torch.nn as nn
torch.manual_seed(42)

## YOUR SOLUTION HERE ##
class SimpleMLP_BN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.fc1 = nn.Linear(input_size, hidden_size, bias=False)
        self.bn1 = nn.BatchNorm1d(hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size, bias=False)
        self.bn2 = nn.BatchNorm1d(hidden_size)
        self.fc3 = nn.Linear(hidden_size, output_size)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.bn1(self.fc1(x)))
        x = self.relu(self.bn2(self.fc2(x)))
        x = self.fc3(x)
        return x
        
input_features = 155
hidden_neurons = 360
output_classes = 1

mlp_batchnorm = SimpleMLP_BN(input_features, hidden_neurons, output_classes).to(device)
state_dict_batchnorm = torch.load(
    "models/mlp_batchnorm_weights.pt",
    map_location=device,
    weights_only=True
)
mlp_batchnorm.load_state_dict(state_dict_batchnorm)
y_logits_batchnorm, y_pred_batchnorm = predict(mlp_batchnorm, test_loader, device=device)
```

#### Checkpoint 3/3

Let's evaluate and compare each model by calculating **a)** the overall accuracy and **b)** classification reports to the following variables, respectively:

- MLP with ReLU: `accuracy_relu` and `report_relu`
- MLP with GELU: `accuracy_gelu` and `report_gelu`
- MLP with BatchNorm: `accuracy_batchnorm` and `report_batchnorm`

**Note:** For each classification report, add the parameter `output_dict=True` to format the output.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
from sklearn.metrics import accuracy_score, classification_report

## YOUR SOLUTION HERE ##
# ReLU
accuracy_relu = accuracy_score(y_true, y_pred_relu)
report_relu = classification_report(
    y_true,
    y_pred_relu,
    target_names=["Not Canceled", "Canceled"],
    output_dict=True
)
# GELU
accuracy_gelu = accuracy_score(y_true, y_pred_gelu)
report_gelu = classification_report(
    y_true,
    y_pred_gelu,
    target_names=["Not Canceled", "Canceled"],
    output_dict=True
)
# BatchNorm
accuracy_batchnorm = accuracy_score(y_true, y_pred_batchnorm)
report_batchnorm = classification_report(
    y_true,
    y_pred_batchnorm,
    target_names=["Not Canceled", "Canceled"],
    output_dict=True
)

# Show output - Compare Model Performances
reports = {"ReLU": report_relu, "GELU": report_gelu, "BatchNorm": report_batchnorm}
results = {model: {"Accuracy": report["accuracy"],
                   "Precision (Canceled)": report["Canceled"]["precision"],
                   "Recall (Canceled)": report["Canceled"]["recall"],
                   "F1 (Canceled)": report["Canceled"]["f1-score"],}
    for model, report in reports.items()}

compare_df = pd.DataFrame(results).T
compare_df.round(6)
```

**Summary**

- **ReLU**: Best precision, weakest recall.
- **GELU**: Similar to ReLU, but slightly better F1 score.
- **BatchNorm**: Highest overall accuracy and F1 score, sacrifices precision but gains more recall.

Based on each performance, we'll consider the MLP with BatchNorm layers to have the best overall performance on our classification task to predict hotel cancellations.


#### Optional Checkpoint

Let's profile each model size and latencies.


```python
from custom_torchinfo import custom_summary

def model_size_bytes(model):
    """Return model size in bytes (params + buffers)."""
    model_params = list(model.parameters()) + list(model.buffers())
    size = 0
    for t in model_params:
        size += t.numel() * t.element_size()
    return size

# Show output
print("\nMLP with ReLU activation:")
custom_summary()
size_bytes = 
print(f"[Model Size] {size_bytes:,} bytes ~ {size_bytes / (1024**2):.3f} MB")

print("\nMLP with GELU activation:")
custom_summary()
size_bytes = 
print(f"[Model Size] {size_bytes:,} bytes ~ {size_bytes / (1024**2):.3f} MB")

print("\nMLP with BatchNorm Layers:")
custom_summary()
size_bytes =
print(f"[Model Size] {size_bytes:,} bytes ~ {size_bytes / (1024**2):.3f} MB")
```

**Measure Latency for Each Model**


```python
# Create test batches -- DO NOT MODIFY
x1 = X_test[0].unsqueeze(0)

import time

def measure_latency(model, x, iters=50):
    """Return average latency (ms) per forward pass."""
    model.eval()
    start = time.perf_counter()
    with torch.inference_mode():
        for _ in range(iters):
            _ = model(x)
            if x.device.type == "cuda":
                torch.cuda.synchronize()
    elapsed = time.perf_counter() - start
    return (elapsed / iters) * 1e3  # ms

latency_relu = 
latency_gelu = 
latency_batchnorm = 

# Show output
print(f"[ReLU Latency] {latency_relu:.3f} ms per forward pass")
print(f"[GELU Latency] {latency_gelu:.3f} ms per forward pass")
print(f"[BatchNorm Latency] {latency_batchnorm:.3f} ms per forward pass")
```

We expect that the MLP with BatchNorm will have the highest latency because BatchNorm is an extra layer (with more parameters) that does more work transforming the data. 

While GELU is a bit more mathematically complex than ReLU activation, they should have similar latencies. It's worth noting that choosing activation functions is usually made for accuracy reasons rather than speed.

Note that you may get varying results due to noise, no warm-up, background processes, etc.


```python
import gc, torch

del mlp_relu, mlp_gelu, mlp_batchnorm 
gc.collect()
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()
    torch.cuda.synchronize()
```


```python

```
