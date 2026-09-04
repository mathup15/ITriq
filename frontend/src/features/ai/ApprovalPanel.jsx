import { useState } from 'react'
import Button from '../../components/Button'

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Security', 'Other']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const selectClass =
  'rounded-md border border-slate-200 px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-cyan-ai'

/**
 * Lets a human approve the AI's category/priority suggestion as-is, or
 * modify it before saving. Either way the AI's own ai_category/ai_priority
 * stay untouched (see aiApi.saveDecision) so the recommendation and the
 * final decision remain independently visible.
 */
export default function ApprovalPanel({ ticket, onApprove, onModify, saving }) {
  const [editing, setEditing] = useState(false)
  const [category, setCategory] = useState(ticket.ai_category || ticket.category || CATEGORIES[0])
  const [priority, setPriority] = useState(ticket.ai_priority || ticket.priority || PRIORITIES[1])

  if (ticket.human_approved && !editing) {
    const wasModified = ticket.category !== ticket.ai_category || ticket.priority !== ticket.ai_priority

    return (
      <div className="mt-4 text-sm border-t border-slate-100 pt-4">
        <p className="text-text-secondary">
          AI recommendation:{' '}
          <span className="text-navy font-medium">
            {ticket.ai_category} / {ticket.ai_priority}
          </span>
        </p>
        <p className="text-text-secondary mt-1">
          Final decision:{' '}
          <span className="text-navy font-medium">
            {ticket.category} / {ticket.priority}
          </span>
        </p>
        <p className="text-success font-medium mt-1">
          Human approved: Yes{wasModified ? ' (modified)' : ''}
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-brand-blue text-xs font-medium mt-2 hover:underline cursor-pointer"
        >
          Change decision
        </button>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-3">
          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              await onModify(category, priority)
              setEditing(false)
            }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
      <Button variant="ai" onClick={onApprove} disabled={saving}>
        {saving ? 'Saving...' : 'Approve'}
      </Button>
      <Button variant="secondary" onClick={() => setEditing(true)} disabled={saving}>
        Modify
      </Button>
    </div>
  )
}
