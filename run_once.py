# run_once.py — run this ONE time only

import requests

resp = requests.post("https://accounts.zoho.in/oauth/v2/token", data={
    "grant_type":    "authorization_code",
    "client_id":     "CLIENT_ID",
    "client_secret": "CLIENT_SECRET",
    "code":          "1000.2f90289c589e1e20209c35770ad43659.430d12c201e59372313ced55ffb522ba",    # fresh one from api-console
    "redirect_uri":  "http://localhost"
})

data = resp.json()
print("Access Token:", data["access_token"])
print("Refresh Token:", data["refresh_token"])  # SAVE THIS — never expires