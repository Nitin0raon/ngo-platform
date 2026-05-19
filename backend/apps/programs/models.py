from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()


class Program(models.Model):
    """
    Represents a program/event created by an NGO.
    Volunteers can join programs to participate.
    """

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text='Maximum number of volunteers allowed'
    )
    current_participants = models.PositiveIntegerField(
        default=0,
        help_text='Current number of active participants'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_programs',
        limit_choices_to={'role': 'ngo'},
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Program'
        verbose_name_plural = 'Programs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_by']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f'{self.title} ({self.status})'

    @property
    def is_full(self):
        return self.current_participants >= self.capacity

    @property
    def available_slots(self):
        return max(0, self.capacity - self.current_participants)

    def increment_participants(self):
        """Thread-safe increment using F expression."""
        from django.db.models import F
        Program.objects.filter(pk=self.pk).update(
            current_participants=F('current_participants') + 1
        )
        self.refresh_from_db()

    def decrement_participants(self):
        """Thread-safe decrement using F expression."""
        from django.db.models import F
        Program.objects.filter(pk=self.pk).update(
            current_participants=F('current_participants') - 1
        )
        self.refresh_from_db()