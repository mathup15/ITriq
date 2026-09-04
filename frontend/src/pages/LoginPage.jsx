import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

const DEMO = {
  employee: { email: 'john@company.lk', password: 'employee123' },
  support: { email: 'sarah@company.lk', password: 'support123' },
}

export default function LoginPage() {
  const { login } = useRole()
  const navigate = useNavigate()
  const [tab, setTab] = useState('employee')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function fillDemo() {
    setEmail(DEMO[tab].email)
    setPassword(DEMO[tab].password)
    setError('')
  }

  function handleTabSwitch(t) {
    setTab(t); setEmail(''); setPassword(''); setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password) { setError('Please enter your password.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const ok = login(email.trim(), password)
    setLoading(false)
    if (!ok) { setError('Incorrect email or password. Please try again.'); return }
    navigate(tab === 'support' ? '/dashboard' : '/')
  }

  const isSupport = tab === 'support'

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
              <span className="text-cyan-400 text-lg">✨</span>
            </div>
            <span className="text-white font-extrabold text-2xl tracking-tight">ITriq</span>
          </div>
          <p className="text-slate-400 text-sm ml-1">Smarter IT Support. Faster Resolution.</p>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              AI-Powered IT Support<br />
              <span className="text-cyan-400">Built for Sri Lanka</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Replace informal WhatsApp IT requests with a structured, AI-assisted ticketing system. Every issue classified, prioritised, and resolved faster.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: '🤖', text: 'AI classifies and prioritises every ticket instantly' },
              { icon: '👤', text: 'Human review ensures every decision is accurate' },
              { icon: '📊', text: 'Real-time dashboard and analytics for your team' },
              { icon: '🇱🇰', text: 'Designed for Sri Lankan schools, hospitals & businesses' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700/60 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm">{f.icon}</span>
                </div>
                <p className="text-slate-300 text-sm">{f.text}</p>
              </div>
            ))}
          </div>

          {/* AI triage demo card */}
          <div className="bg-slate-800/60 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cyan-400 text-sm">✨</span>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Live AI Triage</span>
              <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <p className="text-white text-sm font-semibold mb-3">"Office WiFi not working since morning"</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Category', value: 'Network', color: 'text-white' },
                { label: 'Priority', value: 'HIGH', color: 'text-red-400 font-bold' },
                { label: 'Confidence', value: '94%', color: 'text-cyan-400 font-bold' },
              ].map((r) => (
                <div key={r.label} className="bg-slate-700/50 rounded-lg py-2 px-1">
                  <p className={`text-sm ${r.color}`}>{r.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{r.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Human Approved by Support Team
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-slate-600 text-xs">© 2025 ITriq · Built for Sri Lankan SMEs</p>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#F8FAFC]">

        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-2xl font-extrabold text-navy">ITriq</span>
            <span className="text-cyan-ai">✨</span>
          </div>
          <p className="text-slate-500 text-sm">Smarter IT Support. Faster Resolution.</p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-navy mb-2">Welcome back</h2>
            <p className="text-slate-500 text-base">Sign in to your ITriq account.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { key: 'employee', emoji: '👤', label: 'Employee', sub: 'Submit & track tickets' },
              { key: 'support', emoji: '🛠️', label: 'Support Team', sub: 'Manage & resolve' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => handleTabSwitch(t.key)}
                className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  tab === t.key
                    ? 'border-brand-blue bg-blue-50 shadow-md shadow-blue-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <span className={`font-bold text-sm ${tab === t.key ? 'text-brand-blue' : 'text-navy'}`}>{t.label}</span>
                <span className="text-xs text-slate-400 text-center leading-tight">{t.sub}</span>
              </button>
            ))}
          </div>

          {/* Demo credentials */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">✨ Demo Credentials</p>
              <p className="text-sm text-slate-700 font-mono font-semibold">{DEMO[tab].email}</p>
              <p className="text-sm text-slate-500 font-mono">{DEMO[tab].password}</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              Fill
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-navy mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder={DEMO[tab].email}
                disabled={loading}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-base text-navy placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 disabled:bg-slate-50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full px-4 py-3.5 pr-12 border-2 border-slate-200 rounded-xl text-base text-navy placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 disabled:bg-slate-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-500 text-lg shrink-0">⚠️</span>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in as {isSupport ? 'Support Team' : 'Employee'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8">
            🇱🇰 Built for Sri Lankan SMEs · AI-assisted IT support
          </p>
        </div>
      </div>
    </div>
  )
}
