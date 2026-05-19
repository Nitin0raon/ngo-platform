from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Program

User = get_user_model()


class ProgramCreatorSerializer(serializers.ModelSerializer):
    """Minimal serializer for the NGO creator info embedded in Program."""
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'organization_name']


class ProgramSerializer(serializers.ModelSerializer):
    """
    Full program serializer for list/detail views.
    """
    created_by = ProgramCreatorSerializer(read_only=True)
    is_full = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Program
        fields = [
            'id', 'title', 'description', 'capacity',
            'current_participants', 'available_slots', 'is_full',
            'status', 'status_display', 'created_by',
            'start_date', 'end_date', 'location',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'current_participants', 'created_at', 'updated_at']


class ProgramCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating programs (NGO use only).
    """

    class Meta:
        model = Program
        fields = [
            'id', 'title', 'description', 'capacity',
            'status', 'start_date', 'end_date', 'location',
        ]
        read_only_fields = ['id']

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError('Capacity must be at least 1.')
        return value

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date cannot be before start date.'
            })
        return attrs

    def validate_status(self, value):
        # When updating, check that participants are handled properly
        if self.instance and value == Program.Status.CANCELLED:
            if self.instance.current_participants > 0:
                raise serializers.ValidationError(
                    'Cannot cancel a program with active participants.'
                )
        return value


class ProgramParticipantsSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing participants of a program (NGO view).
    """
    from apps.participation.models import Participation

    class ParticipantDetailSerializer(serializers.Serializer):
        volunteer_id = serializers.IntegerField(source='volunteer.id')
        volunteer_email = serializers.EmailField(source='volunteer.email')
        volunteer_name = serializers.CharField(source='volunteer.full_name')
        joined_at = serializers.DateTimeField()
        status = serializers.CharField()

    participations = ParticipantDetailSerializer(many=True, read_only=True)
    current_participants = serializers.ReadOnlyField()
    capacity = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()

    class Meta:
        model = Program
        fields = ['id', 'title', 'capacity', 'current_participants', 'available_slots', 'participations']