import { useEffect, useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} />

  const summaryCards = [
    { label: 'Total Tickets', value: stats.total_tickets },
    { label: 'Open', value: stats.open_tickets },
    { label: 'In Progress', value: stats.in_progress_tickets },
    { label: 'Resolved', value: stats.resolved_tickets },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-text-secondary">{card.label}</p>
            <p className="text-3xl font-bold text-navy mt-1">{card.value}</p>
          </Card>
        ))}
      </div>
      <p className="text-sm text-text-secondary mt-6">
        Ticket list, charts, and filters go here (features/dashboard).
      </p>
    </div>
  )
}
