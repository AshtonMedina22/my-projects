<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!
    
[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:
    
1. Add your solution to the cell with `## YOUR SOLUTION HERE ## `.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
4. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)

**Setup** Run the following cell to import libraries and helper function.


```python
import torch
import torch.nn as nn
torch.manual_seed(42)
import pandas as pd
import numpy as np
from torch.utils.data import TensorDataset, DataLoader
```

In this exercise, we'll predict the next day's closing **price change** (`TargetDelta`) for sequences in the testing set.

We've loaded the testing set into the following variables:
- `spy_test_df`: The original test set with pricing and technical data.
- `features`: The unlagged feature names.
- `spy_test_seq_df`: The 24-day lagged test set.
- `spy_test_seq_df_scaled`: Normalized version of the test set using a pre-trained `scaler`. 
- `lagged_features`: The 24-day lagged feature names.
- `test_loader`: The test set dataloader, unshuffled, with batch size 128.


```python
def make_lag_df(df, feature_cols, window=14):
    out = {}
    for col in feature_cols:
        s = df[col]
        for lag in range(window, 0, -1):
            out[f"{col}_t-{lag}"] = s.shift(lag)
    df_seq = pd.DataFrame(out, index=df.index).dropna()
    return df_seq

def df_to_loader(df_seq, feature_cols, lagged_feature_cols, target_col="TargetDelta",
                 window=14, batch_size=128, shuffle=False):

    # Create input feature sequences X with shape (N, T, F)
    Xflat = torch.tensor(df_seq[lagged_feature_cols].to_numpy(), dtype=torch.float32) 
    N = Xflat.shape[0]
    T = window
    F = len(features)
    X = Xflat.view(N, T, F)

    # Create targets y with shape (N, 1)
    y = torch.tensor(df_seq[target_col].to_numpy(), dtype=torch.float32).unsqueeze(1) 

    # Create TensorDataset and DataLoader
    dataset = TensorDataset(X, y)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
    return loader

# Load testing set
spy_test_df = pd.read_csv("datasets/spy_test.csv", index_col="Date")

features = ['Open', 'High', 'Low', 'Close', 'Volume', 'sma_10', 'ema_20', 'rsi_14',
       'macd', 'macd_signal', 'macd_hist', 'atr_14', 'bb_upper', 'bb_lower']

spy_test_seq_df = make_lag_df(spy_test_df, features, window=24)
lagged_features = spy_test_seq_df.columns

import joblib
scaler = joblib.load("models/scaler_spy.pkl")
spy_test_seq_df_scaled = pd.DataFrame(scaler.transform(spy_test_seq_df), 
                                      index=spy_test_seq_df.index, 
                                      columns=spy_test_seq_df.columns)

spy_test_seq_df_scaled["TargetDelta"] = spy_test_df.loc[spy_test_seq_df_scaled.index, "TargetDelta"].astype("float32")

test_loader = df_to_loader(spy_test_seq_df_scaled, 
                            feature_cols=features,
                            lagged_feature_cols=lagged_features,
                            target_col="TargetDelta",
                            window=24,
                            batch_size=128, 
                            shuffle=False,)

spy_test_df.round(2).head()
```

#### Checkpoint 1/3

We've implemented the RNN class from the narrative and loaded pre-trained weights (that we trained internally similarly to how we trained the MLPs and CNNs). 

Implement **GRU** and **LSTM** variants similarly:

**A.** Finish the `SimpleGRU` class by implementing a GRU layer with the following parameters: `input_size`, `hidden_size`, `num_layers`, and setting `batch_first=True`.

**B.** Finish the `SimpleLSTM` class by implementing an LSTM layer with the following parameters: `input_size`, `hidden_size`, `num_layers`, and setting `batch_first=True`.

**C.** Instantiate a GRU model to the variable `gru` and load the pre-trained weights from the path `GRU_PATH = "models/gru_spy_state.pt"`. Be sure to set the input size to `14`, hidden size to `128`, number of layers to `2`, the correct device, and `weights_only=True`.

**D.** Instantiate an LSTM model to the variable `lstm` and load the pre-trained weights from the path `LSTM_PATH = "models/lstm_spy_state.pt"`. Be sure to set the input size to `14`, hidden size to `128`, number of layers to `2`, the correct device, and `weights_only=True`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class SimpleRNN(nn.Module):
    def __init__(self, input_size=14, hidden=64, num_layers=2):
        super().__init__()
        self.rnn = nn.RNN(input_size=input_size, 
                          hidden_size=hidden, 
                          num_layers=num_layers, 
                          batch_first=True)
        self.fc = nn.Linear(hidden, 1)

    def forward(self, x):
        out, _ = self.rnn(x)           
        return self.fc(out[:, -1, :])   
        
## YOUR SOLUTION HERE ##
class SimpleGRU(nn.Module):
    def __init__(self, input_size=14, hidden=64, num_layers=2):
        super().__init__()
        self.gru = nn.GRU(input_size=input_size,
                          hidden_size=hidden,
                          num_layers=num_layers,
                          batch_first=True)
        
        self.fc = nn.Linear(hidden, 1)
        
    def forward(self, x):
        out, _ = self.gru(x)          
        return self.fc(out[:, -1, :]) 

class SimpleLSTM(nn.Module):
    def __init__(self, input_size=14, hidden=64, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_size=input_size,
                            hidden_size=hidden,
                            num_layers=num_layers,
                            batch_first=True)
        
        self.fc = nn.Linear(hidden, 1)
        
    def forward(self, x):
        out, _ = self.lstm(x)         
        return self.fc(out[:, -1, :]) 

