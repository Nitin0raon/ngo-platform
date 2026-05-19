import django_filters
from .models import Program


class ProgramFilter(django_filters.FilterSet):
    """
    Filter set for programs.
    Supports filtering by status, NGO (created_by), and date range.
    """
    status = django_filters.ChoiceFilter(choices=Program.Status.choices)
    created_by = django_filters.NumberFilter(field_name='created_by__id')
    created_by_email = django_filters.CharFilter(
        field_name='created_by__email',
        lookup_expr='icontains'
    )
    title = django_filters.CharFilter(lookup_expr='icontains')
    start_date_from = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_to = django_filters.DateFilter(field_name='start_date', lookup_expr='lte')
    has_capacity = django_filters.BooleanFilter(method='filter_has_capacity')

    class Meta:
        model = Program
        fields = ['status', 'created_by', 'title']

    def filter_has_capacity(self, queryset, name, value):
        if value:
            # Programs where current_participants < capacity
            from django.db.models import F
            return queryset.filter(current_participants__lt=F('capacity'))
        return queryset