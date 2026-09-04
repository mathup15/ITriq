import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AIRecommendation from './AIRecommendation'

describe('AIRecommendation', () => {
  it('renders the AI-suggested category, priority, and summary', () => {
    render(
      <AIRecommendation category="Network" priority="High" summary="Office WiFi connectivity issue" />
    )

    expect(screen.getByText('Network')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Office WiFi connectivity issue')).toBeInTheDocument()
  })

  it('renders approval controls passed as children', () => {
    render(
      <AIRecommendation category="Software" priority="Medium" summary="App crashes on export">
        <button type="button">Approve</button>
      </AIRecommendation>
    )

    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument()
  })
})
