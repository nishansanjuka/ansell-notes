import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { HomeIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto space-y-8 text-center">
        <div className="space-y-6">
          <Image
            src="/logo.jpg"
            alt="Ansell Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight text-[#0066CC]">404</h1>
          <p className="text-2xl font-semibold text-gray-900">Page Not Found</p>
          <p className="text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        
        <Button
          asChild
          className="bg-[#0066CC] hover:bg-[#0052A3] text-white gap-2"
          size="lg"
        >
          <Link href="/">
            <HomeIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="pt-8 text-sm text-gray-500">
          <p>Need assistance? Contact our support team.</p>
        </div>
      </div>
    </div>
  )
}

