import hashlib
import re


PII_PATTERNS = {
    "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
    "PHONE": r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
    "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
    "CREDIT_CARD": r"\b(?:\d{4}[\s-]?){3}\d{4}\b",
    "CVV": r"\b(?:CVV|cvv|security code)\s*(?:is|:)?\s*\d{3,4}\b",
    "PIN": r"\b(?:PIN|pin)\s*(?:is|:)?\s*\d{4,6}\b",
    "DOB": r"\b(?:\d{1,2}[/-]){2}\d{2,4}\b",
    "ROUTING_NUMBER": r"\b(?:routing number|routing)\s*(?:is|:)?\s*\d{9}\b",
    "IP_ADDRESS": r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
}


def _hash_value(value: str) -> str:
    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()[:10]
    return f"<HASH:{digest}>"


def remove_pii(text: str, hash_identifiers: bool = False) -> str:
    cleaned = text
    for label, pattern in PII_PATTERNS.items():
        if hash_identifiers and label in {"EMAIL", "PHONE"}:
            replacement = lambda match: _hash_value(match.group(0))
        else:
            replacement = f"<{label}_REDACTED>"
        cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
    return cleaned


if __name__ == "__main__":
    examples = [
        "Email me at john.doe@email.com or call 123-456-7890.",
        "My card is 4532-1234-5678-9010 and CVV is 123.",
        "Routing number is 021000021 and my PIN is 4567.",
    ]
    for text in examples:
        print("Original:", text)
        print("Redacted:", remove_pii(text))
        print("Hashed:", remove_pii(text, hash_identifiers=True))
        print()
