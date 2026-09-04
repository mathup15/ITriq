import { useCallback, useEffect, useState } from 'react'
import StatCards from './StatCards'
import TicketFilters from './TicketFilters'
import TicketList from './TicketList'
import { getDashboardStats, getTickets } from './dashboardApi'
import ErrorMessage from '../../components/ErrorMessage'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [error, setError] = useState('')

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('All')
  const [status, setStatus] = useState('All')

  const refreshAll = useCallback(() => {
    setLoadingStats(true)
    setLoadingTickets(true)
    getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError('Could not load dashboard statistics.'))
      .finally(() => setLoadingStats(false))

    getTickets({
      search: searchTerm,
      category,
      priority,
      status,
    })
      .then((data) => setTickets(data))
      .catch(() => setError('Could not load tickets.'))
      .finally(() => setLoadingTickets(false))
  }, [searchTerm, category, priority, status])

  // Initial load of dashboard statistics
  useEffect(() => {
    let isMounted = true
    getDashboardStats()
      .then((data) => {
        if (isMounted) setStats(data)
      })
      .catch(() => {
        if (isMounted) setError('Could not load dashboard statistics.')
      })
      .finally(() => {
        if (isMounted) setLoadingStats(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Debounced search and filter update
  useEffect(() => {
    let isMounted = true
    const timeoutId = setTimeout(() => {
      setLoadingTickets(true)
      getTickets({
        search: searchTerm,
        category,
        priority,
        status,
      })
        .then((data) => {
          if (isMounted) setTickets(data)
        })
        .catch(() => {
          if (isMounted) setError('Could not load tickets.')
        })
        .finally(() => {
          if (isMounted) setLoadingTickets(false)
        })
    }, 200)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [searchTerm, category, priority, status])

  const handleResetFilters = () => {
    setSearchTerm('')
    setCategory('All')
    setPriority('All')
    setStatus('All')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dashboard Sub-Header / Hero Banner */}
      <header className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white border-b border-slate-800 px-4 sm:px-8 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30">
                Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              SupportAI
            </h1>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              IT Support Command Center
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshAll}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-all shadow-sm cursor-pointer"
              title="Refresh Dashboard"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {error && <ErrorMessage message={error} />}

        {/* 1. Statistics Cards */}
        <StatCards stats={stats} loading={loadingStats} />

        {/* 2. Filters & Search */}
        <TicketFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          priority={priority}
          onPriorityChange={setPriority}
          status={status}
          onStatusChange={setStatus}
          onReset={handleResetFilters}
        />

        {/* 3. Ticket Listing */}
        <TicketList tickets={tickets} loading={loadingTickets} />
      </main>
    </div>
  )
}
