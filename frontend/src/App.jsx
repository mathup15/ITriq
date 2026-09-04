import { Route, Routes, Navigate } from 'react-router-dom'
import { RoleProvider, useRole } from './context/RoleContext'
import Sidebar from './components/Sidebar'
import SubmitTicket from './features/tickets/SubmitTicket'
import TicketDetailPage from './features/tickets/TicketDetailPage'
import Dashboard from './features/dashboard/Dashboard'
import Analytics from './features/analytics/Analytics'
import EmployeeHome from './pages/EmployeeHome'
import MyTickets from './features/tickets/MyTickets'
import AllTickets from './features/tickets/AllTickets'
import HelpCenter from './pages/HelpCenter'
import LoginPage from './pages/LoginPage'

function AppShell() {
  const { isLoggedIn } = useRole()

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <Routes>
          <Route path="/" element={<EmployeeHome />} />
          <Route path="/submit" element={<SubmitTicket />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/tickets" element={<AllTickets />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <RoleProvider>
      <AppShell />
    </RoleProvider>
  )
}
