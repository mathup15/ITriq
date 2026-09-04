import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

const employeeLinks = [
  { to: '/', label: 'Home', end: true, icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  )},
  { to: '/submit', label: 'Submit Ticket', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
  )},
  { to: '/my-tickets', label: 'My Tickets', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  )},
  { to: '/help', label: 'Help Center', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
]

const supportLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  )},
  { to: '/tickets', label: 'All Tickets', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
  )},
  { to: '/analytics', label: 'Analytics', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  )},
  { to: '/help', label: 'Help Center', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
]

function NavItem({ to, label, icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'bg-brand-blue text-white shadow-md shadow-blue-900/30'
            : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  const { role, logout, user } = useRole()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = role === 'support' ? supportLinks : employeeLinks
  const isSupport = role === 'support'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-cyan-400 text-base">✨</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-base tracking-tight leading-none">ITriq</p>
            <p className="text-slate-500 text-xs mt-0.5">IT Support Platform</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b border-slate-700/60">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
          isSupport ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
        }`}>
          <span>{isSupport ? '🛠️' : '👤'}</span>
          {isSupport ? 'Support Team' : 'Employee Portal'}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-2">
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/40">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-cyan-ai flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">
              {user?.name?.charAt(0) || '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-slate-400 text-xs truncate mt-0.5">
              {user?.email || ''}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — wider at 64 (256px) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0F172A] border-r border-slate-800 fixed top-0 left-0 h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden bg-[#0F172A] border-b border-slate-800 px-4 py-3.5 flex items-center justify-between fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
            <span className="text-cyan-400 text-xs">✨</span>
          </div>
          <span className="text-white font-extrabold text-base">ITriq</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-slate-300 hover:text-white p-1.5 cursor-pointer rounded-lg hover:bg-slate-700"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-[#0F172A] h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-400 text-xs">✨</span>
                </div>
                <span className="text-white font-extrabold">ITriq</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-3 border-b border-slate-700/60">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                isSupport ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
              }`}>
                <span>{isSupport ? '🛠️' : '👤'}</span>
                {isSupport ? 'Support Team' : 'Employee Portal'}
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {links.map((l) => (
                <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-slate-700/60 space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/40">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-cyan-ai flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || '?'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold truncate">{user?.name || 'User'}</p>
                  <p className="text-slate-400 text-xs truncate">{user?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={() => { setOpen(false); logout(); navigate('/') }}
                className="w-full flex items-center gap-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

    </>
  )
}
