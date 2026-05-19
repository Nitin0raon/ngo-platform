import logging
from django.db import transaction
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Program
from .serializers import (
    ProgramSerializer,
    ProgramCreateUpdateSerializer,
    ProgramParticipantsSerializer,
)
from .permissions import IsNGO, IsNGOOwner
from .filters import ProgramFilter
from services.cache_service import CacheService

logger = logging.getLogger(__name__)


class ProgramListView(generics.ListAPIView):
    """
    GET /api/v1/programs/
    List all active programs. Accessible by authenticated users.
    Supports filtering by status, created_by, title. Supports pagination.
    """
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = ProgramFilter
    search_fields = ['title', 'description', 'created_by__organization_name']
    ordering_fields = ['created_at', 'title', 'capacity', 'current_participants']
    ordering = ['-created_at']

    def get_queryset(self):
        return Program.objects.select_related('created_by').all()


class ProgramCreateView(generics.CreateAPIView):
    """
    POST /api/v1/programs/create/
    Create a new program. Only NGOs can create programs.
    """
    serializer_class = ProgramCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def perform_create(self, serializer):
        program = serializer.save(created_by=self.request.user)
        # Invalidate NGO's analytics cache since they now have a new program
        CacheService.invalidate_ngo_dashboard(self.request.user.id)
        logger.info(f'Program created: "{program.title}" by NGO {self.request.user.email}')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'message': 'Program created successfully.',
                'program': serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class ProgramDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/programs/<id>/
    Retrieve a single program's details.
    """
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Program.objects.select_related('created_by').all()


class ProgramUpdateView(generics.UpdateAPIView):
    """
    PUT  /api/v1/programs/<id>/update/
    PATCH /api/v1/programs/<id>/update/
    Update a program. Only the owning NGO can update.
    """
    serializer_class = ProgramCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO, IsNGOOwner]
    queryset = Program.objects.all()

    def perform_update(self, serializer):
        program = serializer.save()
        CacheService.invalidate_ngo_dashboard(self.request.user.id)
        logger.info(f'Program updated: "{program.title}" by NGO {self.request.user.email}')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Program updated successfully.',
            'program': serializer.data
        })


class ProgramDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/v1/programs/<id>/delete/
    Delete a program. Only the owning NGO can delete.
    Cannot delete programs with active participants.
    """
    permission_classes = [permissions.IsAuthenticated, IsNGO, IsNGOOwner]
    queryset = Program.objects.all()

    def destroy(self, request, *args, **kwargs):
        program = self.get_object()

        if program.current_participants > 0:
            return Response(
                {'error': 'Cannot delete a program with active participants. Please mark it as completed or cancelled first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        program_title = program.title
        program.delete()
        CacheService.invalidate_ngo_dashboard(request.user.id)
        logger.info(f'Program deleted: "{program_title}" by NGO {request.user.email}')
        return Response(
            {'message': f'Program "{program_title}" deleted successfully.'},
            status=status.HTTP_200_OK
        )


class ProgramParticipantsView(generics.RetrieveAPIView):
    """
    GET /api/v1/programs/<id>/participants/
    View all participants of a program. Only the owning NGO can view.
    """
    serializer_class = ProgramParticipantsSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO, IsNGOOwner]

    def get_queryset(self):
        return Program.objects.prefetch_related(
            'participations__volunteer'
        ).all()

    def get_object(self):
        queryset = self.get_queryset()
        program = generics.get_object_or_404(queryset, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, program)
        return program


class MyProgramsView(generics.ListAPIView):
    """
    GET /api/v1/programs/my-programs/
    List programs created by the authenticated NGO.
    """
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO]
    filterset_class = ProgramFilter
    ordering_fields = ['created_at', 'title', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        return Program.objects.filter(
            created_by=self.request.user
        ).select_related('created_by').all()