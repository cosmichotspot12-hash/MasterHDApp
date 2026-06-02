'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ListPage() {
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
    setForm(prev => ({ ...prev, [field]: value }))
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
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to submit')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Submitted Successfully!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you! We will contact you within 24 hours to schedule a visit and get your property listed.
          </p>
          <Link href="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-orange-500">MasterHD</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/rent" className="text-gray-600 hover:text-orange-500">Rent</Link>
            <Link href="/sale" className="text-gray-600 hover:text-orange-500">Sale</Link>
            <Link href="/find" className="text-gray-600 hover:text-orange-500">Find Property</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 mb-1">List Your Property</h1>
          <p className="text-gray-500 text-sm mb-2">
            Fill in basic details and we will contact you within 24 hours.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-orange-700">
              We visit your property, shoot a professional video, and promote it to our 6,300+ followers on Instagram.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.owner_name}
                onChange={e => set('owner_name', e.target.value)}
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
                value={form.owner_phone}
                onChange={e => set('owner_phone', e.target.value)}
                required
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.listing_type}
                onChange={e => set('listing_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locality <span className="text-red-500">*</span>
              </label>
              <input
                value={form.locality}
                onChange={e => set('locality', e.target.value)}
                required
                placeholder="e.g. Vidyanagar, Gokul Road"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Price (₹)
              </label>
              <input
                type="number"
                value={form.expected_price}
                onChange={e => set('expected_price', e.target.value)}
                placeholder="Monthly rent or sale price"
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
              {loading ? 'Submitting...' : 'Submit Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}