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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-sm font-black">OK</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Requirement Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            We will match your requirement with available properties and contact you within 24 hours.
          </p>
          <Link href="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-3xl px-3 sm:px-5 py-10">
        <div className="content-card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Find My Property</h1>
          <p className="text-gray-500 text-sm mb-6">
            Tell us what you are looking for. We will match you with the right property and contact you directly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.finder_name}
                  onChange={e => set('finder_name', e.target.value)}
                  required
                  placeholder="Full name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.finder_phone}
                  onChange={e => set('finder_phone', e.target.value)}
                  required
                  placeholder="10-digit number"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Looking For */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Looking To</label>
                <select value={form.listing_type} onChange={e => set('listing_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="rent">Rent</option>
                  <option value="sale">Buy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select value={form.property_category} onChange={e => set('property_category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="apartment">Apartment</option>
                  <option value="independent_house">Independent House</option>
                  <option value="house_in_layout">House in Layout</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
            </div>

            {/* BHK and Locality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
                <select value={form.bhk_count} onChange={e => set('bhk_count', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="any">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4+">4+ BHK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Locality <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.locality_preference}
                  onChange={e => set('locality_preference', e.target.value)}
                  required
                  placeholder="e.g. Vidyanagar, Gokul Road"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget (Rs.)</label>
                <input
                  type="number"
                  value={form.budget_min}
                  onChange={e => set('budget_min', e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Budget (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.budget_max}
                  onChange={e => set('budget_max', e.target.value)}
                  required
                  placeholder="Maximum budget"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Furnishing and Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                <select value={form.furnishing_preference} onChange={e => set('furnishing_preference', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="any">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi_furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">When Do You Need It</label>
                <select value={form.timeline} onChange={e => set('timeline', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="immediately">Immediately</option>
                  <option value="within_1_month">Within 1 Month</option>
                  <option value="within_3_months">Within 3 Months</option>
                  <option value="just_exploring">Just Exploring</option>
                </select>
              </div>
            </div>

            {/* Tenant Profile */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I Am</label>
                <select value={form.tenant_type} onChange={e => set('tenant_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="family">Family</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>
                <select value={form.food_preference} onChange={e => set('food_preference', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="veg">Veg</option>
                  <option value="non_veg">Non-Veg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
                <select value={form.facing_preference} onChange={e => set('facing_preference', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="any">Any</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                </select>
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requirements (Optional)
              </label>
              <textarea
                value={form.special_requirements}
                onChange={e => set('special_requirements', e.target.value)}
                rows={3}
                placeholder="e.g. Ground floor needed, pet friendly, near specific college..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit My Requirement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
