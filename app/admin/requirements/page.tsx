import { RequirementsTabs, type AdminListing, type Requirement } from '@/components/admin-operations'
import { getAdminListings, getAdminRequirements } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

async function getRequirementsData() {
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

export default async function RequirementsPage() {
  const { requirements, listings } = await getRequirementsData()
  const activeListings = listings.filter((listing) => listing.status === 'active')
  const newCount = requirements.filter((requirement) => requirement.status === 'new').length
  const localityCount = new Set(requirements.map((requirement) => requirement.locality_preference).filter(Boolean)).size

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Requirements</h1>
          <p className="mt-1 text-sm text-slate-500">Work the seeker queue daily; switch to insights or localities when planning.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{newCount} new</span>
          <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{localityCount} localities</span>
        </div>
      </div>
      <RequirementsTabs requirements={requirements} activeListings={activeListings} whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  )
}
