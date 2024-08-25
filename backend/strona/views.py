import time
import pyrebase
import random, string
import requests
import json

from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from firebase_admin import auth
from datetime import datetime
from zoneinfo import ZoneInfo
from .forms import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
 


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
storage = firebase.storage()



@api_view(["POST"])
def logout(request):
    try:
        print("Logging out user:", request.session.get("user_name"))
        request.session.pop("user_id", None)
        request.session.pop("user_email", None)
        request.session.pop("user_name", None)
        
        return Response({
            "success": True,
            "message": "LOGGED OUT SUCCESSFULLY"
        }, status=status.HTTP_200_OK)

    except KeyError as e:
        
        return Response({
            "success": False,
            "message":"LOGOUT ERROR"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["POST"])
def register(request):
    user_name = request.session.get("user_name")

    '''
    request_body structure:
    {
        "email": <string: example>
        "password": <string: example>
        "user_name": <string: example>
    } 
    '''
    
    request_body = request.data
    email = request_body.get("email")
    password = request_body.get("password")
    user_name = request_body.get("user_name")

    request.session["user_name"] = user_name

    try:
        auth_response = auth.create_user_with_email_and_password(email, password)
        user_id = auth_response["localId"]
        user_name = db.child("users").child(user_id).child("user_name").set(user_name)
        
        request.session["user_id"] = user_id
        request.session["user_name"] = user_name
        request.session["user_email"] = email

        Response({
            "success": True,
            "message": "USER ACCOUNT CREATED SUCCESSFULLY"
        }, status=status.HTTP_200_OK)
    
    except Exception as e:

        return Response({
            "success": False,
            "error": "SIGN IN ERROR",
        }, status=status.HTTP_400_BAD_REQUEST)
        


@api_view(["POST"]) # this line gives the same effect as: if request.method == "POST"; login() function accepts only requests with POST method
def login(request):
    user_name = request.session.get("user_name")
    
    '''
    request_body structure:
    {
        email: <string: example@email.com>
        password: <string: example>
    }
    
    '''
    
    request_body = request.data
    typ = type(request_body)

    request_body = {key.lower(): value for key, value in request_body.items()}

    email = request_body.get("email")
    password = request_body.get("password")
    
    if not email or not password:
        return Response({
            "success": False,
            "message": "EMAIL AND PASSWORD KEYS ARE REQUIRED",            
            }, status=status.HTTP_400_BAD_REQUEST)

    try:
        auth_response = auth.sign_in_with_email_and_password(email, password)
        user_id = auth_response["localId"]
        user_name = db.child("users").child(user_id).child("user_name").get().val()
        
        request.session["user_id"] = user_id
        request.session["user_name"] = user_name
        request.session["user_email"] = email
        
        return Response({
            "success": True,
            "message": "LOGGED IN SUCCESSFULLY"
        }, status=status.HTTP_200_OK) 
        
    except requests.exceptions.HTTPError as e:
        
        return Response({
            "success": False,
            "error": "INVALID LOGIN CREDENTIALS",
        }, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])        
def create(request):
    user_name = request.session.get("user_name")

    '''
    fetching request_body (json string) from client request and convert it to dict; 
    request_body structure: 
    {
        "title": <string: example>, 
        "category": <string: example>, 
        "number_of_choices": <int: example>, 
        "description": <string: example>, 
        "choices_data": [{
                            "title": <string: example>, 
                            "photo_url": <string: example>, 
                            "pick_count": <int: example>, 
                            "win_count": <int: example>
                        }]
    }
    '''
    
    request_body = json.loads(request.data) # json string to dict conversion

    game_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    poland_time = datetime.now(ZoneInfo("Europe/Warsaw"))
    formatted_time = poland_time.strftime("%Y-%m-%d %H:%M:%S %Z%z")
    user_id = request.session.get("user_id") 
    play_count = 0

    request_body.upadate({
            "date": formatted_time,
            "user_id": user_id,
            "play_count": play_count
        })

    try:
        db.child("games").child(game_id).set(request_body)

        return Response({
            "success": True,
            "message": "GAME DATA ALLOCATED IN DATABASE SUCCESSFULLY"
        }, status=status.HTTP_200_OK) 

    except Exception as e:

        return Response({
            "success": False,
            "error": "DATABASE WRITE ERROR",
        }, status=status.HTTP_400_BAD_REQUEST)
 


