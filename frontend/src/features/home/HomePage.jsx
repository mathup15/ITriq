import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-slate to-navy text-white px-6 py-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-ai/20 text-cyan-ai border border-cyan-ai/30 mb-4">
              ✨ AI-Powered
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              SMARTER IT SUPPORT<br />
              <span className="text-cyan-ai">AI-POWERED TRIAGE</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-lg">
              Resolve IT issues faster with intelligent ticket classification and human-approved AI decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/submit')}
                className="px-6 py-3 bg-brand-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Report an Issue
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors cursor-pointer"
              >
                View Dashboard
              </button>
            </div>
          </div>

          {/* Right — AI Triage preview card */}
          <div className="flex-shrink-0 w-full max-w-sm">
            <div className="bg-slate/80 border border-cyan-ai/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-cyan-ai text-lg">✨</span>
                <span className="text-cyan-ai font-semibold text-sm uppercase tracking-wider">AI Triage</span>
              </div>
              <p className="text-white font-medium mb-4">WiFi connection failed</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white font-medium">Network</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority</span>
                  <span className="text-red-400 font-bold">HIGH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-cyan-ai font-medium">94%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-cyan-ai h-1.5 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <span>✓</span>
                <span>Human Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-navy mb-10">How ITriq Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Triage', desc: 'Automatically classify IT issues by category and priority using AI.' },
            { icon: '⚡', title: 'Faster Resolution', desc: 'Critical problems are surfaced first so your team acts where it matters most.' },
            { icon: '👤', title: 'Human Control', desc: 'AI recommends — humans decide. Every ticket gets a final human review.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-navy text-lg mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sri Lanka Problem Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-brand-blue/20 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🇱🇰</span>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Sri Lankan Context</span>
          </div>
          <h2 className="text-2xl font-extrabold text-navy mb-3">
            Built for Sri Lankan Organisations
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-3xl">
            Across Sri Lanka, IT support in schools, government offices, hospitals, and businesses still relies on
            phone calls, WhatsApp messages, and walk-ins. Issues get lost, priorities are guessed, and resolution
            times are long. <strong className="text-navy">ITriq</strong> replaces that chaos with a structured,
            AI-assisted ticketing system — so every IT problem is logged, categorised, and resolved faster.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🏫', title: 'Schools & Universities', desc: 'Track lab computer faults, projector failures, and network outages across campuses.' },
              { icon: '🏥', title: 'Hospitals & Clinics', desc: 'Prioritise critical medical device and system issues before they affect patient care.' },
              { icon: '🏢', title: 'Government & Business', desc: 'Replace informal WhatsApp IT requests with a transparent, trackable support system.' },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-navy text-sm mb-1">{c.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow strip */}
      <section className="bg-slate text-white px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">The Flow</p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm font-medium">
            {['Submit Ticket', '→', 'AI Analyzes', '→', 'Human Approves', '→', 'Dashboard Updates', '→', 'Analytics'].map((s, i) => (
              <span key={i} className={s === '→' ? 'text-slate-500' : 'bg-white/10 px-3 py-1.5 rounded-full text-white'}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
