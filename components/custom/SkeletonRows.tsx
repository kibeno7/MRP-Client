export default function SkeletonRows() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 p-2 border-t animate-pulse text-sm sm:text-base"
        >
          <div className="hidden md:block">
            <div className="h-4 bg-gray-300 rounded-md w-16 mx-auto"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded-md w-24"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded-md w-20"></div>
          </div>
          <div className="hidden xl:block text-center">
            <div className="h-4 bg-gray-300 rounded-md w-16 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-300 rounded-md w-12 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
