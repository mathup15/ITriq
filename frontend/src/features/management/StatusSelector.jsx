const statuses = ['Open', 'In Progress', 'Resolved']

export default function StatusSelector({ value, onChange, disabled = false }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-navy">
      Status
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 font-normal text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:bg-slate-100"
      >
        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
      </select>
    </label>
  )
}