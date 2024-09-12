import os, math 
import firebase_admin.auth
import pyrebase
import random, string
import requests
import json
import pyrebase
from pathlib import Path
from django.http import JsonResponse
from django.core.paginator import Paginator
from datetime import datetime
from zoneinfo import ZoneInfo
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .decorators import protected_view
from .functions import update_win_rates 

 

BASE_DIR = Path(__file__).resolve().parent
path_key = os.path.join(BASE_DIR, 'stronaww123-firebase-adminsdk-i25oq-82ae8cdb50.json')

cred = firebase_admin.credentials.Certificate(path_key)
firebase_admin.initialize_app(cred)


config={
    "apiKey": "AIzaSyC2Jg3HI7jpGeukh0EgXmrb11GbBBnWMTQ",
    "authDomain": "stronaww123.firebaseapp.com",
    "databaseURL": "https://stronaww123-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "stronaww123",
    "storageBucket": "stronaww123.appspot.com",
    "messagingSenderId": "358939997824",
    "appId": "1:358939997824:web:73bef249ea412d35f31865",
#   "serviceAccount": str(path_key)
    "measurementId": "G-PE8N920P01"
}
 

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()
storage = firebase.storage()



@api_view(["GET"])
def get_new_id_token(request):
    try:
        result = auth.refresh(request.COOKIES.get("refresh_token"))
    except Exception as e:
        print("Exception: ", e)

        message = json.loads(e.strerror).get("error").get("message")

        return Response({
            "success": False,
            "message": f"REFRESH TOKEN ERROR -> {message}"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    response = Response({
        "success": True,
        "message": "NEW ID TOKEN CREATED SUCCESSFULLY",
        "user_id": result.get("userId"),
        "id_token": result.get("idToken"),
    }, status=status.HTTP_200_OK)

    response.set_cookie("refresh_token", value=result.get("refreshToken"), max_age=7200, path="/", secure=True, httponly=True, samesite='None')

    return response



@api_view(['GET'])
def get_game_by_id(request, game_id):
    try:
        game = db.child("games").child(game_id).get().val()
    except Exception as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": f"DATABASE READ ERROR FROM GAME ID: {game_id}",
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if not game:
       return Response({
            "success": False,
            "message": f"THERE IS NO SUCH GAME ID: {game_id} IN DATABASE"
        }, status=status.HTTP_400_BAD_REQUEST) 
    
    return Response(game, status=status.HTTP_200_OK)



@api_view(["POST"])
@protected_view
def logout(request):
        
    user_id = getattr(request, "user_id", None)
        
    try:
        firebase_admin.auth.revoke_refresh_tokens(user_id) # this method revokes id_token and also refresh_token
    except Exception as e:
        print("Exception: ", e)

        message = e.args[0]
    
        return Response({
            "success": False,
            "message": f"LOGOUT ERROR -> {message}"
        },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    response = Response({
        "success": True,
        "message": "LOGGED OUT SUCCESSFULLY"
    }, status=status.HTTP_200_OK)

    #response.set_cookie("refresh_token", value='', expires=0, secure=True, httponly=True, samesite='None')
    response.delete_cookie("refresh_token", path='/', samesite='None')

    return response

    

@api_view(["POST"])
def register(request):

    #get = request.POST
    #body = request.body
    #headers = request.headers
    #content_type = request.content_type

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

    try:
        auth_response = auth.create_user_with_email_and_password(email, password)
        id_token = auth_response["idToken"]
        refresh_token = auth_response["refreshToken"]
        expires_in = auth_response["expiresIn"]
        user_id = auth_response["localId"]
        
        user_name = db.child("users").child(user_id).child("user_name").set(user_name)

        response = Response({
            "success": True,
            "message": "USER ACCOUNT CREATED SUCCESSFULLY",
            "user_name": user_name,
            "id_token": id_token,
            "expires_in": expires_in
        }, status=status.HTTP_200_OK)

        response.set_cookie("refresh_token", value=refresh_token, max_age=7200, path="/", secure=True, httponly=True, samesite='None')

        return response
    
    except Exception as e:
        print("Exception: ", e)

        message = json.loads(e.strerror).get("error").get("message")
        
        return Response({
            "success": False,
            "message": f"SIGN IN ERROR -> {message}",
        }, status=status.HTTP_400_BAD_REQUEST)
        


@api_view(["POST"]) # this line gives the same effect as: if request.method == "POST"; login() function accepts only requests with POST method
def login(request):
    '''
    request_body structure:
    {
        email: <string: example@email.com>
        password: <string: example>
    }
    
    '''
    request_body = request.data
    email = request_body.get("email")
    password = request_body.get("password")

    try:
        user_data = firebase_admin.auth.get_user_by_email(email)
    except firebase_admin.auth.UserNotFoundError as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": "THERE IS NO SUCH USER"
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("Exception: ", e)
        
        return Response({
            "success": False,
            "message": f"ERROR -> {e}"
        }, status=status.HTTP_400_BAD_REQUEST)

    user_id = user_data.uid
    
    
    try:
        firebase_admin.auth.revoke_refresh_tokens(user_id)
    except Exception as e:
        print("Exception: ", e)

        message = e.args[0]

        return Response({
            "success": False,
            "message": f"ERROR -> {message}"
        },status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    try:
        auth_response = auth.sign_in_with_email_and_password(email, password)
        id_token = auth_response["idToken"]
        refresh_token = auth_response["refreshToken"]
        expires_in = auth_response["expiresIn"]
        user_id = auth_response["localId"]
        
        user_name = db.child("users").child(user_id).child("user_name").get().val()
        
        response = Response({
            "success": True,
            "message": "LOGGED IN SUCCESSFULLY",
            "user_name": user_name,
            "id_token": id_token,
            "expires_in": expires_in
        }, status=status.HTTP_200_OK) 
        
        response.set_cookie("refresh_token", value=refresh_token, max_age=7200, path="/", secure=True, httponly=True, samesite='None')

        return response

    except requests.exceptions.HTTPError as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": "INVALID LOGIN CREDENTIALS",
        }, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@protected_view
def create(request):

    '''
    fetching request_body (json string) from client request and convert it to dict; 
    request_body structure: 
    {
        "title": <string: example>,
        "category": <string: example>,
        "number_of_choices": <int: example>,
        "description": <string: example>,
        "main_image_url": <string: example>,
        "shown_in_pair": <int: example>,
        "choices_data": [{
                            "title": <string: example>,
                            "image_url": <string: example>,
                            "pick_count": <int: example>,
                            "win_count": <int: example>,
                            "championship_rate": <int: example>,
                        },
                        {
                            "title": <string: example>,
                            "image_url": <string: example>,
                            "pick_count": <int: example>,
                            "win_count": <int: example>,    
                            "championship_rate": <int: example>,                    
                        }]
    }
    '''
    
    request_body = request.data
    
    game_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    poland_time = datetime.now(ZoneInfo("Europe/Warsaw"))
    formatted_time = poland_time.strftime("%Y-%m-%d %H:%M:%S %Z%z")
    user_id = getattr(request, "user_id", None) 
    play_count = 0

    request_body.update({
            "date": formatted_time,
            "user_id": user_id,
            "play_count": play_count
        })

    try:
        db.child("games").child(game_id).set(request_body)
    except Exception as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": "DATABASE WRITE ERROR"
        }, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "success": True,
        "message": "GAME DATA ALLOCATED IN DATABASE SUCCESSFULLY"
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
@protected_view
def add_comment(request, game_id):

    user_id = getattr(request, "user_id", None)
    user_name = db.child("users").child(user_id).child("user_name").get().val()

    '''
    request_body:
    {"comment": <string: example>}
    '''
    
    request_body = request.data
    comment_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    poland_time = datetime.now(ZoneInfo("Europe/Warsaw"))
    formatted_time = poland_time.strftime("%Y-%m-%d %H:%M:%S %Z%z")

    request_body.update({
        "date": formatted_time, 
        "game_id": game_id, 
        "user_id": user_id,
        "user_name": user_name
    })
    
    try:
        db.child("comments").child(comment_id).set(request_body)
    except Exception as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": "DATABASE WRITE ERROR"
        }, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "success": True,
        "message": "COMMENT CREATED SUCCESSFULLY"
    }, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_game_comments(request, game_id):
    try:
        game_comments = db.child("comments").order_by_child("game_id").equal_to(game_id).get().val()
         
        return Response(game_comments, status=status.HTTP_200_OK)
    
    except Exception as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "error": "ERROR FETCHING COMMENTS FROM DATABASE",
        }, status=status.HTTP_400_BAD_REQUEST)
        
    

