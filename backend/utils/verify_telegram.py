import hashlib
import hmac
import os

BOT_TOKEN = os.getenv("BOT_TOKEN")

def verify_telegram_data(init_data: str) -> bool:
    if not BOT_TOKEN:
        raise ValueError("BOT_TOKEN не найден в .env")

    try:
        pairs = [p.split('=') for p in init_data.split('&') if '=' in p]
        data_dict = {k: v for k, v in pairs if k != 'hash'}

        data_check_string = '\n'.join(f"{k}={v}" for k, v in sorted(data_dict.items()))
        secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
        h = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

        hash_value = dict(pairs).get('hash')
        return h == hash_value
    except Exception:
        return False
