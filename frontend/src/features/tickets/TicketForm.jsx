import { useState } from 'react'
import { CATEGORIES } from './ticketApi'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialValues = {
  name: '',
  email: '',
  title: '',
  description: '',
  category: '',
  device: '',
  location: '',
}

function validateField(name, value) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required.'
      if (value.trim().length < 2 || value.trim().length > 100) {
        return 'Name must be between 2 and 100 characters.'
      }
      return ''
    case 'email':
      if (!value.trim()) return 'Email is required.'
      if (!EMAIL_REGEX.test(value.trim())) return 'Email address is invalid.'
      return ''
    case 'title':
      if (!value.trim()) return 'Issue title is required.'
      if (value.trim().length < 5 || value.trim().length > 150) {
        return 'Title must be between 5 and 150 characters.'
      }
      return ''
    case 'description':
      if (!value.trim()) return 'Description is required.'
      if (value.trim().length < 10) {
        return 'Description must contain at least 10 characters.'
      }
      if (value.trim().length > 1000) {
        return 'Description must not exceed 1000 characters.'
      }
      return ''
    case 'category':
      if (!value || !CATEGORIES.includes(value)) return 'Please select a valid category.'
      return ''
    default:
      return ''
  }
}

function validateAll(values) {
  const errors = {}
  for (const field of Object.keys(initialValues)) {
    const message = validateField(field, values[field])
    if (message) errors[field] = message
  }
  return errors
}

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy ' +
  'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent'

const errorInputClass = 'border-danger focus:ring-danger'

function Field({ label, htmlFor, required, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-navy">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function TicketForm({ onSubmit, submitting }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateAll(values)
    setErrors(nextErrors)
    setTouched(
      Object.keys(initialValues).reduce((acc, field) => ({ ...acc, [field]: true }), {})
    )

    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      device: values.device.trim() || null,
      location: values.location.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Name" htmlFor="name" required error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          placeholder="Jane Doe"
          className={`${inputClass} ${errors.name ? errorInputClass : ''}`}
        />
      </Field>

      <Field label="Email" htmlFor="email" required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          placeholder="jane@example.com"
          className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
        />
      </Field>

      <Field label="Issue Title" htmlFor="title" required error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          placeholder="Short summary of the issue"
          className={`${inputClass} ${errors.title ? errorInputClass : ''}`}
        />
      </Field>

      <Field label="Description" htmlFor="description" required error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          placeholder="Describe what's happening, when it started, and any steps you've tried."
          className={`${inputClass} resize-y ${errors.description ? errorInputClass : ''}`}
        />
        <p className="mt-1 text-xs text-text-secondary">
          {values.description.trim().length}/1000 characters
        </p>
      </Field>

      <Field label="Category" htmlFor="category" required error={errors.category}>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          className={`${inputClass} ${errors.category ? errorInputClass : ''}`}
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Device (optional)" htmlFor="device" error={errors.device}>
          <input
            id="device"
            name="device"
            type="text"
            value={values.device}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={submitting}
            placeholder="e.g. Dell Latitude 5420"
            className={inputClass}
          />
        </Field>

        <Field label="Location (optional)" htmlFor="location" error={errors.location}>
          <input
            id="location"
            name="location"
            type="text"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={submitting}
            placeholder="e.g. Colombo Office, 3rd Floor"
            className={inputClass}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting...
          </span>
        ) : (
          'Submit Ticket'
        )}
      </button>
    </form>
  )
}
