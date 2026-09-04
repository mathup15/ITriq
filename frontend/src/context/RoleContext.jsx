import { createContext, useContext, useState } from 'react'

const RoleContext = createContext(null)

// Demo credentials — no real auth, just for the hackathon demo
const DEMO_USERS = [
  { email: 'john@company.lk', password: 'employee123', role: 'employee', name: 'John Perera' },
  { email: 'sarah@company.lk', password: 'support123', role: 'support', name: 'Sarah Fernando' },
]

export function RoleProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('supportai_session')) } catch { return null }
  })

  function login(email, password) {
    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return false
    localStorage.setItem('supportai_session', JSON.stringify(user))
    setSession(user)
    return true
  }

  function logout() {
    localStorage.removeItem('supportai_session')
    setSession(null)
  }

  function switchRole(r) {
    const user = DEMO_USERS.find((u) => u.role === r)
    if (!user) return
    localStorage.setItem('supportai_session', JSON.stringify(user))
    setSession(user)
  }

  return (
    <RoleContext.Provider value={{ role: session?.role ?? 'employee', user: session, isLoggedIn: Boolean(session), login, logout, switchRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
