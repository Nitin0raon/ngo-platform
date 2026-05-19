import { formatDistanceToNow } from 'date-fns'
import Button from './Button'

const typeConfig = {
  volunteer_joined: {
    icon: '🙋',
    color: 'bg-forest-50 border-forest-100',
    label: 'Joined',
  },
  volunteer_left: {
    icon: '👋',
    color: 'bg-amber-50 border-amber-100',
    label: 'Left',
  },
  program_full: {
    icon: '🎉',
    color: 'bg-indigo-50 border-indigo-100',
    label: 'Full',
  },
  program_completed: {
    icon: '✅',
    color: 'bg-gray-50 border-gray-100',
    label: 'Completed',
  },
  general: {
    icon: '📢',
    color: 'bg-blue-50 border-blue-100',
    label: 'Notice',
  },
}

export default function NotificationItem({ notification, onMarkRead }) {
  const config = typeConfig[notification.notification_type] || typeConfig.general

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  })

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
        notification.is_read
          ? 'bg-white border-gray-100'
          : `${config.color} shadow-sm`
      } animate-fade-in`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
        notification.is_read ? 'bg-gray-50' : config.color
      } border ${notification.is_read ? 'border-gray-100' : ''}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-snug ${
              notification.is_read ? 'text-gray-600 font-normal' : 'text-gray-900 font-medium'
            }`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                {notification.message}
              </p>
            )}
            {notification.program_title && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-100">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400" />
                {notification.program_title}
              </div>
            )}
          </div>

          {/* Unread dot */}
          {!notification.is_read && (
            <span className="w-2 h-2 rounded-full bg-forest-500 flex-shrink-0 mt-1 animate-pulse-soft" />
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-gray-400">{timeAgo}</span>
          {!notification.is_read && onMarkRead && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-[11px] text-forest-600 hover:text-forest-700 font-medium transition-colors"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
