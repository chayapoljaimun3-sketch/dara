"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("2") // Default to writer
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        username,
        roleId: parseInt(roleId),
      })

      if (error) {
        setError(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก")
      } else {
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการติดต่อระบบ")
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
            สมัครสมาชิก <span className="text-violet-400">DARA</span>
          </h1>
          <p className="text-slate-400 text-sm">สร้างบัญชีผู้ใช้งานใหม่เข้าสู่ระบบจัดการ</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="name">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              placeholder="กรอกชื่อ-นามสกุลของคุณ"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="username">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              placeholder="กรอกชื่อผู้ใช้งาน"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="email">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="password">
              รหัสผ่าน
            </label>
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
            {loading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="text-center mt-6 text-slate-400 text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  )
}
