import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import Button from '../../components/Button'
import AIRecommendation from '../ai/AIRecommendation'
import ApprovalPanel from '../ai/ApprovalPanel'
import { analyzeTicket, saveDecision } from '../ai/aiApi'
import StatusSelector from '../management/StatusSelector'
import { useRole } from '../../context/RoleContext'

export default function TicketDetailPage() {
  const { role } = useRole()
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [aiError, setAiError] = useState('')
  const isSupport = role === 'support'

  useEffect(() => {
    api
      .get(`/api/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .catch(() => setLoadError('Could not load ticket.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setAiError('')
    try {
      const updated = await analyzeTicket(id)
      setTicket(updated)
    } catch {
      // AI analysis unavailable: the ticket is untouched and can still be
      // classified manually below, so this never blocks the workflow.
      setAiError('AI analysis unavailable. Manual classification required.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleApprove = async () => {
    setSaving(true)
    setAiError('')
    try {
      const updated = await saveDecision(id, {
        category: ticket.ai_category,
        priority: ticket.ai_priority,
      })
      setTicket(updated)
    } catch {
      setAiError('Could not save the decision. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleModify = async (category, priority) => {
    setSaving(true)
    setAiError('')
    try {
      const updated = await saveDecision(id, { category, priority })
      setTicket(updated)
    } catch {
      setAiError('Could not save the decision. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (status) => {
    setStatusSaving(true)
    setAiError('')
    try {
      const { data } = await api.put(`/api/tickets/${id}`, { status })
      setTicket(data)
    } catch {
      setAiError('Could not update the ticket status. Please try again.')
    } finally {
      setStatusSaving(false)
    }
  }

  if (loading) return <Loading label="Loading ticket..." />
  if (loadError) return <ErrorMessage message={loadError} />

  const hasAiRecommendation = Boolean(ticket.ai_summary)

  const statusColor = { Open: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-amber-100 text-amber-700', Resolved: 'bg-emerald-100 text-emerald-700' }
  const priorityColor = { Low: 'bg-emerald-100 text-emerald-700', Medium: 'bg-blue-100 text-blue-700', High: 'bg-orange-100 text-orange-700', Critical: 'bg-red-100 text-red-700' }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-5 transition-colors cursor-pointer group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="flex items-start justify-between gap-3 mb-1">
        <h1 className="text-2xl font-bold text-navy">{ticket.title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm text-text-secondary">Ticket #{ticket.id} &middot; {ticket.name}</span>
        {ticket.status && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[ticket.status] || 'bg-slate-100 text-slate-600'}`}>{ticket.status}</span>}
        {ticket.priority && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[ticket.priority] || 'bg-slate-100 text-slate-600'}`}>{ticket.priority}</span>}
        {ticket.category && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{ticket.category}</span>}
      </div>

      <Card className="mb-6">
        <p className="text-sm text-text-secondary whitespace-pre-wrap">{ticket.description}</p>
      </Card>

      {aiError && (
        <div className="mb-4">
          <ErrorMessage message={aiError} />
        </div>
      )}

      {isSupport && (
        hasAiRecommendation ? (
          <AIRecommendation category={ticket.ai_category} priority={ticket.ai_priority} summary={ticket.ai_summary}>
            <ApprovalPanel ticket={ticket} onApprove={handleApprove} onModify={handleModify} saving={saving} />
          </AIRecommendation>
        ) : (
          <Card className="mb-6">
            <p className="text-sm text-text-secondary mb-3">No AI recommendation yet for this ticket.</p>
            <Button variant="ai" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
            </Button>
          </Card>
        )
      )}

      {isSupport && (
        <Card className="mt-6">
          <StatusSelector value={ticket.status} onChange={handleStatusChange} disabled={statusSaving} />
        </Card>
      )}
    </div>
  )
}
