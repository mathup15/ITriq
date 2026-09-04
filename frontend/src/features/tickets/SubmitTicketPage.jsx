import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import ErrorMessage from '../../components/ErrorMessage'
import api from '../../services/api'

export default function SubmitTicketPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', title: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submitTicket(event) {
    event.preventDefault()
    setError('')
    if (form.name.trim().length < 2 || !form.email.includes('@') || form.title.trim().length < 5 || form.description.trim().length < 10) {
      setError('Please complete each field with valid information.')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.post('/api/tickets', form)
      if (!data?.id) throw new Error('Empty ticket response')
      try { await api.post(`/api/tickets/${data.id}/analyze`) } catch { /* Ticket remains available without AI analysis. */ }
      navigate(`/tickets/${data.id}`)
    } catch {
      setError('Unable to submit your ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-navy">Submit an IT Issue</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submitTicket} className="mt-5 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {['name', 'email', 'title'].map((field) => (
          <label key={field} className="block text-sm font-medium capitalize text-navy">
            {field === 'name' ? 'Your name' : field === 'email' ? 'Email address' : 'Issue title'}
            <input name={field} type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={updateField} required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </label>
        ))}
        <label className="block text-sm font-medium text-navy">
          Describe the issue
          <textarea name="description" value={form.description} onChange={updateField} required rows="5" className="mt-2 w-full resize-y rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
        </label>
        <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit ticket'}</Button>
      </form>
    </div>
  )
}
