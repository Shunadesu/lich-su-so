const ContentDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button skeleton */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Banner Image skeleton - Full width */}
      <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Content Header skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 -mt-16 md:-mt-20 lg:-mt-24 relative z-10 animate-pulse">
          {/* Title skeleton */}
          <div className="mb-6">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded-full w-32"></div>
              <div className="h-8 bg-gray-200 rounded-full w-28"></div>
            </div>
          </div>

          {/* Category badges skeleton */}
          <div className="mb-4 flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>

          {/* Info Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-28"></div>
              </div>
            ))}
          </div>

          {/* Description skeleton */}
          <div className="mb-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        {/* Content sections skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailSkeleton;

