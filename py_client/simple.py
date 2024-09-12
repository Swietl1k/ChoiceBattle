import requests 


endpoint1 = 'http://localhost:8000/strona/find_category/Sports?xd=1'
endpoint2 = 'http://localhost:8000/strona/get_game_by_id/effdggdfgdh/'
endpoint3 = 'http://localhost:8000/strona/login/'


get_response = requests.post(endpoint3, json={"email": "test@test.com", "password": "test", "user_name": "test_test"})

print(type(get_response))

print(f"Status code: {get_response.status_code}")
#print(f"Text Response: {get_response.text}")
print(f"JSON Response: {get_response.json()}")
