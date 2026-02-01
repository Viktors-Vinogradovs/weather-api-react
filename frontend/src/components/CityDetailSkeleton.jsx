export default function CityDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-8 bg-blue-400/50 rounded w-32 mb-2"></div>
            <div className="h-4 bg-blue-400/30 rounded w-12 mb-4"></div>
          </div>
          <div className="w-24 h-24 bg-blue-400/30 rounded"></div>
        </div>
        <div className="h-16 bg-blue-400/40 rounded w-28 mt-4 mb-2"></div>
        <div className="h-4 bg-blue-400/30 rounded w-40"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
