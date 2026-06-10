'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FindPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    finder_name: '',
    finder_phone: '',
    listing_type: 'rent',
    property_category: 'apartment',
    bhk_count: 'any',
    locality_preference: '',
    budget_min: '',
    budget_max: '',
    furnishing_preference: 'any',
    timeline: 'immediately',
    tenant_type: 'family',
    food_preference: 'veg',
    facing_preference: 'any',
    special_requirements: '',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget_min: form.budget_min ? parseInt(form.budget_min) : null,
          budget_max: parseInt(form.budget_max),
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
          <h2 data-i18n="success_requirement_title">Requirement Submitted</h2>
          <p data-i18n="success_requirement_copy">
            We will match your requirement with available properties and contact you within 24 hours.
          </p>
          <Link href="/" className="pf-back" data-i18n="action_back_home">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pf-page">
      <div className="pf-wrap pf-wrap-wide">
        <div className="pf-card">
          <div className="pf-head">
            <span className="pf-kicker" data-i18n="form_requirement_kicker">Requirement matching</span>
            <h1 className="pf-title" data-i18n="form_requirement_title">Find My Property</h1>
            <p className="pf-subtitle" data-i18n="form_requirement_subtitle">
              Tell us what you are looking for. We will match your requirement with relevant properties and contact you directly.
            </p>
          </div>

          <div className="pf-body">
            <form onSubmit={handleSubmit} className="pf-form">

            {/* Contact */}
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
                    placeholder="Full name"
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
                    placeholder="10-digit number"
                    maxLength={10}
                    className="pf-input"
                  />
                </div>
              </div>
            </div>

            {/* Looking For */}
            <div className="pf-section">
              <p className="pf-section-title" data-i18n="form_search_brief">Search brief</p>
              <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_looking_to">Looking To</label>
                <select value={form.listing_type} onChange={e => set('listing_type', e.target.value)}
                  className="pf-input">
                  <option value="rent">Rent</option>
                  <option value="sale">Buy</option>
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_property_type">Property Type</label>
                <select value={form.property_category} onChange={e => set('property_category', e.target.value)}
                  className="pf-input">
                  <option value="apartment">Apartment</option>
                  <option value="independent_house">Independent House</option>
                  <option value="house_in_layout">House in Layout</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

            {/* BHK and Locality */}
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_bhk">BHK</label>
                <select value={form.bhk_count} onChange={e => set('bhk_count', e.target.value)}
                  className="pf-input">
                  <option value="any">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4+">4+ BHK</option>
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label">
                  <span data-i18n="form_preferred_locality">Preferred Locality</span> <span className="pf-required">*</span>
                </label>
                <input
                  value={form.locality_preference}
                  onChange={e => set('locality_preference', e.target.value)}
                  required
                  placeholder="e.g. Vidyanagar, Gokul Road"
                  className="pf-input"
                />
              </div>
              </div>
            </div>

            {/* Budget */}
            <div className="pf-section">
              <p className="pf-section-title" data-i18n="form_budget">Budget</p>
              <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_min_budget">Min Budget (Rs.)</label>
                <input
                  type="number"
                  value={form.budget_min}
                  onChange={e => set('budget_min', e.target.value)}
                  placeholder="Optional"
                  className="pf-input"
                />
              </div>
              <div className="pf-field">
                <label className="pf-label">
                  <span data-i18n="form_max_budget">Max Budget (Rs.)</span> <span className="pf-required">*</span>
                </label>
                <input
                  type="number"
                  value={form.budget_max}
                  onChange={e => set('budget_max', e.target.value)}
                  required
                  placeholder="Maximum budget"
                  className="pf-input"
                />
              </div>
              </div>
            </div>

            {/* Furnishing and Timeline */}
            <div className="pf-section">
              <p className="pf-section-title" data-i18n="form_preferences">Preferences</p>
              <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_furnishing">Furnishing</label>
                <select value={form.furnishing_preference} onChange={e => set('furnishing_preference', e.target.value)}
                  className="pf-input">
                  <option value="any">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi_furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_timeline">When Do You Need It</label>
                <select value={form.timeline} onChange={e => set('timeline', e.target.value)}
                  className="pf-input">
                  <option value="immediately">Immediately</option>
                  <option value="within_1_month">Within 1 Month</option>
                  <option value="within_3_months">Within 3 Months</option>
                  <option value="just_exploring">Just Exploring</option>
                </select>
              </div>

            {/* Tenant Profile */}
              </div>
              <div className="pf-grid-3">
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_tenant_type">I Am</label>
                <select value={form.tenant_type} onChange={e => set('tenant_type', e.target.value)}
                  className="pf-input">
                  <option value="family">Family</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_food">Food</label>
                <select value={form.food_preference} onChange={e => set('food_preference', e.target.value)}
                  className="pf-input">
                  <option value="veg">Veg</option>
                  <option value="non_veg">Non-Veg</option>
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label" data-i18n="form_facing">Facing</label>
                <select value={form.facing_preference} onChange={e => set('facing_preference', e.target.value)}
                  className="pf-input">
                  <option value="any">Any</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                </select>
              </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div className="pf-section">
              <div className="pf-field">
              <label className="pf-label">
                <span data-i18n="form_special_requirements">Special Requirements (Optional)</span>
              </label>
              <textarea
                value={form.special_requirements}
                onChange={e => set('special_requirements', e.target.value)}
                rows={3}
                placeholder="e.g. Ground floor needed, pet friendly, near specific college..."
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
              {loading ? 'Submitting...' : <span data-i18n="action_submit_requirement">Submit My Requirement</span>}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}
