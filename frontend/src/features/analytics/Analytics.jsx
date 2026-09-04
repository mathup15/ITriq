import { useEffect, useState } from 'react'
import { getDashboardStats, getTickets } from '../dashboard/dashboardApi'
import ErrorMessage from '../../components/ErrorMessage'

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Security', 'Other']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const PRIORITY_COLORS = {
  Critical: 'bg-red-500',
  High: 'bg-orange-400',
  Medium: 'bg-yellow-400',
  Low: 'bg-emerald-500',
}

const PRIORITY_LABELS = {
  Critical: '🔴',
  High: '🟠',
  Medium: '🟡',
  Low: '🟢',
}

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getDashboardStats(), getTickets()])
      .then(([s, t]) => { setStats(s); setTickets(t) })
      .catch(() => setError('Could not load analytics data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-slate-400 text-sm">Loading analytics...</div>
    </div>
  )
  if (error) return <div className="p-8"><ErrorMessage message={error} /></div>

  // Derived counts
  const categoryCounts = CATEGORIES.map((cat) => ({
    name: cat,
    count: tickets.filter((t) => t.category === cat || t.ai_category === cat).length,
  })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count)

  const priorityCounts = PRIORITIES.map((p) => ({
    name: p,
    count: tickets.filter((t) => t.priority === p || t.ai_priority === p).length,
  }))

  const aiTotal = tickets.filter((t) => t.ai_summary).length
  const aiApproved = tickets.filter((t) => t.human_approved && t.ai_summary).length
  const aiModified = tickets.filter((t) => t.human_approved && t.ai_summary && (t.category !== t.ai_category || t.priority !== t.ai_priority)).length
  const agreementRate = aiTotal > 0 ? Math.round(((aiApproved - aiModified) / aiTotal) * 100) : 0

  const maxCat = Math.max(...categoryCounts.map((c) => c.count), 1)

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-gradient-to-r from-navy via-slate to-navy text-white px-6 py-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-ai/20 text-cyan-ai border border-cyan-ai/30 mb-2">
            Analytics
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Analytics &amp; Insights</h1>
          <p className="text-slate-400 text-sm mt-1">Trends, categories, priorities, and AI performance</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Top stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets', value: stats?.total ?? 0, color: 'border-slate-700' },
            { label: 'Open', value: stats?.open ?? 0, color: 'border-blue-500' },
            { label: 'In Progress', value: stats?.in_progress ?? 0, color: 'border-amber-500' },
            { label: 'Resolved', value: stats?.resolved ?? 0, color: 'border-emerald-500' },
          ].map((c) => (
            <div key={c.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c.color} shadow-sm p-5`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{c.label}</p>
              <p className="text-3xl font-bold text-navy">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issues by Category */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-navy mb-4">Issues by Category</h2>
            {categoryCounts.length === 0 ? (
              <p className="text-slate-400 text-sm">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {categoryCounts.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{c.name}</span>
                      <span className="text-slate-500">{Math.round((c.count / tickets.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-brand-blue h-2 rounded-full transition-all"
                        style={{ width: `${(c.count / maxCat) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-navy mb-4">Priority Distribution</h2>
            <div className="space-y-3">
              {priorityCounts.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{PRIORITY_LABELS[p.name]}</span>
                    <span className="text-sm font-medium text-slate-700">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div
                        className={`${PRIORITY_COLORS[p.name]} h-2 rounded-full transition-all`}
                        style={{ width: tickets.length > 0 ? `${(p.count / tickets.length) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-bold text-navy w-4 text-right">{p.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Performance */}
        <div className="bg-white rounded-xl border border-cyan-ai/30 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-cyan-ai">✨</span>
            <h2 className="font-bold text-navy">AI Triage Performance</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-cyan-ai/10 text-cyan-ai border border-cyan-ai/20 font-medium">AI Generated</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'AI Recommendations', value: aiTotal, color: 'text-cyan-ai' },
              { label: 'Human Approved', value: aiApproved, color: 'text-emerald-600' },
              { label: 'Human Modified', value: aiModified, color: 'text-amber-600' },
              { label: 'Agreement Rate', value: `${agreementRate}%`, color: 'text-brand-blue' },
            ].map((m) => (
              <div key={m.label} className="text-center p-4 bg-slate-50 rounded-lg">
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
