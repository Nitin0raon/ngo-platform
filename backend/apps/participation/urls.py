from django.urls import path
from . import views

urlpatterns = [
    path('join/', views.JoinProgramView.as_view(), name='join_program'),
    path('leave/', views.LeaveProgramView.as_view(), name='leave_program'),
    path('my/', views.MyParticipationsView.as_view(), name='my_participations'),
]