import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import Button from '../../components/Button'
import AIRecommendation from '../ai/AIRecommendation'
import ApprovalPanel from '../ai/ApprovalPanel'
import { analyzeTicket, saveDecision } from '../ai/aiApi'
import StatusSelector from '../management/StatusSelector'

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [aiError, setAiError] = useState('')

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-navy mb-1">{ticket.title}</h1>
      <p className="text-sm text-text-secondary mb-6">
        Ticket #{ticket.id} &middot; Submitted by {ticket.name}
      </p>

      <Card className="mb-6">
        <p className="text-sm text-text-secondary whitespace-pre-wrap">{ticket.description}</p>
      </Card>

      {aiError && (
        <div className="mb-4">
          <ErrorMessage message={aiError} />
        </div>
      )}

      {hasAiRecommendation ? (
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
      )}

      <Card className="mt-6">
        <StatusSelector value={ticket.status} onChange={handleStatusChange} disabled={statusSaving} />
      </Card>
    </div>
  )
}
