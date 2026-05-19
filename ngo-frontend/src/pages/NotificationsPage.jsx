import { useState } from 'react'
import { useNotifications } from '../hooks'
import MainLayout from '../layouts/MainLayout'
import NotificationItem from '../components/NotificationItem'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { PageLoader } from '../components/Loader'

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
]

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, refetch } = useNotifications()
  const [filter, setFilter] = useState('all')
  const [markingAll, setMarkingAll] = useState(false)

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read
    if (filter === 'read') return n.is_read
    return true
  })

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    await markAllAsRead()
    setMarkingAll(false)
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-semibold text-gray-900">
              Notifications
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              loading={markingAll}
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit animate-slide-up">
          {filterOptions.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filter === f.value
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
              {f.value === 'unread' && unreadCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  filter === 'unread' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <PageLoader />
        ) : error ? (
          <div className="card p-8 text-center">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              type="notifications"
              title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              description={
                filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : "When volunteers join or leave your programs, you'll see notifications here."
              }
            />
          </div>
        ) : (
          <div className="space-y-2 animate-slide-up">
            {/* Unread section */}
            {filter === 'all' && filtered.some(n => !n.is_read) && (
              <>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="w-2 h-2 rounded-full bg-forest-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    New
                  </span>
                </div>
                {filtered.filter(n => !n.is_read).map(n => (
                  <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
                ))}
              </>
            )}

            {/* Read section */}
            {filter === 'all' && filtered.some(n => n.is_read) && (
              <>
                <div className="flex items-center gap-2 mt-6 mb-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                    Earlier
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                {filtered.filter(n => n.is_read).map(n => (
                  <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
                ))}
              </>
            )}

            {/* Non-"all" filter: just show flat list */}
            {filter !== 'all' && filtered.map(n => (
              <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
            ))}

            {/* Footer summary */}
            {filtered.length > 0 && (
              <div className="text-center pt-6 pb-2">
                <p className="text-xs text-gray-300">
                  Showing {filtered.length} of {notifications.length} notifications
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
