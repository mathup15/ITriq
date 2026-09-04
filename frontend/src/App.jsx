import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import SubmitTicketPage from './features/tickets/SubmitTicketPage'
import TicketDetailPage from './features/tickets/TicketDetailPage'
import DashboardPage from './features/dashboard/DashboardPage'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/submit" element={<SubmitTicketPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Routes>
    </div>
  )
}
