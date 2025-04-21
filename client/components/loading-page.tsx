"use client"

import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="relative">
        {/* Animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-black dark:border-white rounded-full animate-ping opacity-20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-black dark:border-white rounded-full animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-full animate-spin-slow" />
        </div>

        {/* Center dot */}
        <div className="relative w-8 h-8 bg-white dark:bg-black border-2 border-black dark:border-white rounded-full z-10" />
      </div>

      {/* Progress indicator */}
      <div className="mt-16 w-64 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="mt-4 text-black dark:text-white font-mono text-sm">Loading... {progress}%</p>
    </div>
  )
}
