const CATEGORIES = [
  'All',
  'Hardware',
  'Software',
  'Network',
  'Account Access',
  'Security',
  'Other',
]

const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical']

const STATUSES = ['All', 'Open', 'In Progress', 'Resolved']

export default function TicketFilters({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  onReset,
}) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    (category && category !== 'All') ||
    (priority && priority !== 'All') ||
    (status && status !== 'All')

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="ticket-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets..."
            aria-label="Search tickets"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          {/* Category */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="filter-category" className="sr-only">
              Category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="filter-priority" className="sr-only">
              Priority
            </label>
            <select
              id="filter-priority"
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  Priority: {pri}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="filter-status" className="sr-only">
              Status
            </label>
            <select
              id="filter-status"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>
                  Status: {stat}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              type="button"
              onClick={onReset}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1 shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
