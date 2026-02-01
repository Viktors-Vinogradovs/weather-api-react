export default function CityCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-12"></div>
        </div>
        <div className="w-14 h-14 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-3">
        <div className="h-9 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-32"></div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
        <div className="h-4 bg-gray-100 rounded w-12"></div>
        <div className="h-4 bg-gray-100 rounded w-16"></div>
      </div>
    </div>
  );
}
