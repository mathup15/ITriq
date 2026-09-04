import Card from '../../components/Card'

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
}

export default function AIRecommendation({ category, priority, summary, children }) {
  return (
    <Card className="border border-cyan-ai/30 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span aria-hidden="true">✨</span>
        <h2 className="font-semibold text-navy">AI Triage Recommendation</h2>
      </div>

      <dl className="flex flex-wrap gap-6 mb-3">
        <div>
          <dt className="text-xs text-text-secondary">Category</dt>
          <dd className="font-medium text-navy">{category}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Priority</dt>
          <dd>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                priorityStyles[priority] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {priority}
            </span>
          </dd>
        </div>
      </dl>

      <p className="text-sm text-text-secondary">{summary}</p>

      {children}
    </Card>
  )
}
