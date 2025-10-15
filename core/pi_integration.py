import os
import requests
from dotenv import load_dotenv

load_dotenv()

PI_API_URL = os.getenv("PI_API_URL")
APP_ACCESS_TOKEN = os.getenv("PI_APP_ACCESS_TOKEN")

def create_payment(uid, amount, memo="Test Payment"):
    """Gọi API Pi để tạo yêu cầu thanh toán."""
    url = f"{PI_API_URL}/payments"
    headers = {
        "Authorization": f"Key {APP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "amount": amount,
        "memo": memo,
        "metadata": {"purpose": "demo"},
        "uid": uid,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
