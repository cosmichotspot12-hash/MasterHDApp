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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-500 text-sm font-black">OK</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Visit Request Submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">
          We will contact you within 24 hours to confirm your visit.
        </p>
        <Link href="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-700 font-medium">Requesting visit for:</p>
          <p className="text-sm text-gray-700 mt-0.5">{title}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.finder_name}
          onChange={e => set('finder_name', e.target.value)}
          required
          placeholder="Enter your full name"
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
          placeholder="10-digit mobile number"
          maxLength={10}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Day <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.preferred_day}
          onChange={e => set('preferred_day', e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Time <span className="text-red-500">*</span>
        </label>
        <select
          value={form.preferred_time}
          onChange={e => set('preferred_time', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="morning">Morning (9am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 4pm)</option>
          <option value="evening">Evening (4pm - 7pm)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message (Optional)
        </label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          rows={3}
          placeholder="Any special requirements or questions..."
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
        {loading ? 'Submitting...' : 'Request Visit'}
      </button>
    </form>
  )
}

export default function VisitPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-2xl px-3 sm:px-5 py-10">
        <div className="content-card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Request a Visit</h1>
          <p className="text-gray-500 text-sm mb-6">
            Fill in your details and we will coordinate the visit for you.
          </p>
          <Suspense fallback={<p className="text-gray-400 text-sm">Loading...</p>}>
            <VisitForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
