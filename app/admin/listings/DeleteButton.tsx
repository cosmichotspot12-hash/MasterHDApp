'use client'

export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this listing?')) return
    await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-flex min-h-8 items-center justify-center rounded-md border border-red-100 bg-red-50 px-2 text-[11px] font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
    >
      Delete
    </button>
  )
}
