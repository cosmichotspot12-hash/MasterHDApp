'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VisitForm() {
  const searchParams = useSearchParams()
  const listing_id = searchParams.get('listing_id') || ''
  const title = searchParams.get('title') || ''

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    finder_name: '',
    finder_phone: '',
    preferred_day: '',
    preferred_time: 'morning',
    message: '',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/visit-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          listing_id: listing_id || null,
          property_title: title || 'General Inquiry',
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to submit')
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="pf-success-page">
        <div className="pf-success-card">
          <div className="pf-success-mark">OK</div>
          <h2 data-i18n="success_visit_title">Visit Request Submitted</h2>
          <p data-i18n="success_visit_copy">
          We will contact you within 24 hours to confirm your visit.
          </p>
          <Link href="/" className="pf-back" data-i18n="action_back_home">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="pf-form">
      {title && (
        <div className="pf-note">
          <p className="m-0">Requesting visit for: {title}</p>
        </div>
      )}

      <div className="pf-section">
        <p className="pf-section-title" data-i18n="form_contact_details">Contact details</p>
        <div className="pf-grid-2">
          <div className="pf-field">
            <label className="pf-label">
              <span data-i18n="form_name">Your Name</span> <span className="pf-required">*</span>
            </label>
            <input
              value={form.finder_name}
              onChange={e => set('finder_name', e.target.value)}
              required
              placeholder="Enter your full name"
              className="pf-input"
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">
              <span data-i18n="form_phone">Phone Number</span> <span className="pf-required">*</span>
            </label>
            <input
              value={form.finder_phone}
              onChange={e => set('finder_phone', e.target.value)}
              required
              placeholder="10-digit mobile number"
              maxLength={10}
              className="pf-input"
            />
          </div>
        </div>
      </div>

      <div className="pf-section">
        <p className="pf-section-title" data-i18n="form_visit_preference">Visit preference</p>
        <div className="pf-grid-2">
          <div className="pf-field">
            <label className="pf-label">
              <span data-i18n="form_preferred_day">Preferred Day</span> <span className="pf-required">*</span>
            </label>
            <input
              type="date"
              value={form.preferred_day}
              onChange={e => set('preferred_day', e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="pf-input"
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">
              <span data-i18n="form_preferred_time">Preferred Time</span> <span className="pf-required">*</span>
            </label>
            <select
              value={form.preferred_time}
              onChange={e => set('preferred_time', e.target.value)}
              className="pf-input"
            >
              <option value="morning">Morning (9am - 12pm)</option>
              <option value="afternoon">Afternoon (12pm - 4pm)</option>
              <option value="evening">Evening (4pm - 7pm)</option>
            </select>
          </div>
        </div>

        <div className="pf-field">
          <label className="pf-label">
            <span data-i18n="form_message_optional">Message (Optional)</span>
          </label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            rows={3}
            placeholder="Any special requirements or questions..."
            className="pf-input"
          />
        </div>
      </div>

      {error && (
        <p className="pf-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="pf-submit"
      >
        {loading ? 'Submitting...' : <span data-i18n="action_request_visit">Request Visit</span>}
      </button>
    </form>
  )
}

export default function VisitPage() {
  return (
    <div className="pf-page">
      <div className="pf-wrap">
        <div className="pf-card">
          <div className="pf-head">
            <span className="pf-kicker" data-i18n="form_visit_kicker">Visit coordination</span>
            <h1 className="pf-title" data-i18n="form_visit_title">Request a Visit</h1>
            <p className="pf-subtitle" data-i18n="form_visit_subtitle">
              Share your contact details and preferred timing. We will coordinate the visit and confirm the next step with you.
            </p>
          </div>
          <div className="pf-body">
            <Suspense fallback={<p className="text-gray-400 text-sm">Loading...</p>}>
              <VisitForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
