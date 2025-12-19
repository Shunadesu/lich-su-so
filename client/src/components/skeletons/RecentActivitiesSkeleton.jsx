const RecentActivitiesSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
          {/* Banner Image skeleton */}
          <div className="w-full h-48 bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="p-6">
            {/* Icon and type skeleton */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            
            {/* Meta info skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Tags skeleton */}
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivitiesSkeleton;