@api_view(["GET"])
def find_category(request, category):
    user_name = request.session.get("user_name")

    if not category == "all":
        try:
            games_from_category = db.child("games").order_by_child("category").equal_to(category).get().val()
            games_from_category_list = list(games_from_category.items())
        
        except Exception as e:
            print("Exception: ", e)
            
            return Response({
            "success": False,
            "error": f"DATABASE READ ERROR FROM {category}",
        }, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        try:
            games_from_caregory = db.child("games").get.val()
            games_from_category_list = list(games_from_caregory.items())
        
        except Exception as e:
            print("Exception: ", e)

            return Response({
            "success": False,
            "error": f"DATABASE READ ERROR FROM {category}",
        }, status=status.HTTP_400_BAD_REQUEST)

    paginator = Paginator(games_from_category_list, 2)  # 2 items per page
    page_number = request.query_params.get("page", 1)  # Get the page number from the request, default is 1
    page_obj = paginator.get_page(page_number)

    response_data = {
        'user_name': user_name, 
        'category': category, 
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_number,
        'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
        'previous_page': page_obj.previous_page_number() if page_obj.has_previous() else None,
        'results': dict(page_obj.object_list),
    }    

    Response(response_data, status=status.HTTP_200_OK)



def play(request, game_id):
    username = request.session.get('user_name')
    game_data = db.child("games").child(game_id).get().val()
    number_of_choices = int(game_data["number_of_choices"])
    storage = firebase.storage()

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'button_img1':
            winner = request.session.get(f'img1_number_{game_id}', None)
            current_round = request.session.get(f'current_round_{game_id}', 0)
            current_stage = request.session.get(f'current_stage_{game_id}', 0)

            winner_list = request.session.get(f'stage_{current_stage}_winner_{game_id}', [])
            winner_list.append(winner)
            request.session[f'stage_{current_stage}_winner_{game_id}'] = winner_list

            pick_count = db.child("games").child(game_id).child("choice_data").child(winner).child("pick_count").get().val()
            pick_count += 1
            db.child("games").child(game_id).child("choice_data").child(winner).child("pick_count").set(pick_count)

            request.session.pop(f'img1_number_{game_id}', None) 
            request.session.pop(f'img2_number_{game_id}', None) 
            current_round += 1
            request.session[f'current_round_{game_id}'] = current_round 

            return redirect('play', game_id=game_id)
        
        if action == 'button_img2':
            winner = request.session.get(f'img2_number_{game_id}', None)
            current_round = request.session.get(f'current_round_{game_id}', 0)
            current_stage = request.session.get(f'current_stage_{game_id}', 0)

            winner_list = request.session.get(f'stage_{current_stage}_winner_{game_id}', [])
            winner_list.append(winner)
            request.session[f'stage_{current_stage}_winner_{game_id}'] = winner_list

            pick_count = db.child("games").child(game_id).child("choice_data").child(winner).child("pick_count").get().val()
            pick_count += 1
            db.child("games").child(game_id).child("choice_data").child(winner).child("pick_count").set(pick_count)

            request.session.pop(f'img1_number_{game_id}', None) 
            request.session.pop(f'img2_number_{game_id}', None) 
            current_round += 1
            request.session[f'current_round_{game_id}'] = current_round 

            return redirect('play', game_id=game_id)
    
    if request.session.get(f'is_game_start_{game_id}', False):
        request.session.pop(f'current_round_{game_id}', None) 
        request.session.pop(f'current_stage_{game_id}', None) 
        request.session.pop(f'img1_number_{game_id}', None) 
        request.session.pop(f'img2_number_{game_id}', None) 
        request.session.pop(f'img_list_{game_id}', None) 
        request.session.pop(f'is_game_start_{game_id}', None) 

        for i in range(5):
            request.session.pop(f'stage_{i}_winner_{game_id}', None)

    current_round = request.session.get(f'current_round_{game_id}', 0)
    current_stage = request.session.get(f'current_stage_{game_id}', 0)
    
    if current_round == 0:
        number_list = list(range(number_of_choices))
        request.session[f'img_list_{game_id}'] = number_list
        img_list = request.session.get(f'img_list_{game_id}')
        request.session[f'stage_0_winner_{game_id}'] = []

    elif current_round > (number_of_choices - 2):
        winner_list = request.session.get(f'stage_{current_stage}_winner_{game_id}', [])
        winning_number = winner_list[0]
        win_count = db.child("games").child(game_id).child("choice_data").child(winning_number).child("win_count").get().val()
        win_count += 1
        db.child("games").child(game_id).child("choice_data").child(winning_number).child("win_count").set(win_count) 

        play_count = db.child("games").child(game_id).child("play_count").get().val()
        play_count += 1
        db.child("games").child(game_id).child("play_count").set(play_count) 

        request.session.pop(f'current_round_{game_id}', None) 
        request.session.pop(f'current_stage_{game_id}', None)
        request.session.pop(f'img1_number_{game_id}', None) 
        request.session.pop(f'img2_number_{game_id}', None) 
        request.session.pop(f'img_list_{game_id}', None) 
        for i in range(5):
            request.session.pop(f'stage_{i}_winner_{game_id}', None)

        return redirect('show_game', game_id=game_id)
    
    stage_mapping = {
        (8, 4): 1,
        (8, 6): 2,
        (16, 8): 1,
        (16, 12): 2,
        (16, 14): 3,
        (32, 16): 1,
        (32, 24): 2,
        (32, 28): 3,
        (32, 30): 4,
    }
    current_stage = stage_mapping.get((number_of_choices, current_round))

    if current_stage is not None:
        request.session[f'stage_{current_stage}_winner_{game_id}'] = []
        request.session[f'current_stage_{game_id}'] = current_stage

    current_stage = request.session.get(f'current_stage_{game_id}')
    print(f'round: {current_round}, stage: {current_stage}')

    img_list = request.session.get(f'img_list_{game_id}', None)
    img1_number = request.session.get(f'img1_number_{game_id}', None)
    img2_number = request.session.get(f'img2_number_{game_id}', None)

    if img1_number == None:
        if not img_list:
            img_list = request.session.get(f'stage_{current_stage - 1}_winner_{game_id}', [])

        img1_number = random.choice(img_list)
        img2_number = random.choice(img_list)
        print(f'img list: {img_list}')

        while img2_number == img1_number:
            img2_number = random.choice(img_list)

        img_list.remove(img1_number)
        img_list.remove(img2_number)
        request.session[f'img1_number_{game_id}'] = img1_number
        request.session[f'img2_number_{game_id}'] = img2_number
        request.session[f'img_list_{game_id}'] = img_list
        
    file_path1 = 'images/' + game_id + f'/{img1_number}.png'
    file_path2 = 'images/' + game_id + f'/{img2_number}.png'
    img1 = storage.child(file_path1).get_url(None)
    img2 = storage.child(file_path2).get_url(None)
    title1 = db.child("games").child(game_id).child("choice_data").child(img1_number).child("title").get().val()
    title2 = db.child("games").child(game_id).child("choice_data").child(img2_number).child("title").get().val()
    
    return render(request, 'play.html', {'user_name': username, 'img1': img1, 'img2': img2, 'title1': title1, 'title2': title2, 'game_data': game_data, 'game_id': game_id })



def add_pics(request, game_id):
    username = request.session.get('user_name')
    if not request.session.get(f'can_add_pics_{game_id}', False):
        messages.error(request, "Access this page only after submiting initial game data")
        request.session.pop(f'can_add_pics_{game_id}', None)
        return redirect('main_page')

    username = request.session.get('user_name')
    game = db.child("games").child(game_id).get().val()

    if not game:
        messages.error(request, "Invalid game ID.")
        return redirect('main_page')
 
    number_of_choices = game.get('number_of_choices', 0)
    current_upload_count = request.session.get(f'upload_count_{game_id}', 0)
    
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)

        if form.is_valid():
            title = form.cleaned_data['title']
            file = request.FILES['file']
 
            try:
                file_path = f"images/{game_id}/{current_upload_count}.png"
                storage.child(file_path).put(file)
 
                db.child("games").child(game_id).child("choice_data").child(current_upload_count).child("title").set(title)
                db.child("games").child(game_id).child("choice_data").child(current_upload_count).child("pick_count").set(0)
                db.child("games").child(game_id).child("choice_data").child(current_upload_count).child("win_count").set(0)
 
                current_upload_count += 1
                request.session[f'upload_count_{game_id}'] = current_upload_count
 
                if current_upload_count < number_of_choices:
                    messages.success(request, f"Image {current_upload_count} uploaded successfully! Please upload the next image.")
                    return redirect('add_pics', game_id=game_id)

                else:
                    messages.success(request, "All images uploaded successfully!")
                    request.session.pop(f'can_add_pics_{game_id}', None)
                    request.session.pop(f'upload_count_{game_id}', None)
                    return redirect('main_page')
                
            except Exception as e:
                messages.error(request, f"Error uploading image: {str(e)}")
                return redirect('add_pics', game_id=game_id)
            
    else:
        form = UploadFileForm()
 
    return render(request, 'add_pics.html', {"user_name": username, "form": form, 'game_id': game_id, 'upload_count': current_upload_count, 'user_name': username})



