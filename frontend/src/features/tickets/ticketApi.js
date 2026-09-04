import api from '../../services/api'

export const CATEGORIES = [
  'Hardware',
  'Software',
  'Network',
  'Account Access',
  'Security',
  'Other',
]

export async function createTicket(payload) {
  const response = await api.post('/api/tickets', payload)
  return response.data
}
