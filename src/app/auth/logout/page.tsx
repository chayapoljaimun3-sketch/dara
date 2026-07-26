"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await authClient.signOut()
      } catch (err) {
        console.error("Signout error:", err)
      }
      // Redirect using window.location to trigger a clean reload and force middleware evaluation
      window.location.href = "/auth/login"
    }
    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400">กำลังออกจากระบบ...</p>
      </div>
    </div>
  )
}
