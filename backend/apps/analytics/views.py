import logging
from django.db.models import Count, Q, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from apps.programs.models import Program
from apps.participation.models import Participation
from apps.programs.permissions import IsNGO, IsVolunteer
from services.cache_service import (
    CacheService,
    NGO_DASHBOARD_CACHE_TIMEOUT,
    VOLUNTEER_DASHBOARD_CACHE_TIMEOUT,
)

logger = logging.getLogger(__name__)


class NGODashboardView(APIView):
    """
    GET /api/v1/analytics/ngo-dashboard/
    Returns analytics dashboard for authenticated NGO.
    Results are cached in Redis for 5 minutes.
    """
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def get(self, request):
        cache_key = CacheService.ngo_dashboard_key(request.user.id)

        # Try cache first
        cached = CacheService.get(cache_key)
        if cached:
            cached['from_cache'] = True
            return Response(cached)

        # Build fresh dashboard data
        ngo = request.user

        programs = Program.objects.filter(created_by=ngo)
        total_programs = programs.count()

        # Aggregate counts
        program_stats = programs.aggregate(
            total_participants=Sum('current_participants'),
            active_count=Count('id', filter=Q(status=Program.Status.ACTIVE)),
            completed_count=Count('id', filter=Q(status=Program.Status.COMPLETED)),
            cancelled_count=Count('id', filter=Q(status=Program.Status.CANCELLED)),
        )

        # Per-program breakdown
        per_program = list(
            programs.values(
                'id', 'title', 'status', 'capacity', 'current_participants'
            ).annotate(
                fill_percentage=Count('participations', filter=Q(participations__status='active'))
            ).order_by('-current_participants')
        )

        # Most popular programs (by participants)
        top_programs = list(
            programs.filter(
                status=Program.Status.ACTIVE
            ).order_by('-current_participants').values(
                'id', 'title', 'current_participants', 'capacity'
            )[:5]
        )

        data = {
            'ngo_info': {
                'id': ngo.id,
                'organization_name': ngo.organization_name,
                'email': ngo.email,
            },
            'summary': {
                'total_programs': total_programs,
                'active_programs': program_stats['active_count'] or 0,
                'completed_programs': program_stats['completed_count'] or 0,
                'cancelled_programs': program_stats['cancelled_count'] or 0,
                'total_participants_across_programs': program_stats['total_participants'] or 0,
            },
            'top_programs_by_participation': top_programs,
            'per_program_breakdown': per_program,
            'from_cache': False,
        }

        # Store in cache
        CacheService.set(cache_key, data, timeout=NGO_DASHBOARD_CACHE_TIMEOUT)
        logger.info(f'NGO dashboard data computed and cached for user {ngo.email}')

        return Response(data)


class VolunteerDashboardView(APIView):
    """
    GET /api/v1/analytics/volunteer-dashboard/
    Returns analytics dashboard for authenticated Volunteer.
    Results are cached in Redis for 5 minutes.
    """
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get(self, request):
        cache_key = CacheService.volunteer_dashboard_key(request.user.id)

        # Try cache first
        cached = CacheService.get(cache_key)
        if cached:
            cached['from_cache'] = True
            return Response(cached)

        volunteer = request.user

        participations = Participation.objects.filter(volunteer=volunteer)
        total_joined = participations.count()

        # Status breakdown via related program status
        active_participations = participations.filter(
            status=Participation.Status.ACTIVE,
            program__status=Program.Status.ACTIVE
        ).count()

        completed_program_participations = participations.filter(
            program__status=Program.Status.COMPLETED
        ).count()

        currently_active = participations.filter(
            status=Participation.Status.ACTIVE
        ).count()

        left_programs = participations.filter(
            status=Participation.Status.LEFT
        ).count()

        # Recent activity
        recent_participations = list(
            participations.select_related('program', 'program__created_by').order_by(
                '-joined_at'
            ).values(
                'id',
                'status',
                'joined_at',
                'left_at',
                'program__id',
                'program__title',
                'program__status',
                'program__created_by__organization_name',
            )[:10]
        )

        data = {
            'volunteer_info': {
                'id': volunteer.id,
                'full_name': volunteer.full_name,
                'email': volunteer.email,
            },
            'summary': {
                'total_programs_joined': total_joined,
                'currently_active_participations': currently_active,
                'active_programs_count': active_participations,
                'completed_programs_count': completed_program_participations,
                'left_programs_count': left_programs,
            },
            'recent_activity': recent_participations,
            'from_cache': False,
        }

        CacheService.set(cache_key, data, timeout=VOLUNTEER_DASHBOARD_CACHE_TIMEOUT)
        logger.info(f'Volunteer dashboard data computed and cached for user {volunteer.email}')

        return Response(data)