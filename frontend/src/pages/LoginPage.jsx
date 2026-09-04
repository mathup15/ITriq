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
    setTab(t)
    setEmail('')
    setPassword('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password) { setError('Please enter your password.'); return }

    setLoading(true)
    // Simulate a brief network delay for realism
    await new Promise((r) => setTimeout(r, 600))
    const ok = login(email.trim(), password)
    setLoading(false)

    if (!ok) {
      setError('Incorrect email or password. Please try again.')
      return
    }
    navigate(tab === 'support' ? '/dashboard' : '/')
  }

  const isSupport = tab === 'support'

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-3xl font-extrabold text-navy tracking-tight">SupportAI</span>
          <span className="text-cyan-ai text-xl">✨</span>
        </div>
        <p className="text-text-secondary text-sm">Smarter IT Support. Faster Resolution.</p>
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">

          {/* Role tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200">
            {[
              { key: 'employee', label: '👤 Employee', sub: 'Report IT issues' },
              { key: 'support', label: '🛠️ Support Team', sub: 'Manage tickets' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => handleTabSwitch(t.key)}
                className={`py-4 px-3 text-center transition-colors cursor-pointer ${
                  tab === t.key
                    ? 'bg-navy text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <p className="text-sm font-semibold">{t.label}</p>
                <p className={`text-xs mt-0.5 ${tab === t.key ? 'text-slate-300' : 'text-slate-400'}`}>{t.sub}</p>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-bold text-navy mb-1">
              {isSupport ? 'Support Team Sign In' : 'Employee Sign In'}
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              {isSupport
                ? 'Sign in to manage tickets and review AI recommendations.'
                : 'Sign in to submit and track your IT support requests.'}
            </p>

            {/* Demo credentials hint */}
            <div className="bg-cyan-ai/10 border border-cyan-ai/30 rounded-lg px-4 py-3 mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-cyan-ai mb-0.5">✨ Demo Credentials</p>
                <p className="text-xs text-slate-600 font-mono">{DEMO[tab].email}</p>
                <p className="text-xs text-slate-600 font-mono">{DEMO[tab].password}</p>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="shrink-0 text-xs font-semibold text-cyan-ai hover:text-cyan-600 border border-cyan-ai/40 hover:border-cyan-600 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                Fill
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder={DEMO[tab].email}
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:bg-slate-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1" htmlFor="password">
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
                    className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <span className="text-red-500 text-sm">⚠️</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign in as ${isSupport ? 'Support Team' : 'Employee'}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sri Lanka note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          🇱🇰 Built for Sri Lankan SMEs · AI-assisted IT support
        </p>
      </div>
    </div>
  )
}
