'use client'

const SOURCES = ['website', 'instagram', 'referral', 'walk_in', 'google_form']

export default function SourceUpdater({
  id,
  currentSource,
  type,
}: {
  id: string
  currentSource: string | null
  type: string
}) {
  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await fetch(`/api/admin/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: e.target.value }),
    })
    window.location.reload()
  }

  return (
    <select
      defaultValue={currentSource || 'website'}
      onChange={handleChange}
      title="Lead source"
      className="cursor-pointer rounded-full border-0 bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700"
    >
      {SOURCES.map((s) => (
        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
      ))}
    </select>
  )
}
