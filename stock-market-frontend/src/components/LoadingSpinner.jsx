export default function LoadingSpinner() {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0f1117' }}>
        <div className="text-center">
          {/* Animated rings */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-transparent
                            border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent
                            border-t-purple-500 animate-spin"
                 style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}>
            </div>
            <div className="absolute inset-4 rounded-full border-4 border-transparent
                            border-t-blue-400 animate-spin"
                 style={{ animationDuration: '1.5s' }}>
            </div>
          </div>
          <p className="text-blue-400 font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }