from django.urls import path
from . import views

urlpatterns = [
    path('ngo-dashboard/', views.NGODashboardView.as_view(), name='ngo_dashboard'),
    path('volunteer-dashboard/', views.VolunteerDashboardView.as_view(), name='volunteer_dashboard'),
]