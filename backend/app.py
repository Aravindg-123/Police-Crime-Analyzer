from flask import Flask, request, jsonify, send_from_directory
import requests
import os

app = Flask(__name__)

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
REFRESH_TOKEN = os.environ.get('REFRESH_TOKEN')
CATALYST_ORG  = "60073746333"
LLM_ENDPOINT  = "https://api.catalyst.zoho.in/quickml/v2/project/47096000000013025/llm/chat"
MODEL         = "crm-di-qwen_coder_7b-it"

access_token = None

def get_access_token():
    global access_token
    resp = requests.post("https://accounts.zoho.in/oauth/v2/token", data={
        "grant_type":    "refresh_token",
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN
    })
    data = resp.json()
    if "access_token" in data:
        access_token = data["access_token"]
        return True
    print("Token error:", data)
    return False

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 200

    global access_token
    
    user_message = request.json.get('message', '')
    system_prompt = request.json.get('system_prompt', 'You are a helpful AI assistant. Answer questions directly and factually.')
    
    if not access_token:
        if not get_access_token():
            return jsonify({"error": "Failed to authenticate"}), 401
    
    full_prompt = f"Answer every question directly and factually.\n\nQuestion: {user_message}\nAnswer:"
    
    payload = {
        "model": MODEL,
        "prompt": full_prompt,
        "top_p": 0.95,
        "top_k": 120,
        "max_tokens": 1000,
        "temperature": 0.7
    }
    
    headers = {
        "CATALYST-ORG": CATALYST_ORG,
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json"
    }
    
    resp = requests.post(LLM_ENDPOINT, headers=headers, json=payload)
    
    if resp.status_code == 401:
        if get_access_token():
            headers["Authorization"] = f"Zoho-oauthtoken {access_token}"
            resp = requests.post(LLM_ENDPOINT, headers=headers, json=payload)
    
    if resp.status_code == 200:
        response_text = resp.json().get("response", "")
        if "</think>" in response_text:
            response_text = response_text.split("</think>")[-1].strip()
        return jsonify({"response": response_text})
    else:
        return jsonify({"error": f"Error {resp.status_code}: {resp.text}"}), resp.status_code

@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "authenticated": access_token is not None})

# Fetch token at module load so it's ready regardless of how Flask is started
try:
    get_access_token()
except Exception as e:
    print("Startup token fetch failed:", e)

if __name__ == '__main__':
    port = int(os.environ.get('X_ZOHO_CATALYST_LISTEN_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)