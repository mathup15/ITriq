import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ApprovalPanel from './ApprovalPanel'

const baseTicket = {
  ai_category: 'Software',
  ai_priority: 'Medium',
  category: null,
  priority: null,
  human_approved: false,
}

describe('ApprovalPanel', () => {
  it('calls onApprove when Approve is clicked', () => {
    const onApprove = vi.fn()
    render(<ApprovalPanel ticket={baseTicket} onApprove={onApprove} onModify={vi.fn()} saving={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))

    expect(onApprove).toHaveBeenCalledTimes(1)
  })

  it('lets a human change category/priority before saving via Modify', async () => {
    const onModify = vi.fn().mockResolvedValue(undefined)
    render(<ApprovalPanel ticket={baseTicket} onApprove={vi.fn()} onModify={onModify} saving={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Modify' }))
    fireEvent.change(screen.getByDisplayValue('Software'), { target: { value: 'Network' } })
    fireEvent.change(screen.getByDisplayValue('Medium'), { target: { value: 'High' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onModify).toHaveBeenCalledWith('Network', 'High')
  })

  it('shows the AI recommendation alongside the final human decision once approved', () => {
    const approvedTicket = {
      ai_category: 'Software',
      ai_priority: 'Medium',
      category: 'Network',
      priority: 'High',
      human_approved: true,
    }
    render(<ApprovalPanel ticket={approvedTicket} onApprove={vi.fn()} onModify={vi.fn()} saving={false} />)

    expect(screen.getByText(/AI recommendation:/)).toBeInTheDocument()
    expect(screen.getByText(/Final decision:/)).toBeInTheDocument()
    expect(screen.getByText(/Human approved: Yes/)).toBeInTheDocument()
  })
})
