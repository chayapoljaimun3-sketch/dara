"use client"

import { useEffect, useState } from "react"
import { getPages, createPage, updatePage, deletePage } from "@/app/actions/admin"
import { FilePlus, Edit3, Trash2, Eye, EyeOff } from "lucide-react"

interface PageItem {
  id: number
  title: string
  slug: string
  content: string | null
  published: boolean
  createdAt: Date
}

export default function PagesManagementPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPage, setEditingPage] = useState<PageItem | null>(null)
  
  // Form fields
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadData = async () => {
    const list = await getPages()
    setPages(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setEditingPage(null)
    setTitle("")
    setSlug("")
    setContent("")
    setPublished(false)
    setError("")
    setShowForm(true)
  }

  const handleOpenEdit = (page: PageItem) => {
    setEditingPage(page)
    setTitle(page.title)
    setSlug(page.slug)
    setContent(page.content || "")
    setPublished(page.published)
    setError("")
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    setError("")
    setMessage("")
    setLoading(true)

    let res
    if (editingPage) {
      res = await updatePage(editingPage.id, title.trim(), slug.trim(), content.trim(), published)
    } else {
      res = await createPage(title.trim(), slug.trim(), content.trim(), published)
    }

    if (res.success) {
      setMessage(editingPage ? "แก้ไขหน้าเพจเรียบร้อย!" : "สร้างหน้าเพจใหม่สำเร็จ!")
      setShowForm(false)
      loadData()
    } else {
      setError(res.error || "เกิดข้อผิดพลาด")
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบหน้าเพจนี้ใช่หรือไม่? ข้อมูลทั้งหมดจะไม่สามารถย้อนกลับได้")) return
    setError("")
    setMessage("")
    await deletePage(id)
    setMessage("ลบหน้าเพจสำเร็จ!")
    loadData()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">จัดการหน้าเพจเว็บไซต์</h1>
          <p className="text-slate-400 text-sm">สร้างและแก้ไขเนื้อหาหน้าเพจประเภทสแตติก เช่น เกี่ยวกับเรา, ติดต่อเรา</p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-violet-600/10"
          >
            <FilePlus className="w-4 h-4" />
            สร้างหน้าเพจใหม่
          </button>
        )}
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

      {/* CRUD Form overlay card */}
      {showForm && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {editingPage ? "แก้ไขข้อมูลหน้าเพจ" : "เขียนหน้าเพจใหม่"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="title">
                  หัวข้อหน้าเพจ
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น เกี่ยวกับเรา"
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="slug">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  id="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="เช่น about-us"
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="content">
                เนื้อหาหน้าเพจ (HTML/ข้อความ)
              </label>
              <textarea
                id="content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="กรอกเนื้อหาสำหรับหน้าเพจนี้..."
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-slate-800 cursor-pointer"
              />
              <label htmlFor="published" className="text-slate-300 text-sm cursor-pointer select-none">
                เผยแพร่หน้านี้ทันที (Published)
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pages Table */}
      {!showForm && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">หัวข้อหน้าเพจ</th>
                  <th className="px-6 py-3.5">Slug (Path)</th>
                  <th className="px-6 py-3.5">สถานะ</th>
                  <th className="px-6 py-3.5">วันที่สร้าง</th>
                  <th className="px-6 py-3.5 text-right">เครื่องมือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      ไม่พบข้อมูลหน้าเพจเว็บไซต์
                    </td>
                  </tr>
                ) : (
                  pages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition">
                      <td className="px-6 py-4 font-semibold text-white">{p.title}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono">/{p.slug}</td>
                      <td className="px-6 py-4">
                        {p.published ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <Eye className="w-3.5 h-3.5" /> เผยแพร่แล้ว
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                            <EyeOff className="w-3.5 h-3.5" /> ฉบับร่าง
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
