import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets } from '../dashboard/dashboardApi'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

const TABS = ['All', 'Open', 'In Progress', 'Resolved']

const priorityColor = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
}

const statusColor = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function MyTickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => setError('Could not load your tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tickets.filter((t) => {
    const matchTab = tab === 'All' || t.status === tab
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-navy">My Support Tickets</h1>
          <p className="text-text-secondary text-sm mt-1">Track the status of your IT requests.</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your tickets..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-lg p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                tab === t ? 'bg-brand-blue text-white' : 'text-slate-600 hover:text-navy'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading label="Loading tickets..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-3">🎫</div>
            <p className="text-slate-600 font-medium">No tickets found</p>
            <p className="text-slate-400 text-sm mt-1">
              {search ? 'Try a different search term.' : 'No tickets in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-brand-blue/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">#{t.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[t.status] || 'bg-slate-100 text-slate-600'}`}>
                        {t.status}
                      </span>
                      {t.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[t.priority] || 'bg-slate-100 text-slate-600'}`}>
                          {t.priority}
                        </span>
                      )}
                      {t.category && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{t.category}</span>
                      )}
                    </div>
                    <p className="font-semibold text-navy text-sm">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-1">Updated {timeAgo(t.updated_at || t.created_at)}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="shrink-0 text-xs font-medium text-brand-blue hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-brand-blue/30 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
