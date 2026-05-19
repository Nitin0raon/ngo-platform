from rest_framework import serializers
from .models import Participation
from apps.programs.serializers import ProgramSerializer


class ParticipationSerializer(serializers.ModelSerializer):
    """
    Full participation serializer with nested program info.
    """
    program = ProgramSerializer(read_only=True)
    volunteer_email = serializers.EmailField(source='volunteer.email', read_only=True)
    volunteer_name = serializers.CharField(source='volunteer.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Participation
        fields = [
            'id', 'volunteer_email', 'volunteer_name',
            'program', 'status', 'status_display',
            'joined_at', 'left_at',
        ]
        read_only_fields = ['id', 'joined_at', 'left_at', 'status']


class JoinProgramSerializer(serializers.Serializer):
    """
    Serializer for joining a program. Only requires program_id.
    """
    program_id = serializers.IntegerField()

    def validate_program_id(self, value):
        from apps.programs.models import Program
        try:
            program = Program.objects.get(pk=value)
        except Program.DoesNotExist:
            raise serializers.ValidationError('Program not found.')

        if program.status != Program.Status.ACTIVE:
            raise serializers.ValidationError('This program is not active.')

        if program.is_full:
            raise serializers.ValidationError('This program is at full capacity.')

        return value