@api_view(["GET"])
def find_category(request, category):

    #get = request.GET
    #body = request.body
    #headers = request.headers
    #content_type = request.content_type
    
    try:
        if not category == "all":
            games_from_category = db.child("games").order_by_child("category").equal_to(category).get().val()
        else:
            games_from_category = db.child("games").get().val()
        
        games_from_category_list = list(games_from_category.items())   

    except AttributeError as e: # Error which occurs when frontend is referring to unexisting category in database
        games_from_category = None
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": f"THERE IS NO SUCH CATEGORY: {category} IN DATABASE"
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print("Exception: ", e)

        return Response({
            "success": False,
            "message": f"DATABASE READ ERROR FROM CATEGORY: {category}",
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    if request.query_params.get("page") == "all":
        games_list = []
        for game_id, game_data in games_from_category.items():
            game = {
                "id": game_id,
                "category": game_data.get("category", None),
                "description":game_data.get("description", None),
                "title": game_data.get("title", None),
                "creator": db.child("users").child(game_data.get("user_id", None)).child("user_name").get().val(),
                "image": game_data.get("main_image_url", "https://grafik.rp.pl/g4a/767071,375371,9.jpg")
            }

            games_list.append(game)
        
        response_data = {
            "games": games_list
        }
        
        return Response(response_data, status=status.HTTP_200_OK)


    paginator = Paginator(games_from_category_list, 2)  # 2 items per page
    page_number = request.query_params.get("page", 1)  # Get the page number from the request, default is 1
    '''
    When page_number received from query params exceeds num_pages calculated by paginator, paginator.get_page(page_number) will return page_obj adequate to num_pages value.
    When page_nmber received from query params is not a number (e.g. ?page=3z) paginator.get_page(page_number) will return page_obj corresponding to first page.
    
    '''
    page_obj = paginator.get_page(page_number)   

    response_data = {
        #'user_name': user_name, 
        'category': category, 
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_number,
        'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
        'previous_page': page_obj.previous_page_number() if page_obj.has_previous() else None,
        'results': dict(page_obj.object_list)
    }    

    return Response(response_data, status=status.HTTP_200_OK)



@api_view(['GET'])
def start_game(request, game_id):
    request.session[f'is_game_start_{game_id}'] = True
    
    return Response({"game_id": game_id, "status": "started"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def play_end_get(request, game_id):

    game_data = db.child("games").child(game_id).get().val()
    number_of_choices = int(game_data["number_of_choices"])

    print(request.session.get(f'is_game_start_{game_id}', False))

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
 
        champ_rate = (win_count / play_count) * 100
        rounded_champ_rate = math.ceil(champ_rate)
        db.child("games").child(game_id).child("choice_data").child(winning_number).child("championship_rate").set(rounded_champ_rate)
 
 
        request.session.pop(f'current_round_{game_id}', None)
        request.session.pop(f'current_stage_{game_id}', None)
        request.session.pop(f'img1_number_{game_id}', None)
        request.session.pop(f'img2_number_{game_id}', None)
        request.session.pop(f'img_list_{game_id}', None)
        for i in range(5):
            request.session.pop(f'stage_{i}_winner_{game_id}', None)

        update_win_rates(game_id, database_ref=db)

        return Response({
            "end": True
        })
        
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


    """
    def game_progression(number_of_choices, current_round, current_stage):
        choices_in_stage = number_of_choices / 2 ** (current_stage + 1)
        if current_round > 4:
            pass

        progress = str(current_round) + "/" + str(choices_in_stage)
        return progress
    """

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
        

    img1 = db.child("games").child(game_id).child("choice_data").child(img1_number).child("image_url").get().val()
    img2 = db.child("games").child(game_id).child("choice_data").child(img2_number).child("image_url").get().val()
    
    title1 = db.child("games").child(game_id).child("choice_data").child(img1_number).child("title").get().val()
    title2 = db.child("games").child(game_id).child("choice_data").child(img2_number).child("title").get().val()
 
    response_data = { 
        'current_round': current_round + 1,
        "number_of_choices": number_of_choices - 1,
        'img1_url': img1, 
        'img2_url': img2, 
        'img1_title': title1, 
        'img2_title': title2, 
    }

    return JsonResponse(response_data)


@api_view(['POST'])
def play_end_post(request, game_id):
    request_body = request.data
    action = request_body.get("winner")
    
    print(request_body)
    print(action)
    
    img1_nr = request.session.get(f'img1_number_{game_id}', None)
    img2_nr = request.session.get(f'img2_number_{game_id}', None)
    shown_in_pair_1 = db.child("games").child(game_id).child("choice_data").child(img1_nr).child("shown_in_pair").get().val()
    shown_in_pair_2 = db.child("games").child(game_id).child("choice_data").child(img2_nr).child("shown_in_pair").get().val()
    shown_in_pair_1 += 1
    shown_in_pair_2 += 1
    db.child("games").child(game_id).child("choice_data").child(img1_nr).child("shown_in_pair").set(shown_in_pair_1)
    db.child("games").child(game_id).child("choice_data").child(img2_nr).child("shown_in_pair").set(shown_in_pair_2)


    if action == 'img1':
        winner = img1_nr
        current_round = request.session.get(f'current_round_{game_id}', 0)
        current_stage = request.session.get(f'current_stage_{game_id}', 0)

        winner_list = request.session.get(f'stage_{current_stage}_winner_{game_id}', [])
        winner_list.append(winner)
        request.session[f'stage_{current_stage}_winner_{game_id}'] = winner_list

        print("winner:", winner)

        pick_count = db.child("games").child(game_id).child("choice_data").child(winner).child("pick_count").get().val()
        pick_count += 1
        db.child("games").child(game_id).child("choice_data").child(winner).child("pick_count").set(pick_count)

        request.session.pop(f'img1_number_{game_id}', None) 
        request.session.pop(f'img2_number_{game_id}', None) 
        current_round += 1
        request.session[f'current_round_{game_id}'] = current_round 

        return Response(
            {
                "winner": winner,
                "message": "img1 won"
            }
        )
        
    if action == 'img2':
        winner = img2_nr
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

        return Response(
            {
                "winner": winner,
                "message": "img2 won"
            }
        )