from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for notification list and detail views.
    """
    notification_type_display = serializers.CharField(
        source='get_notification_type_display',
        read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'notification_type_display',
            'title', 'message', 'is_read',
            'program_id', 'program_title',
            'created_at',
        ]
        read_only_fields = [
            'id', 'notification_type', 'title', 'message',
            'program_id', 'program_title', 'created_at',
        ]