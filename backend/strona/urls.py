from django.urls import path
from . import views

urlpatterns = [
    #path('mainpage/', views.mainpage, name='mainpage'),
    path('get_new_id_token/', views.get_new_id_token, name="get_new_id_token"),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    #path('login_navbar/', views.login_navbar, name='login_navbar'),
    path('logout/', views.logout, name='logout'),
    path('create/', views.create, name='create'),
    #path('add_pics/<str:game_id>/', views.add_pics, name='add_pics'),
    path('find_category/<str:category>/', views.find_category, name='find_category'),
    #path('show_game/<str:game_id>/', views.show_game, name='show_game'),
    #path('play/<str:game_id>/', views.play, name='play'),

    path('start_game/<str:game_id>/', views.start_game, name="start_game"),
    path('play_end_get/<str:game_id>/', views.play_end_get, name="play_end_get"),
    path('play_end_post/<str:game_id>/', views.play_end_post, name="play_end_post"),
    path('get_game_by_id/<str:game_id>/', views.get_game_by_id, name="get_game_by_id"),
    #path('play_endpoint/<str:game_id>/', views.play_endpoint, name="play_endpoint"),
    path('add_comment/<str:game_id>/', views.add_comment, name="add_comment"),
    path('get_game_comments/<str:game_id>/', views.get_game_comments, name="get_game_comments"),

]