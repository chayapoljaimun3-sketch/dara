"use client"

import { useEffect, useState } from "react"
import { getUsers, updateUserRole } from "@/app/actions/admin"
import { ShieldCheck, User } from "lucide-react"

interface UserItem {
  id: string
  name: string
  email: string
  username: string | null
  roleId: number
  role: {
    id: number
    name: string
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const loadUsers = async () => {
    const list = await getUsers()
    setUsers(list as any)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRoleId: number) => {
    setLoadingId(userId)
    setMessage("")
    try {
      await updateUserRole(userId, newRoleId)
      setMessage("อัปเดตบทบาทผู้ใช้งานสำเร็จ!")
      loadUsers()
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">จัดการผู้ใช้งาน</h1>
        <p className="text-slate-400 text-sm">จัดการสิทธิ์และบทบาทสมาชิกในระบบควบคุม (มีสิทธิ์เฉพาะ admin และ writer)</p>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-lg">
          {message}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            รายชื่อผู้ใช้ในระบบ
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">ผู้ใช้งาน</th>
                <th className="px-6 py-3.5">ชื่อผู้ใช้งาน (Username)</th>
                <th className="px-6 py-3.5">อีเมล</th>
                <th className="px-6 py-3.5">บทบาท (Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    กำลังโหลดข้อมูลผู้ใช้งาน...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-600/15 border border-rose-500/20 flex items-center justify-center text-rose-400 font-semibold text-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      @{u.username || "ไม่มีข้อมูล"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          disabled={loadingId === u.id}
                          value={u.roleId}
                          onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                          className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition disabled:opacity-50"
                        >
                          <option value="1">Admin (ผู้ดูแลระบบ)</option>
                          <option value="2">Writer (ผู้เขียนข่าว)</option>
                        </select>
                        {loadingId === u.id && (
                          <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
