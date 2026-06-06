export default function Loading() {
  return (
    <div className="site-container py-10">
      <div className="skeleton h-8 w-60" />
      <div className="skeleton mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="skeleton h-72 rounded-lg" />)}
      </div>
    </div>
  )
}
