# SLM Edge Deployment

Technical moat project spec for quantized small-language-model deployment on local edge hardware.

## Business Pain

Sensitive edge use cases cannot always rely on cloud-hosted models because of latency, cost, or privacy constraints.

## Technical Architecture

- Raspberry Pi 5 target hardware
- Llama.cpp runtime
- Quantized model artifact
- Schema-enforced deterministic JSON output

