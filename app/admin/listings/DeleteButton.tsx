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
      className="text-red-500 hover:text-red-600 font-medium text-sm"
    >
      Delete
    </button>
  )
}