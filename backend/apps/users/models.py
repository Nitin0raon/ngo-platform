from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model using email as the unique identifier.
    Supports two roles: NGO (organization) and Volunteer.
    """

    class Role(models.TextChoices):
        NGO = 'ngo', 'NGO'
        VOLUNTEER = 'volunteer', 'Volunteer'

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VOLUNTEER,
        db_index=True,
    )

    # NGO-specific fields
    organization_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Only applicable for NGO role'
    )
    organization_description = models.TextField(
        blank=True,
        null=True,
        help_text='Brief description of the NGO'
    )

    # Volunteer-specific fields
    bio = models.TextField(blank=True, null=True, help_text='Volunteer bio')
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    # Status fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.email} ({self.get_role_display()})'

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    @property
    def is_ngo(self):
        return self.role == self.Role.NGO

    @property
    def is_volunteer(self):
        return self.role == self.Role.VOLUNTEER