"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loginInput, setLoginInput] = useState("") // Can be email or username
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let result
      
      // Determine if it is email or username login
      if (loginInput.includes("@")) {
        result = await authClient.signIn.email({
          email: loginInput,
          password,
        })
      } else {
        result = await authClient.signIn.username({
          username: loginInput,
          password,
        })
      }

      if (result.error) {
        setError(result.error.message || "ชื่อผู้ใช้งาน/อีเมล หรือรหัสผ่านไม่ถูกต้อง")
      } else {
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            เข้าสู่ระบบ <span className="text-violet-400">DARA</span>
          </h1>
          <p className="text-slate-400 text-sm">เข้าสู่ระบบแผงควบคุมการจัดการสำหรับผู้ดูแลและผู้เขียน</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="loginInput">
              ชื่อผู้ใช้งาน หรือ อีเมล
            </label>
            <input
              type="text"
              id="loginInput"
              required
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              placeholder="กรอกชื่อผู้ใช้งาน หรืออีเมลของคุณ"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-slate-300 text-sm font-medium" htmlFor="password">
                รหัสผ่าน
              </label>
            </div>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white rounded-lg py-2.5 text-sm font-medium shadow-lg hover:shadow-violet-600/20 transition cursor-pointer disabled:opacity-50 mt-6"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="text-center mt-6 text-slate-400 text-sm">
          ยังไม่มีบัญชีผู้ใช้งาน?{" "}
          <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-medium transition">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  )
}
