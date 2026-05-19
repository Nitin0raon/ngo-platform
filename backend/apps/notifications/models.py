from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    """
    In-app notifications stored in the database.
    Created whenever key events occur (join, leave, program full).
    """

    class NotificationType(models.TextChoices):
        VOLUNTEER_JOINED = 'volunteer_joined', 'Volunteer Joined'
        VOLUNTEER_LEFT = 'volunteer_left', 'Volunteer Left'
        PROGRAM_FULL = 'program_full', 'Program Full'
        PROGRAM_COMPLETED = 'program_completed', 'Program Completed'
        GENERAL = 'general', 'General'

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        db_index=True,
    )
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.GENERAL,
        db_index=True,
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)

    # Optional: link notification to a program
    program_id = models.PositiveIntegerField(null=True, blank=True)
    program_title = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
        ]

    def __str__(self):
        return f'[{self.notification_type}] To: {self.recipient.email} - {self.title}'