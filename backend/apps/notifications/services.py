import logging
from django.contrib.auth import get_user_model
from .models import Notification
from services.email_service import EmailService

logger = logging.getLogger(__name__)
User = get_user_model()


class NotificationService:
    """
    Central service for creating DB notifications and sending emails.
    Called synchronously from participation views — no Celery required.
    """

    @staticmethod
    def _create_notification(recipient: User, notification_type: str,
                              title: str, message: str,
                              program=None) -> Notification:
        """Create a DB notification record."""
        notification = Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            title=title,
            message=message,
            program_id=program.id if program else None,
            program_title=program.title if program else None,
        )
        logger.info(
            f'Notification created: [{notification_type}] '
            f'for user {recipient.email}, program: {program.title if program else "N/A"}'
        )
        return notification

    @classmethod
    def notify_volunteer_joined(cls, volunteer: User, program) -> None:
        """
        Triggered when a volunteer joins a program.
        - Creates notification for the NGO
        - Creates notification for the volunteer (confirmation)
        - Sends emails to both
        """
        ngo = program.created_by

        # 1. DB Notification → NGO
        cls._create_notification(
            recipient=ngo,
            notification_type=Notification.NotificationType.VOLUNTEER_JOINED,
            title=f'New volunteer joined: {program.title}',
            message=f'{volunteer.full_name} ({volunteer.email}) has joined your program "{program.title}".',
            program=program,
        )

        # 2. DB Notification → Volunteer (confirmation)
        cls._create_notification(
            recipient=volunteer,
            notification_type=Notification.NotificationType.VOLUNTEER_JOINED,
            title=f'You joined: {program.title}',
            message=f'You have successfully joined the program "{program.title}". Thank you for volunteering!',
            program=program,
        )

        # 3. Email → NGO
        EmailService.send_volunteer_joined_notification(
            ngo_email=ngo.email,
            volunteer_name=volunteer.full_name,
            program_title=program.title,
            program_id=program.id,
        )

        # 4. Email → Volunteer
        EmailService.send_join_confirmation_to_volunteer(
            volunteer_email=volunteer.email,
            volunteer_name=volunteer.full_name,
            program_title=program.title,
            program_id=program.id,
        )

    @classmethod
    def notify_volunteer_left(cls, volunteer: User, program) -> None:
        """
        Triggered when a volunteer leaves a program.
        - Creates notification for the NGO
        - Creates notification for the volunteer (confirmation)
        - Sends emails to both
        """
        ngo = program.created_by

        # 1. DB Notification → NGO
        cls._create_notification(
            recipient=ngo,
            notification_type=Notification.NotificationType.VOLUNTEER_LEFT,
            title=f'Volunteer left: {program.title}',
            message=f'{volunteer.full_name} ({volunteer.email}) has left your program "{program.title}".',
            program=program,
        )

        # 2. DB Notification → Volunteer (confirmation)
        cls._create_notification(
            recipient=volunteer,
            notification_type=Notification.NotificationType.VOLUNTEER_LEFT,
            title=f'You left: {program.title}',
            message=f'You have successfully left the program "{program.title}". We hope to see you back!',
            program=program,
        )

        # 3. Email → NGO
        EmailService.send_volunteer_left_notification(
            ngo_email=ngo.email,
            volunteer_name=volunteer.full_name,
            program_title=program.title,
            program_id=program.id,
        )

        # 4. Email → Volunteer
        EmailService.send_leave_confirmation_to_volunteer(
            volunteer_email=volunteer.email,
            volunteer_name=volunteer.full_name,
            program_title=program.title,
        )

    @classmethod
    def notify_program_full(cls, program) -> None:
        """
        Triggered when a program reaches full capacity.
        - Creates notification for the NGO
        - Sends email to the NGO
        """
        ngo = program.created_by

        # 1. DB Notification → NGO
        cls._create_notification(
            recipient=ngo,
            notification_type=Notification.NotificationType.PROGRAM_FULL,
            title=f'Program is full: {program.title}',
            message=(
                f'Your program "{program.title}" has reached its maximum capacity '
                f'of {program.capacity} participants.'
            ),
            program=program,
        )

        # 2. Email → NGO
        EmailService.send_program_full_notification(
            ngo_email=ngo.email,
            program_title=program.title,
            program_id=program.id,
            capacity=program.capacity,
        )