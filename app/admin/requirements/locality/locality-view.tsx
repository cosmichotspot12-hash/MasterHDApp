import Link from 'next/link'
import { RequirementsLocalityWorkspace, type AdminListing, type Requirement } from '@/components/admin-operations'
import { getAdminListings, getAdminRequirements } from '@/lib/admin-data'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export function normalizeLocality(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

async function getRequirementsAndListings() {
  try {
    const [requirements, listings] = await Promise.all([
      getAdminRequirements(),
      getAdminListings(),
    ])
    return {
      requirements,
      listings,
    }
  } catch {
    return { requirements: [] as Requirement[], listings: [] as AdminListing[] }
  }
}

export async function RequirementsLocalityView({ locality }: { locality: string }) {
  const { requirements: allRequirements, listings } = await getRequirementsAndListings()
  const activeListings = listings.filter((l) => l.status === 'active')
  const normalizedLocality = normalizeLocality(locality)
  const requirements = normalizedLocality
    ? allRequirements.filter((requirement) => normalizeLocality(requirement.locality_preference || '') === normalizedLocality)
    : []

  const newCount = requirements.filter((requirement) => requirement.status === 'new').length
  const rentCount = requirements.filter((requirement) => requirement.listing_type === 'rent').length
  const saleCount = requirements.filter((requirement) => requirement.listing_type === 'sale').length
  const leaseCount = requirements.filter((requirement) => requirement.listing_type === 'lease').length
  const title = locality || 'Locality'

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/requirements" className="text-sm font-bold text-slate-500 hover:text-slate-950">
            &lt;- All localities
          </Link>
          <h1 className="mt-2 text-2xl font-black text-slate-950">{title} Requirements</h1>
          <p className="mt-1 text-sm text-slate-500">Focused seeker list for this locality.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{requirements.length} seekers</span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{newCount} new</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{rentCount} rent</span>
          <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">{saleCount} sale</span>
          <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">{leaseCount} lease</span>
        </div>
      </div>

      {normalizedLocality ? (
        <RequirementsLocalityWorkspace locality={locality} requirements={requirements} activeListings={activeListings} whatsappNumber={WHATSAPP_NUMBER} />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
          Select a locality from the requirements page.
        </div>
      )}
    </div>
  )
}
