import re
from collections import Counter, defaultdict

import numpy as np
import pandas as pd


df = pd.read_csv("customer_support_clean.csv")


# Checkpoint 1
JAILBREAK_PATTERNS = [
    "ignore previous instructions",
    "disregard your programming",
    "act as if you are",
    "pretend you are not an ai",
    "forget your rules",
    "system prompt",
    "new instructions",
]


def detect_jailbreak(text):
    """
    Detect if text contains jailbreak attempt patterns.

    Args:
        text (str): Text to check for jailbreak patterns

    Returns:
        tuple: (has_jailbreak: bool, matched_pattern: str or None)
    """
    if pd.isna(text):
        return False, None

    text_lower = str(text).lower()

    for pattern in JAILBREAK_PATTERNS:
        if pattern in text_lower:
            return True, pattern

    return False, None


df[["has_jailbreak", "jailbreak_pattern"]] = df["instruction"].apply(
    lambda x: pd.Series(detect_jailbreak(x))
)

jailbreak_count = df["has_jailbreak"].sum()
jailbreak_pct = (jailbreak_count / len(df)) * 100


# Checkpoint 2
EMAIL_PATTERN = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
PHONE_PATTERN = r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"
CC_PATTERN = r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b"


def contains_email(text):
    """Check if text contains an email address."""
    if pd.isna(text):
        return False
    return bool(re.search(EMAIL_PATTERN, str(text)))


def contains_phone(text):
    """Check if text contains a phone number."""
    if pd.isna(text):
        return False
    return bool(re.search(PHONE_PATTERN, str(text)))


def contains_credit_card(text):
    """Check if text contains a credit card number."""
    if pd.isna(text):
        return False
    return bool(re.search(CC_PATTERN, str(text)))


df["leaked_email"] = df["response"].apply(contains_email)
df["leaked_phone"] = df["response"].apply(contains_phone)
df["leaked_cc"] = df["response"].apply(contains_credit_card)

df["leaked_pii"] = df[["leaked_email", "leaked_phone", "leaked_cc"]].any(axis=1)

total_responses = len(df)
email_leaks = df["leaked_email"].sum()
phone_leaks = df["leaked_phone"].sum()
cc_leaks = df["leaked_cc"].sum()
total_leaks = df["leaked_pii"].sum()


# Checkpoint 3
user_stats = df.groupby("user_id").agg(
    conversation_count=("user_id", "count"),
    avg_tokens=("tokens_used", "mean"),
    total_cost=("cost", "sum"),
)

high_volume = user_stats["conversation_count"] > 50
excessive_tokens = user_stats["avg_tokens"] > 300

user_stats["is_abusive"] = high_volume | excessive_tokens

abusive_users = user_stats[user_stats["is_abusive"]]
normal_users = user_stats[~user_stats["is_abusive"]]

