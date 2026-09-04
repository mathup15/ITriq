import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-blue text-white'
      : 'text-slate-200 hover:bg-slate hover:text-white'
  }`

export default function Navbar() {
  return (
    <nav className="bg-navy px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-lg">SupportAI</span>
        <span className="text-cyan-ai text-xs font-medium hidden sm:inline">
          Smarter IT Support. Faster Resolution.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/submit" className={linkClass}>
          Submit Issue
        </NavLink>
      </div>
    </nav>
  )
}
