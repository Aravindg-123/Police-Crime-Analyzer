import requests

CLIENT_ID     = "1000.YBN8BVT8UPMLDENGX3QEC1XRKN1BXY"
CLIENT_SECRET = "567391c6a10b15702e49c2380dc66c81159a9b10f0"
REFRESH_TOKEN = "1000.f85cd44a938740dfa96b984e76343e38.93ad569c415da2ef1afe1978f6290a47"    # from step 1 output


def get_access_token():
    resp = requests.post("https://accounts.zoho.in/oauth/v2/token", data={
        "grant_type":    "refresh_token",
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN
    })
    data = resp.json()
    if "access_token" not in data:
        print("Token error:", data)
        return None
    return data["access_token"]

def ask_llm(user_message: str, token: str) -> str:
    headers = {
        "CATALYST-ORG":  "60073746333",
        "Authorization": f"Zoho-oauthtoken {token}",
        "Content-Type":  "application/json"
    }

    # Include the user's message in the prompt, plus a system instruction.
    full_prompt = f"Answer every question directly and factually.\n\nQuestion: {user_message}\nAnswer:"
    payload = {
        "model": "crm-di-qwen_coder_7b-it",
        "prompt": full_prompt,          # Now it's dynamic!
        "top_p": 0.95,
        "top_k": 120,
        "max_tokens": 1000,
        "temperature": 1
    }

    resp = requests.post(
        "https://api.catalyst.zoho.in/quickml/v2/project/47096000000013025/llm/chat",
        headers=headers,
        json=payload
    )

    if resp.status_code == 200:
        full = resp.json()["response"]
        # Remove 
        if "</think>" in full:
            return full.split("</think>")[-1].strip()
        return full.strip()
    else:
        return f"Error {resp.status_code}: {resp.text}"

# Get token once at startup
TOKEN = get_access_token()
if TOKEN is None:
    print("Failed to obtain access token. Exiting.")
    exit(1)

print(ask_llm("What is machine learning?", TOKEN))
print(ask_llm("What are the planets in the solar system?", TOKEN))
print(ask_llm("Summarise the water cycle in 2 sentences.", TOKEN))

quest = input("Enter Question:")
print(ask_llm(quest,TOKEN))
