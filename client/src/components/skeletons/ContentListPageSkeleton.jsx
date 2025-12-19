const ContentListPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Teacher Content Section Skeleton */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="flex items-center mb-6">
            <div className="h-6 w-6 bg-gray-200 rounded mr-3"></div>
            <div className="h-7 bg-gray-200 rounded w-48 mr-3"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Content Section Skeleton */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="flex items-center mb-6">
            <div className="h-6 w-6 bg-gray-200 rounded mr-3"></div>
            <div className="h-7 bg-gray-200 rounded w-48 mr-3"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentListPageSkeleton;

