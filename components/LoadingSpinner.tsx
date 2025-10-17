interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-blue-200 border-solid rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-900">{message}</p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}