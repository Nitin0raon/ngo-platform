import logging
from django.utils import timezone
from django.db import transaction
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Participation
from .serializers import ParticipationSerializer, JoinProgramSerializer
from apps.programs.models import Program
from apps.programs.permissions import IsVolunteer
from apps.notifications.services import NotificationService
from services.cache_service import CacheService

logger = logging.getLogger(__name__)


class JoinProgramView(APIView):
    """
    POST /api/v1/participation/join/
    Volunteer joins a program.
    Body: { "program_id": <int> }
    """
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    @transaction.atomic
    def post(self, request):
        serializer = JoinProgramSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        program_id = serializer.validated_data['program_id']
        volunteer = request.user

        # Lock the program row to prevent race conditions
        program = Program.objects.select_for_update().get(pk=program_id)

        # Re-validate after lock (capacity may have changed)
        if program.is_full:
            return Response(
                {'error': 'Program is now full. No available slots.'},
                status=status.HTTP_409_CONFLICT
            )

        # Check if already actively participating
        existing = Participation.objects.filter(
            volunteer=volunteer,
            program=program,
            status=Participation.Status.ACTIVE
        ).first()

        if existing:
            return Response(
                {'error': 'You have already joined this program.'},
                status=status.HTTP_409_CONFLICT
            )

        # Create participation record
        participation = Participation.objects.create(
            volunteer=volunteer,
            program=program,
            status=Participation.Status.ACTIVE,
        )

        # Increment participant count
        program.increment_participants()
        program.refresh_from_db()

        # Trigger notifications (DB + Email)
        NotificationService.notify_volunteer_joined(volunteer, program)

        # Check if program became full after this join
        if program.is_full:
            NotificationService.notify_program_full(program)

        # Invalidate analytics caches
        CacheService.invalidate_analytics_for_program(program)
        CacheService.invalidate_volunteer_analytics(volunteer.id)

        logger.info(
            f'Volunteer {volunteer.email} joined program "{program.title}" '
            f'({program.current_participants}/{program.capacity} slots filled)'
        )

        return Response(
            {
                'message': f'Successfully joined program "{program.title}".',
                'participation': ParticipationSerializer(participation).data,
            },
            status=status.HTTP_201_CREATED
        )


class LeaveProgramView(APIView):
    """
    POST /api/v1/participation/leave/
    Volunteer leaves a program.
    Body: { "program_id": <int> }
    """
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    @transaction.atomic
    def post(self, request):
        program_id = request.data.get('program_id')
        if not program_id:
            return Response(
                {'error': 'program_id is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        volunteer = request.user

        # Lock program row
        try:
            program = Program.objects.select_for_update().get(pk=program_id)
        except Program.DoesNotExist:
            return Response(
                {'error': 'Program not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Find active participation
        participation = Participation.objects.filter(
            volunteer=volunteer,
            program=program,
            status=Participation.Status.ACTIVE
        ).first()

        if not participation:
            return Response(
                {'error': 'You are not currently participating in this program.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark as left
        participation.status = Participation.Status.LEFT
        participation.left_at = timezone.now()
        participation.save(update_fields=['status', 'left_at'])

        # Decrement count
        program.decrement_participants()

        # Trigger notifications
        NotificationService.notify_volunteer_left(volunteer, program)

        # Invalidate caches
        CacheService.invalidate_analytics_for_program(program)
        CacheService.invalidate_volunteer_analytics(volunteer.id)

        logger.info(
            f'Volunteer {volunteer.email} left program "{program.title}"'
        )

        return Response(
            {'message': f'Successfully left program "{program.title}".'},
            status=status.HTTP_200_OK
        )


class MyParticipationsView(generics.ListAPIView):
    """
    GET /api/v1/participation/my/
    List all programs the authenticated volunteer has participated in.
    Supports filtering by status (active/left).
    """
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_queryset(self):
        queryset = Participation.objects.filter(
            volunteer=self.request.user
        ).select_related('volunteer', 'program', 'program__created_by')

        # Filter by participation status
        participation_status = self.request.query_params.get('status')
        if participation_status in [Participation.Status.ACTIVE, Participation.Status.LEFT]:
            queryset = queryset.filter(status=participation_status)

        return queryset