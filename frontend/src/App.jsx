import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import SubmitTicket from './features/tickets/SubmitTicket'
import TicketDetailPage from './features/tickets/TicketDetailPage'
import Dashboard from './features/dashboard/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/submit" element={<SubmitTicket />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Routes>
    </div>
  )
}
