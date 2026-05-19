import api from './api'

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get('/notifications/', { params })
    return response.data
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count/')
    return response.data
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/`, { is_read: true })
    return response.data
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark-all-read/')
    return response.data
  },
}
