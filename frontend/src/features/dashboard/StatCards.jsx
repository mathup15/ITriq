export default function StatCards({ stats, loading }) {
  const cards = [
    {
      id: 'stat-total',
      label: 'Total Tickets',
      value: stats?.total ?? stats?.total_tickets ?? 0,
      accent: 'border-l-4 border-slate-700',
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: (
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'stat-open',
      label: 'Open Tickets',
      value: stats?.open ?? stats?.open_tickets ?? 0,
      accent: 'border-l-4 border-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'stat-in-progress',
      label: 'In Progress',
      value: stats?.in_progress ?? stats?.in_progress_tickets ?? 0,
      accent: 'border-l-4 border-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 'stat-resolved',
      label: 'Resolved',
      value: stats?.resolved ?? stats?.resolved_tickets ?? 0,
      accent: 'border-l-4 border-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'stat-high-priority',
      label: 'High Priority',
      value: stats?.high_priority ?? 0,
      accent: 'border-l-4 border-rose-500',
      badgeColor: 'bg-rose-50 text-rose-700',
      icon: (
        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ]

  return (
    <section aria-label="Support Statistics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className={`bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-slate-200 transition-all duration-200 hover:shadow-md ${card.accent}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {card.label}
            </span>
            <div className={`p-1.5 rounded-lg ${card.badgeColor}`}>
              {card.icon}
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {loading ? (
                <span className="inline-block w-8 h-8 bg-slate-100 animate-pulse rounded"></span>
              ) : (
                card.value
              )}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}
