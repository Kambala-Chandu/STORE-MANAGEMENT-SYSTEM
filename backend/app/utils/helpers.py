from datetime import datetime
import random
import string


def generate_invoice_number() -> str:
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d%H%M")
    suffix = "".join(random.choices(string.digits, k=4))
    return f"INV-{timestamp}-{suffix}"


def generate_purchase_number() -> str:
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d%H%M")
    suffix = "".join(random.choices(string.digits, k=4))
    return f"PO-{timestamp}-{suffix}"
