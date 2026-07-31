export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-10 max-w-4xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Featured image skeleton */}
        <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse mb-8" />

        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
