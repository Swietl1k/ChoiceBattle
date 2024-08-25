import requests
import pyrebase
import random, string 

config={
    "apiKey": "AIzaSyC2Jg3HI7jpGeukh0EgXmrb11GbBBnWMTQ",
    "authDomain": "stronaww123.firebaseapp.com",
    "databaseURL": "https://stronaww123-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "stronaww123",
    "storageBucket": "stronaww123.appspot.com",
    "messagingSenderId": "358939997824",
    "appId": "1:358939997824:web:73bef249ea412d35f31865",
#    "serviceAccount": "stronaww123-firebase-adminsdk-i25oq-82ae8cdb50.json"
#    "measurementId: "G-PE8N920P01"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

#game_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
#request_body = {"title": "XD", "category": "XDD", "number_of_choices": "XDDD", "description": "XDDDD", "choices_data": [{"title": "Test", "pick_count": 5, "win_count": 1}]}
#db.child("games").child(game_id).set(request_body)
#xd = auth.create_user_with_email_and_password("xd@it.pl", "password")
#print(xd)


endpoint = 'http://localhost:8000/strona/find_category/Sports/'

get_response = requests.get(endpoint, json={"email": "grzegorz@braun.com", "password": "korona"})

print(f"Status code: {get_response.status_code}")
#print(f"JSON Response: {get_response.json()}")
