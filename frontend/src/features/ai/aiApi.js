import api from '../../services/api'

/** Runs AI triage analysis on a ticket and returns the updated ticket. */
export function analyzeTicket(ticketId) {
  return api.post(`/api/tickets/${ticketId}/analyze`).then((res) => res.data)
}

/**
 * Saves the human's final category/priority decision (approval or
 * modification) and marks the ticket as human-approved. AI's own
 * ai_category/ai_priority/ai_summary fields are never touched by this call.
 */
export function saveDecision(ticketId, { category, priority }) {
  return api
    .put(`/api/tickets/${ticketId}`, { category, priority, human_approved: true })
    .then((res) => res.data)
}
