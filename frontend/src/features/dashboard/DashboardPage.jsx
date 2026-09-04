import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    Promise.all([api.get('/api/dashboard/stats'), api.get('/api/tickets')])
      .then(([statsResponse, ticketsResponse]) => {
        if (!statsResponse.data || !Array.isArray(ticketsResponse.data)) throw new Error('Invalid response')
        setStats(statsResponse.data)
        setTickets(ticketsResponse.data)
      })
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

  const visibleTickets = filter === 'All' ? tickets : tickets.filter((ticket) => ticket.status === filter)

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
      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-navy">Recent tickets</h2>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-navy">
          {['All', 'Open', 'In Progress', 'Resolved'].map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {visibleTickets.length === 0 ? <p className="p-5 text-sm text-text-secondary">No tickets match this filter.</p> : (
          <div className="divide-y divide-slate-200">
            {visibleTickets.map((ticket) => (
              <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="block p-4 hover:bg-slate-50">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium text-navy">#{ticket.id} {ticket.title}</span><span className="text-sm text-text-secondary">{ticket.status}</span></div>
                <p className="mt-1 text-sm text-text-secondary">{ticket.category || 'Uncategorized'} · {ticket.priority || 'No priority'} · {ticket.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
