import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets } from '../features/dashboard/dashboardApi'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

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

export default function EmployeeHome() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => setError('Could not load your tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const total = tickets.length
  const open = tickets.filter((t) => t.status === 'Open').length
  const resolved = tickets.filter((t) => t.status === 'Resolved').length
  const recent = tickets.slice(0, 5)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
            {greeting}, John 👋
          </h1>
          <p className="text-text-secondary mt-1">How can we help you today?</p>
        </div>

        {/* Primary CTA */}
        <div
          onClick={() => navigate('/submit')}
          className="bg-gradient-to-br from-navy to-slate rounded-2xl p-8 cursor-pointer hover:shadow-lg transition-shadow group"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-3xl mb-2">🛠️</div>
              <h2 className="text-white text-xl font-bold mb-1">Having an IT problem?</h2>
              <p className="text-slate-300 text-sm">
                Tell us what happened and our support team will help you.
              </p>
            </div>
            <button className="shrink-0 bg-brand-blue hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer group-hover:bg-blue-700">
              + Report an Issue
            </button>
          </div>
        </div>

        {/* Activity stats */}
        <div>
          <h2 className="text-base font-bold text-navy mb-3">My Support Activity</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total', value: total, color: 'border-slate-400' },
              { label: 'Open', value: open, color: 'border-blue-500' },
              { label: 'Resolved', value: resolved, color: 'border-emerald-500' },
            ].map((c) => (
              <div key={c.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c.color} shadow-sm p-4 text-center`}>
                <p className="text-2xl font-bold text-navy">{loading ? '—' : c.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tickets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-navy">Recent Tickets</h2>
            <button
              onClick={() => navigate('/my-tickets')}
              className="text-xs text-brand-blue hover:underline font-medium cursor-pointer"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <Loading label="Loading tickets..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : recent.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <div className="text-4xl mb-3">🎫</div>
              <p className="text-slate-600 font-medium">No tickets yet</p>
              <p className="text-slate-400 text-sm mt-1">Submit your first IT issue to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-brand-blue/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">#{t.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[t.status] || 'bg-slate-100 text-slate-600'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="font-semibold text-navy text-sm truncate">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {t.category && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{t.category}</span>
                        )}
                        {t.priority && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[t.priority] || 'bg-slate-100 text-slate-600'}`}>
                            {t.priority}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">{timeAgo(t.updated_at || t.created_at)}</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
