"""AI analysis service (owned by Member 2 - features/ai).

Calls an LLM (OpenAI or Gemini, whichever key is set) to recommend a
category, priority, and short summary for a ticket. If no API key is
configured, falls back to a simple keyword-based mock so the rest of the
app keeps working during setup/demo.

The AI API key is only ever used here, on the backend. It must never be
sent to or exposed in the frontend.
"""
import json
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

VALID_CATEGORIES = ["Hardware", "Software", "Network", "Account Access", "Security", "Other"]
VALID_PRIORITIES = ["Low", "Medium", "High", "Critical"]

SYSTEM_PROMPT = (
    "You are an IT support triage assistant. Given a ticket title and "
    "description, respond ONLY with JSON in this exact shape: "
    '{"category": "...", "priority": "...", "summary": "..."}. '
    f"category must be one of {VALID_CATEGORIES}. "
    f"priority must be one of {VALID_PRIORITIES}. "
    "summary must be a short (max 15 words) one-line summary of the issue."
)


def _mock_analyze(title: str, description: str) -> dict:
    """Keyword-based fallback so the app works without an AI API key."""
    text = f"{title} {description}".lower()

    if any(word in text for word in ["password", "login", "account", "locked out", "access"]):
        category = "Account Access"
    elif any(word in text for word in ["wifi", "network", "internet", "vpn", "connect"]):
        category = "Network"
    elif any(word in text for word in ["virus", "phishing", "hack", "breach", "malware"]):
        category = "Security"
    elif any(word in text for word in ["laptop", "monitor", "printer", "mouse", "keyboard", "device"]):
        category = "Hardware"
    elif any(word in text for word in ["software", "app", "install", "update", "crash", "bug"]):
        category = "Software"
    else:
        category = "Other"

    if any(word in text for word in ["urgent", "critical", "down", "breach", "not working at all"]):
        priority = "Critical"
    elif any(word in text for word in ["important", "asap", "blocked"]):
        priority = "High"
    elif any(word in text for word in ["minor", "small", "whenever"]):
        priority = "Low"
    else:
        priority = "Medium"

    summary = title.strip()
    if len(summary) > 80:
        summary = summary[:77] + "..."

    return {"category": category, "priority": priority, "summary": summary}


def _call_openai(title: str, description: str) -> dict:
    from openai import OpenAI

    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Title: {title}\nDescription: {description}"},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


def _call_gemini(title: str, description: str) -> dict:
    import google.generativeai as genai

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"{SYSTEM_PROMPT}\n\nTitle: {title}\nDescription: {description}"
    response = model.generate_content(prompt)
    text = response.text.strip().strip("```json").strip("```").strip()
    return json.loads(text)


def analyze_ticket(title: str, description: str) -> dict:
    """Return {category, priority, summary} for a ticket, validated against
    the allowed values. Falls back to a mock if no AI key is set or the
    AI call fails for any reason (keeps the demo resilient)."""
    result = None

    try:
        if OPENAI_API_KEY:
            result = _call_openai(title, description)
        elif GEMINI_API_KEY:
            result = _call_gemini(title, description)
    except Exception:
        result = None

    if not result:
        result = _mock_analyze(title, description)

    category = result.get("category") if result.get("category") in VALID_CATEGORIES else "Other"
    priority = result.get("priority") if result.get("priority") in VALID_PRIORITIES else "Medium"
    summary = result.get("summary") or title

    return {"category": category, "priority": priority, "summary": summary}
