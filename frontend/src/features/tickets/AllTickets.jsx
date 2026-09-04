import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets } from '../dashboard/dashboardApi'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

const CATEGORIES = ['All', 'Hardware', 'Software', 'Network', 'Account Access', 'Security', 'Other']
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical']
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved']

const priorityColor = {
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-blue-100 text-blue-700 border-blue-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
}

const statusColor = {
  Open: 'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
  Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AllTickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('All')
  const [status, setStatus] = useState('All')

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      getTickets({ search, category, priority, status })
        .then(setTickets)
        .catch(() => setError('Could not load tickets.'))
        .finally(() => setLoading(false))
    }, 200)
    return () => clearTimeout(t)
  }, [search, category, priority, status])

  const hasFilters = search || category !== 'All' || priority !== 'All' || status !== 'All'

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-navy">All Support Tickets</h1>
          <p className="text-text-secondary text-sm mt-1">Manage and resolve all IT support requests.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: category, onChange: setCategory, options: CATEGORIES, label: 'Category' },
                { value: priority, onChange: setPriority, options: PRIORITIES, label: 'Priority' },
                { value: status, onChange: setStatus, options: STATUSES, label: 'Status' },
              ].map((f) => (
                <select
                  key={f.label}
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>{f.label}: {o}</option>
                  ))}
                </select>
              ))}
              {hasFilters && (
                <button
                  onClick={() => { setSearch(''); setCategory('All'); setPriority('All'); setStatus('All') }}
                  className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <Loading label="Loading tickets..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-3">🎫</div>
            <p className="text-slate-600 font-medium">No tickets found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setCategory('All'); setPriority('All'); setStatus('All') }}
                className="mt-3 text-sm text-brand-blue hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500 font-medium">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</p>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-6">Issue</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Priority</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">AI</th>
                    <th className="py-3 px-6">Updated</th>
                    <th className="py-3 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-400">#{t.id}</td>
                      <td className="py-3.5 px-6">
                        <p className="font-medium text-navy group-hover:text-brand-blue transition-colors">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.name}</p>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{t.category || '—'}</span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityColor[t.priority] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {t.priority || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusColor[t.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        {t.ai_summary ? (
                          <span className="text-xs text-cyan-ai font-medium">✨ Ready</span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-400">{timeAgo(t.updated_at || t.created_at)}</td>
                      <td className="py-3.5 px-6">
                        <button
                          onClick={() => navigate(`/tickets/${t.id}`)}
                          className="text-xs font-medium text-brand-blue hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-brand-blue/30 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-xs text-slate-400">#{t.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusColor[t.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{t.status}</span>
                    {t.ai_summary && <span className="text-xs text-cyan-ai font-medium">✨ AI Ready</span>}
                  </div>
                  <p className="font-semibold text-navy text-sm">{t.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.category && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{t.category}</span>}
                    {t.priority && <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${priorityColor[t.priority] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{t.priority}</span>}
                    <span className="text-xs text-slate-400 ml-auto">{timeAgo(t.updated_at || t.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
