import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RequirementsLocalityWorkspace, type Requirement } from '@/components/admin-operations'
import { adminApiHeaders } from '@/lib/admin-api'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

async function getRequirements() {
  try {
    const headers = await adminApiHeaders()
    const res = await fetch(APP_URL + '/api/admin/reqs', {
      cache: 'no-store',
      headers,
    })
    const { data } = await res.json()
    return (data || []) as Requirement[]
  } catch {
    return [] as Requirement[]
  }
}

export default async function RequirementsLocalityPage({ params }: { params: Promise<{ locality: string }> }) {
  const { locality: localityParam } = await params
  const locality = decodeURIComponent(localityParam)
  const allRequirements = await getRequirements()
  const requirements = allRequirements.filter((requirement) => requirement.locality_preference === locality)

  if (requirements.length === 0) notFound()

  const newCount = requirements.filter((requirement) => requirement.status === 'new').length
  const rentCount = requirements.filter((requirement) => requirement.listing_type === 'rent').length
  const saleCount = requirements.filter((requirement) => requirement.listing_type === 'sale').length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/requirements" className="text-sm font-bold text-slate-500 hover:text-slate-950">
            &lt;- All localities
          </Link>
          <h1 className="mt-2 text-2xl font-black text-slate-950">{locality} Requirements</h1>
          <p className="mt-1 text-sm text-slate-500">Focused seeker list for this locality.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{requirements.length} seekers</span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{newCount} new</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{rentCount} rent</span>
          <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">{saleCount} sale</span>
        </div>
      </div>
      <RequirementsLocalityWorkspace locality={locality} requirements={requirements} whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  )
}
