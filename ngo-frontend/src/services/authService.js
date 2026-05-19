import api from './api'

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register/', data)
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password })
    return response.data
  },

  async logout(refreshToken) {
    try {
      await api.post('/auth/logout/', { refresh: refreshToken })
    } catch {
      // Swallow errors — still clear local state
    }
  },

  async getProfile() {
    const response = await api.get('/auth/profile/')
    return response.data
  },

  async updateProfile(data) {
    const response = await api.patch('/auth/profile/', data)
    return response.data
  },

  async changePassword(data) {
    const response = await api.put('/auth/change-password/', data)
    return response.data
  },
}
