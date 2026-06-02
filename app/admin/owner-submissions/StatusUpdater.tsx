'use client'

export default function StatusUpdater({
  id,
  currentStatus,
  type,
  options
}: {
  id: string
  currentStatus: string
  type: string
  options: string[]
}) {
  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await fetch(`/api/admin/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value })
    })
    window.location.reload()
  }

  const colors: Record<string, string> = {
    new: 'bg-red-100 text-red-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    visit_scheduled: 'bg-blue-100 text-blue-700',
    listed: 'bg-green-100 text-green-700',
    rejected: 'bg-gray-100 text-gray-700',
    visit_done: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    dropped: 'bg-gray-100 text-gray-700',
    matched: 'bg-blue-100 text-blue-700',
    fulfilled: 'bg-green-100 text-green-700',
    no_match: 'bg-gray-100 text-gray-700',
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${colors[currentStatus] || 'bg-gray-100 text-gray-700'}`}
    >
      {options.map(o => (
        <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>
      ))}
    </select>
  )
}