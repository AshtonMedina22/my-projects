# Lesson Notes

## Main Concepts

- Jailbreak detection scans user instructions for suspicious prompt-injection patterns.
- PII leakage detection uses regex to flag emails, phone numbers, and credit-card-like strings in chatbot responses.
- Abuse analysis groups logs by user and identifies users with high request counts or unusually high token usage.
- Safety controls reduce privacy risk, service degradation, and cost attacks.

## Checkpoint Summary

1. Detect jailbreak patterns in `instruction`, flag rows, and count pattern frequency.
2. Detect PII in `response`, calculate leak counts/rate, and print an example.
3. Group by user, flag high-volume or high-token users, and compare abusive vs normal cost impact.

