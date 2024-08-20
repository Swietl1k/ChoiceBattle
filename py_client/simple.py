import requests

endpoint = 'http://localhost:8000/strona/logout/'

get_response = requests.post(endpoint, json={"email": "grzegorz@braun.com", "password": "korona"})

print(f"Status code: {get_response.status_code}")
print(f"JSON Response: {get_response.json()}")