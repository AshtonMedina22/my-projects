# Finetuning Transformers with Hugging Face: Finetuning BERT with QLoRA

## Checkpoint 1/4

Configure BitsAndBytes for 4-bit quantization.

```python
config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
)
```

## Checkpoint 2/4

Load the quantized BERT model, configure LoftQ, and prepare the model for k-bit training.

```python
model = AutoModelForSequenceClassification.from_pretrained(
    "prajjwal1/bert-tiny",
    num_labels=2,
    quantization_config=config
)

loftq_config = LoftQConfig(loftq_bits=4)
model = prepare_model_for_kbit_training(model)
```

## Checkpoint 3/4

Create the LoRA config with the LoftQ config included.

```python
peft_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    inference_mode=False,
    loftq_config=loftq_config,
    r=16,
    lora_alpha=32,
    lora_dropout=0.1
)
```

## Checkpoint 4/4

Train and evaluate the QLoRA model with Hugging Face Trainer.

```python
trainer = Trainer(
    model=qlora_model,
    args=training_args,
    train_dataset=tokenized_training_set,
    eval_dataset=tokenized_test_set
)

trainer.train()
trainer.evaluate()
```
