from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProgramListView.as_view(), name='program_list'),
    path('create/', views.ProgramCreateView.as_view(), name='program_create'),
    path('my-programs/', views.MyProgramsView.as_view(), name='my_programs'),
    path('<int:pk>/', views.ProgramDetailView.as_view(), name='program_detail'),
    path('<int:pk>/update/', views.ProgramUpdateView.as_view(), name='program_update'),
    path('<int:pk>/delete/', views.ProgramDeleteView.as_view(), name='program_delete'),
    path('<int:pk>/participants/', views.ProgramParticipantsView.as_view(), name='program_participants'),
]