import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-blue text-white'
      : 'text-slate-200 hover:bg-slate hover:text-white'
  }`

const mobileLinkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-blue text-white' : 'text-slate-200 hover:bg-slate hover:text-white'
  }`

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/submit', label: 'Submit Issue' },
  { to: '/analytics', label: 'Analytics' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-navy px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="text-white font-bold text-lg hover:text-cyan-ai transition-colors">
            ITriq
          </NavLink>
          <span className="text-cyan-ai text-xs font-medium hidden sm:inline">
            Smarter IT Support. Faster Resolution.
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-slate-200 hover:text-white p-1 cursor-pointer"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-3 space-y-1 border-t border-slate-700 pt-3">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLinkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
