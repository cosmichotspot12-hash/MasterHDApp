'use client'

import { useState } from 'react'
import Link from 'next/link'
import LocalityCombobox from '@/components/locality-combobox'

export default function ListPropertyForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    owner_name: '',
    owner_phone: '',
    listing_type: 'rent',
    locality: '',
    expected_price: '',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/owner-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          expected_price: form.expected_price ? parseInt(form.expected_price) : null,
        }),
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
      <div className="pf-success-card">
        <div className="pf-success-mark">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 data-i18n="success_owner_title">Property Details Submitted</h2>
        <p data-i18n="success_owner_copy">
          Thank you. We will check matching demand and contact you within 24 hours.
        </p>
        <Link href="/" className="pf-back" data-i18n="action_back_home">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="pf-card">
      <div className="pf-head">
        <span className="pf-kicker" data-i18n="form_owner_kicker">For owners and brokers</span>
        <h1 className="pf-title" data-i18n="form_owner_title">List Your Property</h1>
        <p className="pf-subtitle" data-i18n="form_owner_subtitle">
          Share the basics. Our team will check matching tenant or buyer demand and contact you with the next step.
        </p>
        <div className="pf-note" data-i18n="form_owner_note">
          Real local requirements, closed deal learnings, and an active Hubballi-Dharwad audience help us understand demand faster.
        </div>
      </div>

      <div className="pf-body">
        <form onSubmit={handleSubmit} className="pf-form">
          <div className="pf-section">
            <p className="pf-section-title" data-i18n="form_owner_contact">Owner contact</p>
            <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label">
                  <span data-i18n="form_name">Your Name</span> <span className="pf-required">*</span>
                </label>
                <input
                  value={form.owner_name}
                  onChange={(e) => set('owner_name', e.target.value)}
                  required
                  placeholder="Full name"
                  className="pf-input"
                />
              </div>

              <div className="pf-field">
                <label className="pf-label">
                  <span data-i18n="form_phone">Phone Number</span> <span className="pf-required">*</span>
                </label>
                <input
                  type="tel"
                  value={form.owner_phone}
                  onChange={(e) => set('owner_phone', e.target.value)}
                  required
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="pf-input"
                />
              </div>
            </div>
          </div>

          <div className="pf-section">
            <p className="pf-section-title" data-i18n="form_property_basics">Property basics</p>
            <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label">
                  <span data-i18n="form_listing_type">Listing Type</span> <span className="pf-required">*</span>
                </label>
                <select
                  value={form.listing_type}
                  onChange={(e) => set('listing_type', e.target.value)}
                  className="pf-input"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>

              <div className="pf-field">
                <label className="pf-label">
                  <span data-i18n="form_locality">Locality</span> <span className="pf-required">*</span>
                </label>
                <LocalityCombobox
                  value={form.locality}
                  onChange={(v) => set('locality', v)}
                  required
                />
              </div>
            </div>

            <div className="pf-field">
              <label className="pf-label">
                <span data-i18n="form_expected_price">Expected Price (Rs.)</span>
              </label>
              <input
                type="number"
                value={form.expected_price}
                onChange={(e) => set('expected_price', e.target.value)}
                placeholder="Monthly rent, sale price, or lease amount"
                className="pf-input"
              />
            </div>
          </div>

          {error && <p className="pf-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="pf-submit"
          >
            {loading ? 'Submitting...' : <span data-i18n="action_submit_property">Submit Property Details</span>}
          </button>
        </form>
      </div>
    </div>
  )
}
