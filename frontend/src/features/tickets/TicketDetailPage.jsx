import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import api from '../../services/api'
import TicketDetails from '../management/TicketDetails'

export default function TicketDetailPage() {
  const { id } = useParams()
  const invalidId = !/^\d+$/.test(id || '') || Number(id) < 1
  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState('Open')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [category, setCategory] = useState(null)
  const [priority, setPriority] = useState(null)
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    if (invalidId) return

    api.get(`/api/tickets/${id}`)
      .then(({ data }) => {
        if (!data || !data.id) throw new Error('Empty ticket response')
        setTicket(data)
        setStatus(data.status)
        setCategory(data.category)
        setPriority(data.priority)
        setApproved(data.human_approved)
      })
      .catch((requestError) => setError(requestError.response?.status === 404
        ? 'Ticket not found.'
        : 'Unable to load this ticket. Please try again.'))
      .finally(() => setLoading(false))
  }, [id, invalidId])

  async function saveStatus() {
    setSaving(true)
    setError('')
    try {
      const { data } = await api.put(`/api/tickets/${id}`, { status, category, priority, human_approved: approved })
      if (!data || !data.id) throw new Error('Empty update response')
      setTicket(data)
      setCategory(data.category)
      setPriority(data.priority)
      setApproved(data.human_approved)
    } catch (requestError) {
      setError(requestError.response?.status === 404
        ? 'Ticket not found.'
        : 'Unable to update this ticket. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function analyzeTicket() {
    setAnalyzing(true)
    setError('')
    try {
      const { data } = await api.post(`/api/tickets/${id}/analyze`)
      if (!data?.id) throw new Error('Empty analysis response')
      setTicket(data)
      setCategory(data.category)
      setPriority(data.priority)
    } catch {
      setError('Unable to analyze this ticket right now. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {invalidId && <ErrorMessage message="That ticket ID is not valid." />}
      {!invalidId && loading && <Loading label="Loading ticket..." />}
      {!invalidId && !loading && error && <ErrorMessage message={error} />}
      {!loading && !error && ticket && (
        <TicketDetails ticket={ticket} status={status} onStatusChange={setStatus} category={category} onCategoryChange={setCategory} priority={priority} onPriorityChange={setPriority} approved={approved} onApprovedChange={setApproved} onAnalyze={analyzeTicket} onSave={saveStatus} saving={saving} analyzing={analyzing} />
      )}
    </div>
  )
}
