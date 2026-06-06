import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PropertyWorkspace, type AdminListing, type Requirement, type VisitRequest } from '@/components/admin-operations'
import { adminApiHeaders } from '@/lib/admin-api'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

async function getPropertyWorkspaceData(id: string) {
  try {
    const headers = await adminApiHeaders()
    const [listingRes, visitsRes, requirementsRes] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings/' + id, { cache: 'no-store', headers }),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store', headers }),
      fetch(APP_URL + '/api/admin/reqs', { cache: 'no-store', headers }),
    ])

    if (!listingRes.ok) return null

    const [listingJson, visitsJson, requirementsJson] = await Promise.all([
      listingRes.json(),
      visitsRes.json(),
      requirementsRes.json(),
    ])

    const listing = listingJson.data as AdminListing
    const visits = ((visitsJson.data || []) as VisitRequest[]).filter((visit) => visit.listing_id === id)
    const requirements = (requirementsJson.data || []) as Requirement[]

    return { listing, visits, requirements }
  } catch {
    return null
  }
}

export default async function AdminPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getPropertyWorkspaceData(id)

  if (!data) notFound()

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/admin/listings" className="text-sm font-bold text-slate-500 hover:text-slate-950">
            &lt;- Properties
          </Link>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">Property workspace</p>
        </div>
      </div>
      <PropertyWorkspace listing={data.listing} visits={data.visits} requirements={data.requirements} whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  )
}
