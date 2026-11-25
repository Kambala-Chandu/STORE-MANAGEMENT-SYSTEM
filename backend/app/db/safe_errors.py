"""Sanitized database error details suitable for local diagnostic output."""

import re


def sanitized_database_error(
    exc: Exception, secrets_to_redact: tuple[str, ...]
) -> tuple[str, object, str]:
    original = getattr(exc, "orig", exc)
    args = getattr(original, "args", ())
    code = args[0] if args and isinstance(args[0], int) else "not available"
    reason = args[1] if len(args) > 1 else str(original)
    reason = str(reason)
    reason = re.split(r"\n\s*\[(?:SQL|parameters):", reason, maxsplit=1)[0]
    reason = re.sub(
        r"[a-zA-Z][a-zA-Z0-9+.-]*://[^\s]+",
        "<connection-string-redacted>",
        reason,
    )
    reason = re.sub(
        r"(?i)(password|passwd|pwd)\s*[=:]\s*[^\s,;]+",
        r"\1=<redacted>",
        reason,
    )
    for value in secrets_to_redact:
        if value:
            reason = reason.replace(value, "<redacted>")
    reason = " ".join(reason.split())[:500] or "No additional reason supplied"
    return type(original).__name__, code, reason
