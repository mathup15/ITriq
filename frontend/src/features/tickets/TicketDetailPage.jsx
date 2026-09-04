import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import api from '../../services/api'
import TicketDetails from '../management/TicketDetails'

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState('Open')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!/^\d+$/.test(id || '') || Number(id) < 1) {
      setError('That ticket ID is not valid.')
      setLoading(false)
      return
    }

    api.get(`/api/tickets/${id}`)
      .then(({ data }) => {
        if (!data || !data.id) throw new Error('Empty ticket response')
        setTicket(data)
        setStatus(data.status)
      })
      .catch((requestError) => setError(requestError.response?.status === 404
        ? 'Ticket not found.'
        : 'Unable to load this ticket. Please try again.'))
      .finally(() => setLoading(false))
  }, [id])

  async function saveStatus() {
    setSaving(true)
    setError('')
    try {
      const { data } = await api.put(`/api/tickets/${id}`, { status })
      if (!data || !data.id) throw new Error('Empty update response')
      setTicket(data)
    } catch (requestError) {
      setError(requestError.response?.status === 404
        ? 'Ticket not found.'
        : 'Unable to update this ticket. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {loading && <Loading label="Loading ticket..." />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && ticket && (
        <TicketDetails ticket={ticket} status={status} onStatusChange={setStatus} onSave={saveStatus} saving={saving} />
      )}
    </div>
  )
}
