import Card from '../../components/Card'
import TicketActions from './TicketActions'

function Detail({ label, children }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</dt><dd className="mt-1 text-sm text-navy">{children || 'Not provided'}</dd></div>
}

export default function TicketDetails({ ticket, status, onStatusChange, category, onCategoryChange, priority, onPriorityChange, approved, onApprovedChange, onAnalyze, onSave, saving, analyzing }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <Card>
        <p className="text-sm font-semibold text-brand-blue">Ticket #{ticket.id}</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">{ticket.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-secondary">{ticket.description}</p>
        <dl className="mt-6 grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <Detail label="User name">{ticket.name}</Detail>
          <Detail label="Email">{ticket.email}</Detail>
          <Detail label="Category">{ticket.category}</Detail>
          <Detail label="Priority">{ticket.priority}</Detail>
          <Detail label="Created date">{new Date(ticket.created_at).toLocaleString()}</Detail>
          <Detail label="Status">{ticket.status}</Detail>
        </dl>
      </Card>
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-navy">AI recommendation</h2>
          <dl className="mt-4 space-y-4">
            <Detail label="AI category">{ticket.ai_category}</Detail>
            <Detail label="AI priority">{ticket.ai_priority}</Detail>
            <Detail label="AI summary">{ticket.ai_summary}</Detail>
            <Detail label="Human approved">{ticket.human_approved ? 'Yes' : 'No'}</Detail>
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-navy">Ticket actions</h2>
          <div className="mt-4">
            <TicketActions status={status} onStatusChange={onStatusChange} category={category} onCategoryChange={onCategoryChange} priority={priority} onPriorityChange={onPriorityChange} approved={approved} onApprovedChange={onApprovedChange} onAnalyze={onAnalyze} onSave={onSave} saving={saving} analyzing={analyzing} />
          </div>
        </Card>
      </div>
    </div>
  )
}