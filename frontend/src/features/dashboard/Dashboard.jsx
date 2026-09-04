import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCards from './StatCards'
import TicketFilters from './TicketFilters'
import TicketList from './TicketList'
import { getDashboardStats, getTickets } from './dashboardApi'
import ErrorMessage from '../../components/ErrorMessage'
import { useRole } from '../../context/RoleContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useRole()
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('All')
  const [status, setStatus] = useState('All')

  const refreshAll = useCallback(() => {
    setLoadingStats(true)
    setLoadingTickets(true)
    getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError('Could not load dashboard statistics.'))
      .finally(() => setLoadingStats(false))
    getTickets({ search: searchTerm, category, priority, status })
      .then((data) => setTickets(data))
      .catch(() => setError('Could not load tickets.'))
      .finally(() => setLoadingTickets(false))
  }, [searchTerm, category, priority, status])

  useEffect(() => {
    let isMounted = true
    getDashboardStats()
      .then((data) => { if (isMounted) setStats(data) })
      .catch(() => { if (isMounted) setError('Could not load dashboard statistics.') })
      .finally(() => { if (isMounted) setLoadingStats(false) })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    const t = setTimeout(() => {
      setLoadingTickets(true)
      getTickets({ search: searchTerm, category, priority, status })
        .then((data) => { if (isMounted) setTickets(data) })
        .catch(() => { if (isMounted) setError('Could not load tickets.') })
        .finally(() => { if (isMounted) setLoadingTickets(false) })
    }, 200)
    return () => { isMounted = false; clearTimeout(t) }
  }, [searchTerm, category, priority, status])

  const handleResetFilters = () => {
    setSearchTerm(''); setCategory('All'); setPriority('All'); setStatus('All')
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'Team'

  // Critical + High tickets for alert section
  const urgentTickets = tickets
    .filter((t) => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Resolved')
    .slice(0, 4)

  // AI stats
  const aiTotal = tickets.filter((t) => t.ai_summary).length
  const aiApproved = tickets.filter((t) => t.human_approved).length
  const agreementRate = aiTotal > 0 ? Math.round((aiApproved / aiTotal) * 100) : 0

  const priorityBadge = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] px-6 py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                🛠️ Support Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Here's your IT support overview. {stats?.open > 0 ? `${stats.open} ticket${stats.open !== 1 ? 's' : ''} need attention.` : 'All caught up!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* AI performance mini-strip */}
            <div className="hidden lg:flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3">
              <div className="text-center">
                <p className="text-cyan-400 font-bold text-lg leading-none">{aiTotal}</p>
                <p className="text-slate-500 text-xs mt-0.5">AI Triaged</p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <p className="text-emerald-400 font-bold text-lg leading-none">{agreementRate}%</p>
                <p className="text-slate-500 text-xs mt-0.5">Approved</p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <p className="text-white font-bold text-lg leading-none">{stats?.resolved ?? 0}</p>
                <p className="text-slate-500 text-xs mt-0.5">Resolved</p>
              </div>
            </div>

            <button
              onClick={refreshAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {error && <ErrorMessage message={error} />}

        {/* ── KPI Cards ── */}
        <StatCards stats={stats} loading={loadingStats} />

        {/* ── Priority Alert + AI Performance (side by side on lg) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Priority Alert — takes 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-red-50/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <h2 className="font-bold text-navy text-sm">Attention Required</h2>
                  <p className="text-xs text-slate-500">
                    {urgentTickets.length > 0
                      ? `${urgentTickets.length} ticket${urgentTickets.length !== 1 ? 's' : ''} need immediate attention`
                      : 'No urgent tickets right now'}
                  </p>
                </div>
              </div>
              {urgentTickets.length > 0 && (
                <button
                  onClick={() => navigate('/tickets')}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                >
                  Review All
                </button>
              )}
            </div>

            {urgentTickets.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-slate-500 text-sm font-medium">No urgent tickets</p>
                <p className="text-slate-400 text-xs mt-0.5">All critical and high priority issues are resolved.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {urgentTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${priorityBadge[t.priority] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {t.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate group-hover:text-brand-blue transition-colors">{t.title}</p>
                      <p className="text-xs text-slate-400">{t.name} · {t.category}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 shrink-0">#{t.id}</span>
                    <svg className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Performance card — 1 col */}
          <div className="bg-white rounded-xl border border-cyan-200/60 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-cyan-50/40 flex items-center gap-2">
              <span className="text-cyan-500">✨</span>
              <h2 className="font-bold text-navy text-sm">AI Performance</h2>
              <span className="ml-auto text-xs bg-cyan-100 text-cyan-600 border border-cyan-200 px-2 py-0.5 rounded-full font-medium">Live</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Tickets Analyzed', value: aiTotal, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'Human Approved', value: aiApproved, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Agreement Rate', value: `${agreementRate}%`, color: 'text-brand-blue', bg: 'bg-blue-50' },
              ].map((m) => (
                <div key={m.label} className={`flex items-center justify-between ${m.bg} rounded-lg px-4 py-3`}>
                  <span className="text-xs text-slate-600 font-medium">{m.label}</span>
                  <span className={`text-lg font-extrabold ${m.color}`}>{m.value}</span>
                </div>
              ))}
              <div className="pt-1">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>AI Approval Rate</span>
                  <span className="font-semibold text-navy">{agreementRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-brand-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${agreementRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <TicketFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          priority={priority}
          onPriorityChange={setPriority}
          status={status}
          onStatusChange={setStatus}
          onReset={handleResetFilters}
        />

        {/* ── Ticket List ── */}
        <TicketList tickets={tickets} loading={loadingTickets} />
      </main>
    </div>
  )
}
