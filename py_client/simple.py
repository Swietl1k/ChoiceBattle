import requests

endpoint = 'http://localhost:8000/strona'

get_response = requests.get(endpoint)

print(get_response.status_code)