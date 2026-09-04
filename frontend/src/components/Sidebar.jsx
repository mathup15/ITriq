import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

const employeeLinks = [
  { to: '/', label: 'Home', end: true, icon: '⌂' },
  { to: '/submit', label: 'Submit Ticket', icon: '＋' },
  { to: '/my-tickets', label: 'My Tickets', icon: '▣' },
  { to: '/help', label: 'Help Center', icon: '❓' },
]

const supportLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '▣' },
  { to: '/tickets', label: 'All Tickets', icon: '🎫' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/help', label: 'Help Center', icon: '❓' },
]

function NavItem({ to, label, icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-blue text-white'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`
      }
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  const { role, switchRole, logout, user } = useRole()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showSwitcher, setShowSwitcher] = useState(false)

  const links = role === 'support' ? supportLinks : employeeLinks
  const isSupport = role === 'support'

  function handleSwitch(r) {
    switchRole(r)
    setShowSwitcher(false)
    navigate(r === 'support' ? '/dashboard' : '/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-lg tracking-tight">SupportAI</span>
          <span className="text-cyan-ai text-xs hidden lg:inline">✨</span>
        </div>
        <p className="text-slate-500 text-xs mt-0.5">Smarter IT Support.</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
        ))}
      </nav>

      {/* Role info + switcher */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50">
          <span className="text-lg">{isSupport ? '🛠️' : '👤'}</span>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.name || (isSupport ? 'Support Team' : 'Employee')}
            </p>
            <p className="text-slate-400 text-xs truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSwitcher(true)}
          className="w-full text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          ⇄ Switch Role
        </button>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          ↩ Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-navy border-r border-slate-800 fixed top-0 left-0 h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden bg-navy border-b border-slate-800 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-30">
        <span className="text-white font-extrabold text-base">SupportAI</span>
        <button
          onClick={() => setOpen(true)}
          className="text-slate-300 hover:text-white p-1 cursor-pointer"
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
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-navy h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <span className="text-white font-extrabold">SupportAI</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {links.map((l) => (
                <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-slate-700 space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50">
                <span className="text-lg">{isSupport ? '🛠️' : '👤'}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{user?.name || (isSupport ? 'Support Team' : 'Employee')}</p>
                </div>
              </div>
              <button
                onClick={() => { setOpen(false); setShowSwitcher(true) }}
                className="w-full text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left"
              >
                ⇄ Switch Role
              </button>
              <button
                onClick={() => { setOpen(false); logout(); navigate('/') }}
                className="w-full text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left"
              >
                ↩ Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Role Switcher Modal */}
      {showSwitcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h2 className="text-navy font-bold text-lg mb-1">Switch Demo Role</h2>
            <p className="text-slate-500 text-sm mb-5">Choose how you want to experience SupportAI.</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => handleSwitch('employee')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  role === 'employee' ? 'border-brand-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-3xl">👤</span>
                <span className="font-semibold text-navy text-sm">Employee</span>
                <span className="text-xs text-slate-500 text-center">Submit & track your tickets</span>
              </button>
              <button
                onClick={() => handleSwitch('support')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  role === 'support' ? 'border-brand-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-3xl">🛠️</span>
                <span className="font-semibold text-navy text-sm">Support Team</span>
                <span className="text-xs text-slate-500 text-center">Manage & resolve tickets</span>
              </button>
            </div>
            <button
              onClick={() => setShowSwitcher(false)}
              className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
