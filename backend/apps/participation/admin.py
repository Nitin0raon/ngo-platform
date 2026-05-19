from django.contrib import admin
from .models import Participation


@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'program', 'status', 'joined_at', 'left_at']
    list_filter = ['status', 'joined_at']
    search_fields = ['volunteer__email', 'program__title']
    readonly_fields = ['joined_at']
    raw_id_fields = ['volunteer', 'program']
    ordering = ['-joined_at']