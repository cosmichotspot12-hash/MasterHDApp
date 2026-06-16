import { OwnerQueue, type OwnerSubmission } from '@/components/admin-operations'
import { getAdminOwnerSubmissions } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

async function getSubmissions() {
  try {
    return await getAdminOwnerSubmissions()
  } catch {
    return [] as OwnerSubmission[]
  }
}

export default async function OwnerSubmissionsPage() {
  const submissions = await getSubmissions()
  const newCount = submissions.filter((submission) => submission.status === 'new').length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Owner Leads</h1>
          <p className="mt-1 text-sm text-slate-500">Property owners who want to list with you.</p>
        </div>
        <span className="w-fit rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{newCount} new</span>
      </div>
      <OwnerQueue submissions={submissions} whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  )
}
