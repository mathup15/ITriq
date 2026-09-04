import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import ErrorMessage from '../../components/ErrorMessage'
import TicketForm from './TicketForm'
import { createTicket } from './ticketApi'

function extractErrorMessage(err) {
  const detail = err?.response?.data?.detail

  if (Array.isArray(detail) && detail.length > 0) {
    // FastAPI/Pydantic validation error shape.
    return detail.map((d) => d.msg).join(' ')
  }
  if (typeof detail === 'string') return detail
  if (err?.message === 'Network Error') {
    return 'Could not reach the server. Please check your connection and try again.'
  }
  return 'Something went wrong while submitting your ticket. Please try again.'
}

export default function SubmitTicket() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [createdTicket, setCreatedTicket] = useState(null)

  async function handleSubmit(payload) {
    setSubmitting(true)
    setSubmitError('')
    try {
      const ticket = await createTicket(payload)
      setCreatedTicket(ticket)
    } catch (err) {
      setSubmitError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (createdTicket) {
    return (
      <div className="mx-auto max-w-xl p-4 sm:p-6">
        <Card>
          <div className="flex flex-col items-center text-center py-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <span className="text-2xl text-success">✓</span>
            </div>
            <h2 className="text-xl font-bold text-navy">Ticket submitted successfully</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Thanks, {createdTicket.name}. Your ticket{' '}
              <span className="font-medium text-navy">#{createdTicket.id}</span> has been
              created and our support team will review it shortly.
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate(`/tickets/${createdTicket.id}`)}
                className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer"
              >
                View Ticket
              </button>
              <button
                type="button"
                onClick={() => setCreatedTicket(null)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-slate-50 cursor-pointer"
              >
                Submit Another Ticket
              </button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-5 transition-colors cursor-pointer group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>
      <h1 className="mb-1 text-2xl font-bold text-navy">Submit an IT Issue</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Tell us what's going on and our support team will take it from here.
      </p>
      <Card>
        {submitError && (
          <div className="mb-5">
            <ErrorMessage message={submitError} />
          </div>
        )}
        <TicketForm onSubmit={handleSubmit} submitting={submitting} />
      </Card>
    </div>
  )
}