def show_game(request, game_id):
    username = request.session.get('user_name')
    game_data = db.child("games").child(game_id).get().val()
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'button_play':
            request.session[f'is_game_start_{game_id}'] = True
            return redirect('play', game_id=game_id)
        
    return render(request, 'show_game.html', {'user_name': username, 'game_data': game_data, 'game_id': game_id})


'''



WEB_API_KEY = 'AIzaSyC2Jg3HI7jpGeukh0EgXmrb11GbBBnWMTQ'

# Create your views here.

@api_view(['POST'])
def api_main(request, *args, **kwargs):
    get = request.GET
    body = request.body
    headers = request.headers
    content_type = request.content_type
    
    data = {}
    try:
        data = json.loads(body)
    except:
        pass
    
    data['get'] = dict(get)
    data['headers'] = dict(headers)
    data['content_type'] = content_type

    print('data: ', data)
    print('Body: ', body)
    print('GET: ', get)
    print('Headers: ', headers)
    return Response(data)

@api_view(['POST'])
def sign_up_user(request, *args, **kwargs):
    request_body = request.data
    print(request_body)

    firebase_endpoint = f'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={WEB_API_KEY}'
    
    
    response = requests.post(firebase_endpoint, json=request_body)

    json_reponse = response.json()
    

    return Response(json_reponse)
'''

