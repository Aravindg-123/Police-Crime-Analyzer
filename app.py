from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests

app = Flask(__name__, static_folder='static')
CORS(app)

CLIENT_ID     = "1000.YBN8BVT8UPMLDENGX3QEC1XRKN1BXY"
CLIENT_SECRET = "567391c6a10b15702e49c2380dc66c81159a9b10f0"
REFRESH_TOKEN = "1000.f85cd44a938740dfa96b984e76343e38.93ad569c415da2ef1afe1978f6290a47"
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

@app.route('/api/chat', methods=['POST'])
def chat():
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

if __name__ == '__main__':
    get_access_token()
    app.run(debug=True, port=5000)