import { useState, useEffect, useCallback, useRef } from 'react'
import { programService } from '../services/programService'
import { notificationService } from '../services/notificationService'

// ─── Generic async hook ───────────────────────────────────────────────────────
export function useAsync(asyncFn, deps = [], runOnMount = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(runOnMount)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      if (mountedRef.current) {
        setData(result)
        return result
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err?.response?.data || err?.message || 'An error occurred')
      }
      throw err
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, deps)

  useEffect(() => {
    if (runOnMount) execute()
  }, [execute])

  return { data, loading, error, execute, setData }
}

// ─── Programs hook ────────────────────────────────────────────────────────────
export function usePrograms(params = {}) {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(params)

  const fetchPrograms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await programService.getPrograms({ ...filters, page })
      setPrograms(data.results || [])
      setPagination({ count: data.count, next: data.next, previous: data.previous })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load programs')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchPrograms() }, [fetchPrograms])

  const applyFilter = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1)
  }, [])

  return { programs, loading, error, pagination, page, setPage, applyFilter, refetch: fetchPrograms }
}

// ─── Notifications hook ───────────────────────────────────────────────────────
export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const [notifData, countData] = await Promise.all([
        notificationService.getNotifications(params),
        notificationService.getUnreadCount(),
      ])
      setNotifications(notifData.results || [])
      setUnreadCount(countData.unread_count || 0)
    } catch {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch {}
  }, [])

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, refetch: fetchNotifications }
}

// ─── Dashboard hook ───────────────────────────────────────────────────────────
export function useDashboard(role) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      try {
        const result = role === 'ngo'
          ? await programService.getNGODashboard()
          : await programService.getVolunteerDashboard()
        setData(result)
      } catch {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    if (role) fetchDashboard()
  }, [role])

  return { data, loading, error }
}
