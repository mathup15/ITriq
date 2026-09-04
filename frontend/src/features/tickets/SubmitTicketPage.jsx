import Card from '../../components/Card'

export default function SubmitTicketPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-navy mb-6">Submit an IT Issue</h1>
      <Card>
        <p className="text-sm text-text-secondary">
          Ticket submission form goes here (features/tickets). Will POST to{' '}
          <code className="text-brand-blue">/api/tickets</code>.
        </p>
      </Card>
    </div>
  )
}
