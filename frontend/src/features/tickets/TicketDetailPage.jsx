import { useParams } from 'react-router-dom'
import Card from '../../components/Card'

export default function TicketDetailPage() {
  const { id } = useParams()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-navy mb-6">Ticket #{id}</h1>
      <Card>
        <p className="text-sm text-text-secondary">
          Ticket details, AI recommendation review, and status update controls
          go here (features/tickets, features/ai, features/management).
        </p>
      </Card>
    </div>
  )
}
