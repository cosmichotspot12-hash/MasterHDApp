import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PropertyWorkspace } from '@/components/admin-operations'
import { getAdminListing, getAdminRequirements, getAdminVisitRequests } from '@/lib/admin-data'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

async function getPropertyWorkspaceData(id: string) {
  try {
    const [listing, allVisits, requirements] = await Promise.all([
      getAdminListing(id),
      getAdminVisitRequests(),
      getAdminRequirements(),
    ])

    if (!listing) return null

    const visits = allVisits.filter((visit) => visit.listing_id === id)
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
