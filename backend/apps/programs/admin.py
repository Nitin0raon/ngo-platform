from django.contrib import admin
from .models import Program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_by', 'status', 'capacity', 'current_participants', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'description', 'created_by__email', 'created_by__organization_name']
    readonly_fields = ['current_participants', 'created_at', 'updated_at']
    raw_id_fields = ['created_by']
    ordering = ['-created_at']

    fieldsets = (
        ('Basic Info', {'fields': ('title', 'description', 'status')}),
        ('Capacity', {'fields': ('capacity', 'current_participants')}),
        ('Dates & Location', {'fields': ('start_date', 'end_date', 'location')}),
        ('Ownership', {'fields': ('created_by',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )