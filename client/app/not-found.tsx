"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileWarningIcon as FileDamage, Home, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFounds({
  error = "Page Not found",
}: {
  error: any
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black text-white">
      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* PDF torn effect */}
        <div className="absolute inset-x-0 top-0 h-8 w-full">
          <svg
            className="h-8 w-full"
            viewBox="0 0 600 30"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L50,10 L100,5 L150,15 L200,8 L250,20 L300,10 L350,15 L400,5 L450,12 L500,18 L550,8 L600,0 L600,30 L0,30 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 mt-8 flex flex-col items-center space-y-8 border border-white p-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white">
            <FileDamage className="h-12 w-12" />
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">500</h1>
            <h2 className="text-xl font-semibold sm:text-2xl">{error}</h2>
            <p className="mx-auto max-w-md text-base text-gray-400">
              The url you are trying to access is not is not available
            </p>
            {error.digest && <p className="text-xs text-gray-600">Error ID: {error.digest}</p>}
          </div>

          <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button asChild variant="outline" className="border-white text-white hover:bg-white text-black">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* PDF watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="rotate-45 text-[120px] font-bold tracking-widest">ERROR</div>
        </div>
      </div>
    </div>
  )
}
