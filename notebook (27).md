# Finetuning Transformers with Hugging Face: Finetuning BERT with LoRA

## Checkpoint 1/3

Import PEFT helpers and create the LoRA configuration.

```python
from peft import LoraConfig, TaskType, get_peft_model

peft_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    inference_mode=False,  # false in training, true when inferring
    r=16,  # Rank of low-rank matrices
    lora_alpha=32,  # analogous to the learning rate in normal GD
    lora_dropout=0.1  # Dropout rate, helps prevent overfitting
)
```

## Checkpoint 2/3

Create the base model and wrap it with LoRA.

```python
model = AutoModelForSequenceClassification.from_pretrained("prajjwal1/bert-tiny", num_labels=2) 
lora_model = get_peft_model(model, peft_config)
```

## Checkpoint 3/3

Move the LoRA model to the device, build the Trainer, train, and evaluate.

```python
## YOUR SOLUTION HERE ##
# put the model on the GPU
lora_model.to(device)

trainer = Trainer(
    model=lora_model,
    args=training_args,
    train_dataset=tokenized_training_set,
    eval_dataset=tokenized_test_set
)

## YOUR SOLUTION HERE ##
trainer.train()
trainer.evaluate()
```
