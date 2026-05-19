import api from './api'

export const programService = {
  async getPrograms(params = {}) {
    const response = await api.get('/programs/', { params })
    return response.data
  },

  async getProgram(id) {
    const response = await api.get(`/programs/${id}/`)
    return response.data
  },

  async createProgram(data) {
    const response = await api.post('/programs/create/', data)
    return response.data
  },

  async updateProgram(id, data) {
    const response = await api.patch(`/programs/${id}/update/`, data)
    return response.data
  },

  async deleteProgram(id) {
    const response = await api.delete(`/programs/${id}/delete/`)
    return response.data
  },

  async getMyPrograms(params = {}) {
    const response = await api.get('/programs/my-programs/', { params })
    return response.data
  },

  async getProgramParticipants(id) {
    const response = await api.get(`/programs/${id}/participants/`)
    return response.data
  },

  async joinProgram(programId) {
    const response = await api.post('/participation/join/', { program_id: programId })
    return response.data
  },

  async leaveProgram(programId) {
    const response = await api.post('/participation/leave/', { program_id: programId })
    return response.data
  },

  async getMyParticipations(params = {}) {
    const response = await api.get('/participation/my/', { params })
    return response.data
  },

  async getNGODashboard() {
    const response = await api.get('/analytics/ngo-dashboard/')
    return response.data
  },

  async getVolunteerDashboard() {
    const response = await api.get('/analytics/volunteer-dashboard/')
    return response.data
  },
}
