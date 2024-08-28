from django.urls import path
from . import views

urlpatterns = [
    #path('mainpage/', views.mainpage, name='mainpage'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    #path('login_navbar/', views.login_navbar, name='login_navbar'),
    path('logout/', views.logout, name='logout'),
    path('create/', views.create, name='create'),
    #path('add_pics/<str:game_id>/', views.add_pics, name='add_pics'),
    path('find_category/<str:category>/', views.find_category, name='find_category'),
    #path('show_game/<str:game_id>/', views.show_game, name='show_game'),
    #path('play/<str:game_id>/', views.play, name='play'),


    path('get_game_by_id/<str:game_id>/', views.get_game_by_id, name="get_game_by_id"),
    #path('get_all_games/', views.get_all_games, name="get_all_games"),
    path('play_endpoint/<str:game_id>/', views.play_endpoint, name="play_endpoint"),
    #path('find_category_endpoint/<str:category>/', views.find_category_endpoint, name="find_category_endpoint")
]