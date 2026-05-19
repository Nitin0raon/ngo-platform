import logging
from django.core.cache import cache

logger = logging.getLogger(__name__)

# Cache timeouts in seconds
ANALYTICS_CACHE_TIMEOUT = 300        # 5 minutes
NGO_DASHBOARD_CACHE_TIMEOUT = 300    # 5 minutes
VOLUNTEER_DASHBOARD_CACHE_TIMEOUT = 300  # 5 minutes


class CacheService:
    """
    Centralized cache service for Redis-based caching.
    All cache keys are managed here to avoid collisions.
    """

    # ─── Key Builders ────────────────────────────────────────────────────────

    @staticmethod
    def ngo_dashboard_key(user_id: int) -> str:
        return f'analytics:ngo_dashboard:{user_id}'

    @staticmethod
    def volunteer_dashboard_key(user_id: int) -> str:
        return f'analytics:volunteer_dashboard:{user_id}'

    @staticmethod
    def program_list_key(query_params: str) -> str:
        return f'programs:list:{query_params}'

    # ─── Get / Set / Delete ───────────────────────────────────────────────────

    @classmethod
    def get(cls, key: str):
        try:
            value = cache.get(key)
            if value is not None:
                logger.debug(f'Cache HIT: {key}')
            else:
                logger.debug(f'Cache MISS: {key}')
            return value
        except Exception as e:
            logger.warning(f'Cache GET error for key {key}: {str(e)}')
            return None

    @classmethod
    def set(cls, key: str, value, timeout: int = 300):
        try:
            cache.set(key, value, timeout=timeout)
            logger.debug(f'Cache SET: {key} (TTL={timeout}s)')
        except Exception as e:
            logger.warning(f'Cache SET error for key {key}: {str(e)}')

    @classmethod
    def delete(cls, key: str):
        try:
            cache.delete(key)
            logger.debug(f'Cache DELETE: {key}')
        except Exception as e:
            logger.warning(f'Cache DELETE error for key {key}: {str(e)}')

    @classmethod
    def delete_pattern(cls, pattern: str):
        """Delete all cache keys matching a pattern."""
        try:
            cache.delete_pattern(f'*{pattern}*')
            logger.debug(f'Cache DELETE pattern: *{pattern}*')
        except Exception as e:
            logger.warning(f'Cache DELETE pattern error for {pattern}: {str(e)}')

    # ─── Convenience Methods ──────────────────────────────────────────────────

    @classmethod
    def invalidate_ngo_dashboard(cls, user_id: int):
        """Invalidate NGO dashboard cache when their data changes."""
        cls.delete(cls.ngo_dashboard_key(user_id))

    @classmethod
    def invalidate_volunteer_dashboard(cls, user_id: int):
        """Invalidate volunteer dashboard cache when their data changes."""
        cls.delete(cls.volunteer_dashboard_key(user_id))

    @classmethod
    def invalidate_analytics_for_program(cls, program):
        """
        Invalidate all analytics caches related to a program.
        Called whenever participation changes occur.
        """
        # Invalidate the NGO's dashboard who owns this program
        cls.invalidate_ngo_dashboard(program.created_by_id)
        logger.info(f'Invalidated analytics cache for NGO {program.created_by_id}')

    @classmethod
    def invalidate_volunteer_analytics(cls, volunteer_id: int):
        """Invalidate volunteer's dashboard cache."""
        cls.invalidate_volunteer_dashboard(volunteer_id)
        logger.info(f'Invalidated analytics cache for volunteer {volunteer_id}')