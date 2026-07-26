"use client"

import { useEffect, useState } from "react"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/app/actions/admin"
import { FolderPlus, Trash2, Edit2, X, Check } from "lucide-react"

interface Category {
  id: number
  name: string
  createdAt: Date
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadData = async () => {
    const list = await getCategories()
    setCategories(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setError("")
    setMessage("")
    setLoading(true)

    const res = await createCategory(name.trim())
    if (res.success) {
      setName("")
      setMessage("เพิ่มหมวดหมู่สำเร็จ!")
      loadData()
    } else {
      setError(res.error || "เกิดข้อผิดพลาด")
    }
    setLoading(false)
  }

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleSaveEdit = async (id: number) => {
    if (!editingName.trim()) return
    setError("")
    setMessage("")

    const res = await updateCategory(id, editingName.trim())
    if (res.success) {
      setEditingId(null)
      setMessage("แก้ไขหมวดหมู่สำเร็จ!")
      loadData()
    } else {
      setError(res.error || "เกิดข้อผิดพลาด")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่? ข้อมูลข่าวในหมวดหมู่นี้จะหายไป")) return
    setError("")
    setMessage("")
    await deleteCategory(id)
    setMessage("ลบหมวดหมู่เรียบร้อยแล้ว!")
    loadData()
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">จัดการหมวดหมู่ข่าว</h1>
        <p className="text-slate-400 text-sm">สร้าง แก้ไข หรือลบหมวดหมู่ของข่าวสารบนเว็บไซต์</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-rose-400" />
            เพิ่มหมวดหมู่ใหม่
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="catName" className="block text-slate-300 text-xs font-medium mb-1.5">
                ชื่อหมวดหมู่
              </label>
              <input
                type="text"
                id="catName"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น การเมือง, ไอที, ท่องเที่ยว"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg py-2 text-sm font-medium transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "กำลังบันทึก..." : "เพิ่มหมวดหมู่"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">รายชื่อหมวดหมู่ที่มีอยู่</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">ชื่อหมวดหมู่</th>
                  <th className="px-6 py-3.5">วันที่สร้าง</th>
                  <th className="px-6 py-3.5 text-right">เครื่องมือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      ไม่พบข้อมูลหมวดหมู่ข่าวสาร
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-900/40 transition">
                      <td className="px-6 py-4 text-slate-400 font-mono">#{cat.id}</td>
                      <td className="px-6 py-4">
                        {editingId === cat.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          />
                        ) : (
                          <span className="text-white font-medium">{cat.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(cat.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === cat.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(cat.id)}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded transition cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(cat)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
