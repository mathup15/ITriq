import api from '../../services/api'

/**
 * Fetch high-level statistics for the support dashboard.
 * Returns { total, open, in_progress, resolved, high_priority }
 */
export async function getDashboardStats() {
  const response = await api.get('/api/dashboard/stats')
  return response.data
}

/**
 * Fetch tickets with optional search and filter parameters.
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {string} [filters.category]
 * @param {string} [filters.priority]
 * @param {string} [filters.status]
 */
export async function getTickets(filters = {}) {
  const params = {}
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim()
  }
  if (filters.category && filters.category !== 'All') {
    params.category = filters.category
  }
  if (filters.priority && filters.priority !== 'All') {
    params.priority = filters.priority
  }
  if (filters.status && filters.status !== 'All') {
    params.status = filters.status
  }

  const response = await api.get('/api/tickets', { params })
  return response.data
}
