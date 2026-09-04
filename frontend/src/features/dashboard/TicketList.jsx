import { useNavigate } from 'react-router-dom'

function getPriorityBadgeClass(priority) {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'medium':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'high':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'critical':
      return 'bg-rose-100 text-rose-800 border-rose-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in progress':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'resolved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

function formatDate(dateString) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TicketList({ tickets, loading }) {
  const navigate = useNavigate()

  const handleRowClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recent Support Tickets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading
              ? 'Loading tickets...'
              : `Showing ${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm">Fetching support tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <div className="w-12 h-12 mx-auto mb-3 text-slate-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-slate-700">No tickets found</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="py-3.5 px-6">ID</th>
                  <th scope="col" className="py-3.5 px-6">Issue</th>
                  <th scope="col" className="py-3.5 px-6">Category</th>
                  <th scope="col" className="py-3.5 px-6">Priority</th>
                  <th scope="col" className="py-3.5 px-6">Status</th>
                  <th scope="col" className="py-3.5 px-6">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    id={`ticket-row-${ticket.id}`}
                    onClick={() => handleRowClick(ticket.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors duration-150 group"
                  >
                    <td className="py-4 px-6 font-mono text-xs font-medium text-slate-500 group-hover:text-blue-600">
                      #{ticket.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                        {ticket.description}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        By {ticket.name} ({ticket.email})
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {ticket.category || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadgeClass(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority || 'Unset'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap text-xs">
                      {formatDate(ticket.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (avoids table becoming unusable on small screens) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                id={`ticket-card-${ticket.id}`}
                onClick={() => handleRowClick(ticket.id)}
                className="p-4 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-500">#{ticket.id}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">{ticket.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ticket.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border ${getPriorityBadgeClass(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority || 'Unset'}
                  </span>
                  {ticket.category && (
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {ticket.category}
                    </span>
                  )}
                  <span className="text-slate-400 ml-auto">{formatDate(ticket.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
