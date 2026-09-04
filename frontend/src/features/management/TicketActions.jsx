import Button from '../../components/Button'
import StatusSelector from './StatusSelector'

export default function TicketActions({ status, onStatusChange, onSave, saving }) {
  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-end sm:justify-between">
      <StatusSelector value={status} onChange={onStatusChange} disabled={saving} />
      <Button onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save status'}
      </Button>
    </div>
  )
}