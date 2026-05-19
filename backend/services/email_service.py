import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


class EmailService:
    """
    Centralized email sending service.
    All email sending in the application goes through this service.
    Sends emails synchronously (no Celery).
    """

    @staticmethod
    def _send(subject: str, message: str, recipient_email: str, html_message: str = None) -> bool:
        """
        Internal method that wraps Django's send_mail with error handling.
        Returns True on success, False on failure.
        """
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f'Email sent successfully to {recipient_email}: "{subject}"')
            return True
        except Exception as e:
            logger.error(f'Failed to send email to {recipient_email}: {str(e)}')
            return False

    @classmethod
    def send_volunteer_joined_notification(cls, ngo_email: str, volunteer_name: str,
                                           program_title: str, program_id: int) -> bool:
        """Notify NGO when a volunteer joins their program."""
        subject = f'New Volunteer Joined: {program_title}'
        message = (
            f'Hello,\n\n'
            f'{volunteer_name} has joined your program "{program_title}".\n\n'
            f'Program ID: {program_id}\n\n'
            f'Log in to your NGO dashboard to view all participants.\n\n'
            f'Best regards,\nNGO Platform Team'
        )
        html_message = f"""
        <html>
          <body>
            <h2>New Volunteer Joined Your Program</h2>
            <p><strong>{volunteer_name}</strong> has joined your program <strong>"{program_title}"</strong>.</p>
            <p><strong>Program ID:</strong> {program_id}</p>
            <p>Log in to your NGO dashboard to view all participants.</p>
            <br>
            <p>Best regards,<br><strong>NGO Platform Team</strong></p>
          </body>
        </html>
        """
        return cls._send(subject, message, ngo_email, html_message)

    @classmethod
    def send_volunteer_left_notification(cls, ngo_email: str, volunteer_name: str,
                                          program_title: str, program_id: int) -> bool:
        """Notify NGO when a volunteer leaves their program."""
        subject = f'Volunteer Left Program: {program_title}'
        message = (
            f'Hello,\n\n'
            f'{volunteer_name} has left your program "{program_title}".\n\n'
            f'Program ID: {program_id}\n\n'
            f'A slot is now available in this program.\n\n'
            f'Best regards,\nNGO Platform Team'
        )
        html_message = f"""
        <html>
          <body>
            <h2>Volunteer Left Your Program</h2>
            <p><strong>{volunteer_name}</strong> has left your program <strong>"{program_title}"</strong>.</p>
            <p><strong>Program ID:</strong> {program_id}</p>
            <p>A slot is now available in this program.</p>
            <br>
            <p>Best regards,<br><strong>NGO Platform Team</strong></p>
          </body>
        </html>
        """
        return cls._send(subject, message, ngo_email, html_message)

    @classmethod
    def send_program_full_notification(cls, ngo_email: str, program_title: str,
                                        program_id: int, capacity: int) -> bool:
        """Notify NGO when their program reaches full capacity."""
        subject = f'Program Full: {program_title}'
        message = (
            f'Hello,\n\n'
            f'Your program "{program_title}" has reached its maximum capacity of {capacity} participants.\n\n'
            f'Program ID: {program_id}\n\n'
            f'No more volunteers can join this program unless you increase the capacity.\n\n'
            f'Best regards,\nNGO Platform Team'
        )
        html_message = f"""
        <html>
          <body>
            <h2>🎉 Program at Full Capacity!</h2>
            <p>Your program <strong>"{program_title}"</strong> has reached its maximum capacity of 
            <strong>{capacity} participants</strong>.</p>
            <p><strong>Program ID:</strong> {program_id}</p>
            <p>No more volunteers can join this program unless you increase the capacity in your dashboard.</p>
            <br>
            <p>Best regards,<br><strong>NGO Platform Team</strong></p>
          </body>
        </html>
        """
        return cls._send(subject, message, ngo_email, html_message)

    @classmethod
    def send_join_confirmation_to_volunteer(cls, volunteer_email: str, volunteer_name: str,
                                             program_title: str, program_id: int) -> bool:
        """Confirm to volunteer that they have successfully joined a program."""
        subject = f'You joined: {program_title}'
        message = (
            f'Hello {volunteer_name},\n\n'
            f'You have successfully joined the program "{program_title}".\n\n'
            f'Program ID: {program_id}\n\n'
            f'Thank you for volunteering!\n\n'
            f'Best regards,\nNGO Platform Team'
        )
        html_message = f"""
        <html>
          <body>
            <h2>Welcome to {program_title}!</h2>
            <p>Hello <strong>{volunteer_name}</strong>,</p>
            <p>You have successfully joined the program <strong>"{program_title}"</strong>.</p>
            <p><strong>Program ID:</strong> {program_id}</p>
            <p>Thank you for volunteering! Your contribution makes a difference.</p>
            <br>
            <p>Best regards,<br><strong>NGO Platform Team</strong></p>
          </body>
        </html>
        """
        return cls._send(subject, message, volunteer_email, html_message)

    @classmethod
    def send_leave_confirmation_to_volunteer(cls, volunteer_email: str, volunteer_name: str,
                                              program_title: str) -> bool:
        """Confirm to volunteer that they have successfully left a program."""
        subject = f'You left: {program_title}'
        message = (
            f'Hello {volunteer_name},\n\n'
            f'You have successfully left the program "{program_title}".\n\n'
            f'We hope to see you back soon!\n\n'
            f'Best regards,\nNGO Platform Team'
        )
        return cls._send(subject, message, volunteer_email)