import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import StatCards from './StatCards'
import TicketFilters from './TicketFilters'
import TicketList from './TicketList'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('StatCards Component', () => {
  it('renders all 5 statistical metric cards with accurate values', () => {
    const stats = {
      total: 25,
      open: 12,
      in_progress: 5,
      resolved: 8,
      high_priority: 5,
    }

    render(<StatCards stats={stats} loading={false} />)

    expect(screen.getByText('Total Tickets')).toBeInTheDocument()
    expect(screen.getByText('Open Tickets')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Resolved')).toBeInTheDocument()
    expect(screen.getByText('High Priority')).toBeInTheDocument()

    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders zero values gracefully when stats are empty or null', () => {
    render(<StatCards stats={null} loading={false} />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBe(5)
  })
})

describe('TicketFilters Component', () => {
  it('renders search input with placeholder and filter dropdowns', () => {
    const handleSearch = vi.fn()
    const handleCategory = vi.fn()
    const handlePriority = vi.fn()
    const handleStatus = vi.fn()
    const handleReset = vi.fn()

    render(
      <TicketFilters
        searchTerm=""
        onSearchChange={handleSearch}
        category="All"
        onCategoryChange={handleCategory}
        priority="All"
        onPriorityChange={handlePriority}
        status="All"
        onStatusChange={handleStatus}
        onReset={handleReset}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search tickets...')
    expect(searchInput).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'wifi' } })
    expect(handleSearch).toHaveBeenCalledWith('wifi')

    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('displays clear button when filters or search terms are active', () => {
    const handleReset = vi.fn()

    render(
      <TicketFilters
        searchTerm="laptop"
        onSearchChange={vi.fn()}
        category="Hardware"
        onCategoryChange={vi.fn()}
        priority="All"
        onPriorityChange={vi.fn()}
        status="All"
        onStatusChange={vi.fn()}
        onReset={handleReset}
      />
    )

    const clearBtn = screen.getByText('Clear')
    expect(clearBtn).toBeInTheDocument()

    fireEvent.click(clearBtn)
    expect(handleReset).toHaveBeenCalledTimes(1)
  })
})

describe('TicketList Component', () => {
  const sampleTickets = [
    {
      id: 1,
      title: 'Office WiFi not working',
      description: 'WiFi cuts out frequently in meeting room 3.',
      name: 'John Perera',
      email: 'john@example.com',
      category: 'Network',
      priority: 'High',
      status: 'Open',
      created_at: '2026-09-04T08:00:00Z',
    },
    {
      id: 2,
      title: 'Laptop running slowly',
      description: 'Takes 15 minutes to boot.',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      category: 'Hardware',
      priority: 'Low',
      status: 'Resolved',
      created_at: '2026-09-04T08:30:00Z',
    },
  ]

  it('renders table columns and ticket rows correctly', () => {
    render(
      <MemoryRouter>
        <TicketList tickets={sampleTickets} loading={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('Recent Support Tickets')).toBeInTheDocument()
    expect(screen.getAllByText('Office WiFi not working')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Laptop running slowly')[0]).toBeInTheDocument()

    // Priority badges
    expect(screen.getAllByText('High')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Low')[0]).toBeInTheDocument()

    // Status badges
    expect(screen.getAllByText('Open')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Resolved')[0]).toBeInTheDocument()
  })

  it('navigates to ticket details when a ticket row is clicked', () => {
    render(
      <MemoryRouter>
        <TicketList tickets={sampleTickets} loading={false} />
      </MemoryRouter>
    )

    const row = screen.getAllByText('Office WiFi not working')[0]
    fireEvent.click(row)
    expect(mockNavigate).toHaveBeenCalledWith('/tickets/1')
  })

  it('shows empty state message when no tickets match', () => {
    render(
      <MemoryRouter>
        <TicketList tickets={[]} loading={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('No tickets found')).toBeInTheDocument()
  })
})
