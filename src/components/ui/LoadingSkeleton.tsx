export function CategorySkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-200 aspect-square" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-200 aspect-square" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  )
}
