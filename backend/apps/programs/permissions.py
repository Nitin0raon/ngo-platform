from rest_framework.permissions import BasePermission


class IsNGO(BasePermission):
    """Allow access only to users with the NGO role."""
    message = 'Only NGO accounts can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ngo'
        )


class IsVolunteer(BasePermission):
    """Allow access only to users with the Volunteer role."""
    message = 'Only Volunteer accounts can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'volunteer'
        )


class IsNGOOwner(BasePermission):
    """Allow NGO to manage only their own programs."""
    message = 'You do not have permission to modify this program.'

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ngo' and
            obj.created_by == request.user
        )