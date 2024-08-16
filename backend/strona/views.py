import time
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from firebase_admin import auth
import pyrebase
from .forms import *
import random, string
from datetime import datetime
from zoneinfo import ZoneInfo
 
config={
    "apiKey": "AIzaSyC2Jg3HI7jpGeukh0EgXmrb11GbBBnWMTQ",
    "authDomain": "stronaww123.firebaseapp.com",
    "databaseURL": "https://stronaww123-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "stronaww123",
    "storageBucket": "stronaww123.appspot.com",
    "messagingSenderId": "358939997824",
    "appId": "1:358939997824:web:73bef249ea412d35f31865",
#    measurementId: "G-PE8N920P01"
}
 
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()
storage = firebase.storage()

def main_page(request):
    username = request.session.get('user_name')

    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            category = form.cleaned_data['category']
            return redirect('find_category', category=category)
        
    else:
        form = CategoryForm()
 
    return render(request, 'mainPage.html', {'user_name': username, "form": form})


def login_navbar(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = auth.sign_in_with_email_and_password(email, password)
            user_id = user['localId']
            username = str(db.child("users").child(user_id).child("username").get())
            request.session['user_id'] = user_id
            request.session['user_email'] = email
            request.session['user_name'] = username
            messages.success(request, 'Logged in successfully.')
            return redirect('main_page')
        
        except Exception as e:
            messages.error(request, 'Invalid credentials, please try again.')
            return redirect('main_page')
        
    return redirect('main_page')
 

def logout(request):
    try:
        print("Logging out user:", request.session.get('user_name'))
        request.session.pop('user_id', None)
        request.session.pop('user_email', None)
        request.session.pop('user_name', None)
        print("User logged out successfully")

    except KeyError as e:
        print("Error while logging out:", e)
        pass

    messages.success(request, 'Logged out successfully.')
    return redirect('main_page')
 
 
def register(request):
    username = request.session.get('user_name')

    if request.method == 'POST':
        username = request.POST.get('register_username')
        email = request.POST.get('register_email')
        password = request.POST.get('register_password')

        try:
            user = auth.create_user_with_email_and_password(email, password)

        except Exception as e:
            messages.error(request, str(e))
            return redirect('register')
        
        for attempt in range(5):
            try:
                user = auth.sign_in_with_email_and_password(email, password)
                break  
            except Exception as e:
                time.sleep(2)

        try:
            user_id = user['localId']
            request.session['user_id'] = user_id
            request.session['user_email'] = email
            request.session['user_name'] = username
            db.child("users").child(user_id).child("username").set(username)
            messages.success(request, 'Account registered successfully.')
            return redirect('main_page')
        
        except Exception as e:
            messages.error(request, str(e))
            return redirect('register')
        
    return render(request, 'register.html', {'user_name': username})
 

def login(request):
    username = request.session.get('user_name')
    
    if request.method == 'POST':
        email = request.POST.get('login_email')
        password = request.POST.get('login_password')

        try:
            user = auth.sign_in_with_email_and_password(email, password)
            user_id = user['localId']
            username = db.child("users").child(user_id).child("username").get().val()
            request.session['user_id'] = user_id
            request.session['user_name'] = username
            request.session['user_email'] = email
            messages.success(request, 'Account logged in.')
            return redirect('main_page')
        
        except Exception as e:
            print(f"error", e)
            return redirect('login')
        
    return render(request, 'login.html', {'user_name': username})
 
 
def create(request):
    username = request.session.get('user_name')
    user_id = request.session.get('user_id')

    if request.method == 'POST':
        form = GameForm(request.POST)

        if form.is_valid():
            title = form.cleaned_data['title']
            description = form.cleaned_data['description']
            number_of_choices = int(form.cleaned_data['number_of_choices'])
            category = form.cleaned_data['category']
            game_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
 
            game_data = {
                "title": title,
                "number_of_choices": number_of_choices,
                "category": category,
                "description": description,
            }
 
            try:
                poland_time = datetime.now(ZoneInfo('Europe/Warsaw'))
                formatted_time = poland_time.strftime('%Y-%m-%d %H:%M:%S %Z%z')
                db.child("games").child(game_id).set(game_data)
                db.child("games").child(game_id).child("date").set(formatted_time)
                db.child("games").child(game_id).child("user_id").set(user_id)
                db.child("games").child(game_id).child("play_count").set(0)
                messages.success(request, "Game created successfully!")
                request.session[f'can_add_pics_{game_id}'] = True
                return redirect('add_pics', game_id=game_id)
            
            except Exception as e:
                messages.error(request, f"An error occurred: {e}")
                return redirect('create')
            
    else:
        form = GameForm()
 
    return render(request, 'create.html', {'form': form, 'user_name': username})
 
 
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


def find_category(request, category):
    username = request.session.get('user_name')
    games = []
    all_games = db.child("games").get().val()

    if all_games:
        for game_id, game_data in all_games.items():
            if game_data.get("category") == category:
                number_of_choices = game_data.get("number_of_choices", 0)
                choice_data = game_data.get("choice_data", [])
                if len(choice_data) == number_of_choices:
                    game_data['game_id'] = game_id
                    games.append(game_data)
                else:
                    try:
                        #db.child("games").child(game_id).remove()
                        for i in range(len(choice_data)):
                            print(i)
                            auth_token = request.session.get('auth_token')
                            storage.delete(f"images/{game_id}/{i}.png", token=auth)
                    except Exception as e:
                        print(f'Error deleting incomplete game {game_id}, {e}')

    else:
        messages.error(request, "Error accessing database")
        return redirect('main_page')

    return render(request, 'category.html', {'user_name': username, "category": category, "games": games})


def show_game(request, game_id):
    username = request.session.get('user_name')
    game_data = db.child("games").child(game_id).get().val()
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'button_play':
            request.session[f'is_game_start_{game_id}'] = True
            return redirect('play', game_id=game_id)
        
    return render(request, 'show_game.html', {'user_name': username, 'game_data': game_data, 'game_id': game_id})


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
