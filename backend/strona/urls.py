from django.urls import path
from . import views

urlpatterns = [
    path('mainpage/', views.main_page, name='main_page'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('login_navbar/', views.login_navbar, name='login_navbar'),
    path('logout/', views.logout, name='logout'),
    path('create/', views.create, name='create'),
    path('add_pics/<str:game_id>/', views.add_pics, name='add_pics'),
    path('find_category/<str:category>/', views.find_category, name='find_category'),
    path('show_game/<str:game_id>/', views.show_game, name='show_game'),
    path('play/<str:game_id>/', views.play, name='play'),
]