# Instantiate models + pre-trained weights
RNN_PATH = "models/rnn_spy_state.pt"
GRU_PATH  = "models/gru_spy_state.pt"
LSTM_PATH = "models/lstm_spy_state.pt"

rnn = SimpleRNN(input_size=14, hidden=128, num_layers=2).to(device)
rnn_state = torch.load(RNN_PATH, map_location=device, weights_only=True)
rnn.load_state_dict(rnn_state)

gru  = SimpleGRU(input_size=14, hidden=128, num_layers=2).to(device)
gru_state = torch.load(GRU_PATH, map_location=device, weights_only=True)
gru.load_state_dict(gru_state)

lstm = SimpleLSTM(input_size=14, hidden=128, num_layers=2).to(device)
lstm_state = torch.load(LSTM_PATH, map_location=device, weights_only=True)
lstm.load_state_dict(lstm_state)
```

#### Checkpoint 2/3

**A.** Let's create a function named `predict` that generates predictions for the testing set sequences.

The function takes in two inputs: `model` and `dataloader`: 
- Set the model to evaluation mode.
- Initialize an empty list named `batch_preds` to store the batched predictions.
- Loop through each batch in the dataloader and **1)** move each batch to the device, **2)** pass each batch through the forward pass, **3)** move the predictions back to CPU and into numpy arrays, and **4)** collect the batched predictions into the variable `y_preds`.

The function should return the collected predictions in `y_preds`.

**B.** Use the function to generate predictions for each model (`rnn`, `gru`, and `lstm`) on the testing set loaded into `test_loader`. Save the RNN predictions to `rnn_preds`, GRU predictions to `gru_preds`, and LSTM predictions to `lstm_preds`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
def predict(model, dataloader):
    model.eval()
    batch_preds = []
    with torch.no_grad():
        for X_batch, y_batch in dataloader:
            X_batch = X_batch.to(device)
            batch_pred = model(X_batch)
            batch_pred = batch_pred.cpu().numpy()
            batch_preds.append(batch_pred)
    y_preds = np.concatenate(batch_preds, axis=0).ravel()
    return y_preds

rnn_preds = predict(rnn, test_loader)
gru_preds = predict(gru, test_loader)
lstm_preds = predict(lstm, test_loader)

# Show output - Test set MSE performance
from sklearn.metrics import mean_squared_error
y_true = spy_test_df["TargetDelta"][:-24].values
mse_rnn  = mean_squared_error(y_true, rnn_preds)
mse_gru  = mean_squared_error(y_true, gru_preds)
mse_lstm = mean_squared_error(y_true, lstm_preds)

print("=== Test Performance ===")
print(f"RNN  MSE: {mse_rnn:.6f}")
print(f"GRU  MSE: {mse_gru:.6f}")
print(f"LSTM MSE: {mse_lstm:.6f}")
```

How would you interpret and compare the test set MSE scores for each model?

#### Checkpoint 3/3

Let's turn our model's predictions into something more useful. Remember, we've trained the model to predict `TargetDelta`, which is the difference between the current and previous day's closing price. 

To get the actual predicted close, we'll do this by adding the `TargetDelta` predictions to the previous day's closing price.

```md
Predicted Next Close = Previous Close + Predicted TargetDelta
```

Let's calculate the actual predicted next-day close for the most recent prediction for each model. We've collected the most recent predictions for each model in the variables `pred_delta_rnn`, `pred_delta_gru`, and `pred_delta_lstm`. The previous close is saved to the variable `prev_close`.

Save the actual predicted next-day close for each model to the variables `pred_next_close_rnn`, `pred_next_close_gru`, and `pred_next_close_lstm`, respectively.


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
# Obtain the most recent prediction
pred_delta_rnn  = rnn_preds[-1]
pred_delta_gru  = gru_preds[-1]
pred_delta_lstm = lstm_preds[-1]

# Use delta + prev close price to calculate the new predicted close price
prev_close = float(spy_test_df["Close"].iloc[-1])  
actual_close = float(spy_test_df["Target"].iloc[-1]) 

## YOUR SOLUTION HERE ##
pred_next_close_rnn  = prev_close + pred_delta_rnn
pred_next_close_gru  = prev_close + pred_delta_gru
pred_next_close_lstm = prev_close + pred_delta_lstm

# Show output - Predicted next-day close
print(f"Previous Close:       ${prev_close:.2f}")
print(f"RNN:  Pred Δ Close:    {pred_delta_rnn:+.2f}  | Next Close: ${pred_next_close_rnn:.2f}")
print(f"GRU:  Pred Δ Close:    {pred_delta_gru:+.2f}  | Next Close: ${pred_next_close_gru:.2f}")
print(f"LSTM: Pred Δ Close:    {pred_delta_lstm:+.2f} | Next Close: ${pred_next_close_lstm:.2f}")
print(f"Actual Close:         ${actual_close:.2f}")
```

Let's interpret the last prediction:

- The RNN missed the direction and predicted a negative return.
- The GRU missed the direction, but with less magnitude than the RNN
- The LSTM predicted the correct direction, but also overestimated the magnitude.

**Disclaimer**: This is for educational purposes only. It is **not** financial advice, and the models we build are not intended for real trading or investment decisions. Always consult a financial professional before making investment choices, and trade at your own risk.


```python

```
