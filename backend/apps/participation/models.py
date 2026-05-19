from django.db import models
from django.contrib.auth import get_user_model
from apps.programs.models import Program

User = get_user_model()


class Participation(models.Model):
    """
    Tracks which volunteers have joined which programs.
    Enforces unique constraint (one volunteer per program).
    """

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        LEFT = 'left', 'Left'

    volunteer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='participations',
        limit_choices_to={'role': 'volunteer'},
    )
    program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name='participations',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Participation'
        verbose_name_plural = 'Participations'
        ordering = ['-joined_at']
        # A volunteer can only have ONE active record per program
        # (they can join again after leaving, but we handle that in the service layer)
        constraints = [
            models.UniqueConstraint(
                fields=['volunteer', 'program'],
                condition=models.Q(status='active'),
                name='unique_active_participation'
            )
        ]
        indexes = [
            models.Index(fields=['volunteer', 'status']),
            models.Index(fields=['program', 'status']),
        ]

    def __str__(self):
        return f'{self.volunteer.email} -> {self.program.title} ({self.status})'