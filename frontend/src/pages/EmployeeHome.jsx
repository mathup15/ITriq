import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets } from '../features/dashboard/dashboardApi'
import { useRole } from '../context/RoleContext'
import Loading from '../components/Loading'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const priorityColor = {
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-blue-100 text-blue-700 border-blue-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
}

const statusColor = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
}

const statusDot = {
  Open: 'bg-blue-500',
  'In Progress': 'bg-amber-500',
  Resolved: 'bg-emerald-500',
}

export default function EmployeeHome() {
  const navigate = useNavigate()
  const { user } = useRole()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = tickets.length
  const open = tickets.filter((t) => t.status === 'Open').length
  const inProgress = tickets.filter((t) => t.status === 'In Progress').length
  const resolved = tickets.filter((t) => t.status === 'Resolved').length
  const recent = tickets.slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-6 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

          {/* Left: greeting + CTA */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                ✨ AI-Powered Support
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-400 text-base mb-6 max-w-md">
              Having an IT problem? Submit a ticket and our AI will instantly classify and prioritise your issue for the support team.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/submit')}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-blue-900/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report an Issue
              </button>
              <button
                onClick={() => navigate('/my-tickets')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-white/20 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Tickets
              </button>
            </div>
          </div>

          {/* Right: AI triage preview card */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-slate-800/60 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-cyan-400 text-sm">✨</span>
                <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">AI Triage</span>
                <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">Live</span>
              </div>
              <p className="text-white text-sm font-semibold mb-4">WiFi connection failed</p>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Category', value: 'Network', valueClass: 'text-white' },
                  { label: 'Priority', value: 'HIGH', valueClass: 'text-red-400 font-bold' },
                  { label: 'Confidence', value: '94%', valueClass: 'text-cyan-400 font-bold' },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-slate-400">{r.label}</span>
                    <span className={r.valueClass}>{r.value}</span>
                  </div>
                ))}
                <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                  <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Human Approved
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── My Activity Stats ── */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">My Support Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Tickets', value: total, icon: '🎫', border: 'border-l-slate-400', bg: 'bg-slate-50' },
              { label: 'Open', value: open, icon: '🔵', border: 'border-l-blue-500', bg: 'bg-blue-50' },
              { label: 'In Progress', value: inProgress, icon: '🟠', border: 'border-l-amber-500', bg: 'bg-amber-50' },
              { label: 'Resolved', value: resolved, icon: '✅', border: 'border-l-emerald-500', bg: 'bg-emerald-50' },
            ].map((c) => (
              <div key={c.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c.border} shadow-sm p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{c.icon}</span>
                </div>
                <p className="text-2xl font-extrabold text-navy">
                  {loading ? <span className="inline-block w-8 h-6 bg-slate-100 animate-pulse rounded" /> : c.value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '🛠️',
                title: 'Report an IT Issue',
                desc: 'Submit a new support ticket for any IT problem.',
                action: () => navigate('/submit'),
                cta: 'Submit Ticket',
                color: 'hover:border-brand-blue/40',
              },
              {
                icon: '📋',
                title: 'View My Tickets',
                desc: 'Track the status of all your submitted requests.',
                action: () => navigate('/my-tickets'),
                cta: 'View Tickets',
                color: 'hover:border-amber-400/40',
              },
              {
                icon: '❓',
                title: 'Help Center',
                desc: 'Browse troubleshooting guides for common issues.',
                action: () => navigate('/help'),
                cta: 'Browse Guides',
                color: 'hover:border-emerald-400/40',
              },
            ].map((q) => (
              <div
                key={q.title}
                onClick={q.action}
                className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 cursor-pointer hover:shadow-md transition-all ${q.color}`}
              >
                <div className="text-3xl mb-3">{q.icon}</div>
                <h3 className="font-bold text-navy text-sm mb-1">{q.title}</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{q.desc}</p>
                <span className="text-xs font-semibold text-brand-blue">{q.cta} →</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Tickets ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Tickets</h2>
            <button
              onClick={() => navigate('/my-tickets')}
              className="text-xs text-brand-blue hover:underline font-semibold cursor-pointer"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <Loading label="Loading your tickets..." />
          ) : recent.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <p className="text-navy font-bold text-base mb-1">No tickets yet</p>
              <p className="text-slate-400 text-sm mb-4">Submit your first IT issue to get started.</p>
              <button
                onClick={() => navigate('/submit')}
                className="bg-brand-blue hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                + Report an Issue
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {recent.map((t, i) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors group ${i < recent.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[t.status] || 'bg-slate-400'}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-slate-400">#{t.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[t.status] || 'bg-slate-100 text-slate-600'}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="font-semibold text-navy text-sm truncate group-hover:text-brand-blue transition-colors">{t.title}</p>
                  </div>

                  {/* Badges */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    {t.category && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{t.category}</span>
                    )}
                    {t.priority && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityColor[t.priority] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {t.priority}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 w-16 text-right">{timeAgo(t.updated_at || t.created_at)}</span>
                  </div>

                  <svg className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── How it works ── */}
        <div className="bg-gradient-to-br from-slate-800 to-navy rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-cyan-400">✨</span>
            <h2 className="text-white font-bold text-base">How ITriq Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', icon: '📝', title: 'You Submit', desc: 'Describe your IT problem in plain language.' },
              { step: '2', icon: '🤖', title: 'AI Analyzes', desc: 'AI classifies category and priority instantly.' },
              { step: '3', icon: '👤', title: 'Human Reviews', desc: 'Support team approves or adjusts the AI decision.' },
              { step: '4', icon: '✅', title: 'Issue Resolved', desc: 'Your ticket is prioritised and resolved faster.' },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center relative">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xl mb-3">
                  {s.icon}
                </div>
                <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-slate-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Sri Lanka note ── */}
        <div className="flex items-start gap-3 bg-blue-50 border border-brand-blue/20 rounded-xl p-4">
          <span className="text-2xl shrink-0">🇱🇰</span>
          <div>
            <p className="font-bold text-navy text-sm">Built for Sri Lankan Organisations</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
              ITriq replaces informal WhatsApp IT requests with a structured, AI-assisted ticketing system — helping schools, hospitals, and businesses across Sri Lanka resolve IT issues faster.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
