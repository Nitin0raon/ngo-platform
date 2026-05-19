import logging
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer

logger = logging.getLogger(__name__)


class NotificationListView(generics.ListAPIView):
    """
    GET /api/v1/notifications/
    List all notifications for the authenticated user.
    Supports filtering by is_read status.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(recipient=self.request.user)

        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            is_read_bool = is_read.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(is_read=is_read_bool)

        return queryset


class NotificationDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/v1/notifications/<id>/
    PATCH /api/v1/notifications/<id>/ → mark as read
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Only allow updating is_read field
        serializer = self.get_serializer(
            instance,
            data={'is_read': request.data.get('is_read', True)},
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class MarkAllReadView(APIView):
    """
    POST /api/v1/notifications/mark-all-read/
    Mark all notifications as read for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)

        logger.info(f'User {request.user.email} marked {count} notifications as read.')
        return Response(
            {'message': f'{count} notifications marked as read.'},
            status=status.HTTP_200_OK
        )


class UnreadCountView(APIView):
    """
    GET /api/v1/notifications/unread-count/
    Returns count of unread notifications for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})