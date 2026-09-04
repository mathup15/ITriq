import Button from '../../components/Button'
import StatusSelector from './StatusSelector'

export default function TicketActions({ status, onStatusChange, category, onCategoryChange, priority, onPriorityChange, approved, onApprovedChange, onAnalyze, onSave, saving, analyzing }) {
  return (
    <div className="space-y-4 border-t border-slate-200 pt-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-navy">Category<select value={category || ''} onChange={(event) => onCategoryChange(event.target.value || null)} disabled={saving} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal"><option value="">Not set</option>{['Hardware', 'Software', 'Network', 'Account Access', 'Security', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-sm font-medium text-navy">Priority<select value={priority || ''} onChange={(event) => onPriorityChange(event.target.value || null)} disabled={saving} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal"><option value="">Not set</option>{['Low', 'Medium', 'High', 'Critical'].map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-navy"><input type="checkbox" checked={approved} onChange={(event) => onApprovedChange(event.target.checked)} disabled={saving} /> Human approved</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <StatusSelector value={status} onChange={onStatusChange} disabled={saving} />
        <div className="flex gap-2"><Button variant="ai" onClick={onAnalyze} disabled={analyzing || saving}>{analyzing ? 'Analyzing...' : 'Analyze with AI'}</Button><Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button></div>
      </div>
    </div>
  )
}