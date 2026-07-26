"use client"

import { useEffect, useState } from "react"
import { getBanners, createBannerAction, updateBannerAction, deleteBanner } from "@/app/actions/admin"
import { Plus, Image as ImageIcon, Trash2, Edit3, Eye, EyeOff } from "lucide-react"

interface BannerItem {
  id: number
  title: string
  imageUrl: string
  linkUrl: string | null
  active: boolean
  order: number
  createdAt: Date
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [active, setActive] = useState(true)
  const [order, setOrder] = useState("0")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadData = async () => {
    const list = await getBanners()
    setBanners(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setEditingBanner(null)
    setTitle("")
    setLinkUrl("")
    setActive(true)
    setOrder("0")
    setSelectedFile(null)
    setPreviewUrl("")
    setError("")
    setShowForm(true)
  }

  const handleOpenEdit = (banner: BannerItem) => {
    setEditingBanner(banner)
    setTitle(banner.title)
    setLinkUrl(banner.linkUrl || "")
    setActive(banner.active)
    setOrder(banner.order.toString())
    setSelectedFile(null)
    setPreviewUrl(banner.imageUrl)
    setError("")
    setShowForm(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (!editingBanner && !selectedFile) {
      setError("กรุณาเลือกไฟล์ภาพแบนเนอร์")
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("linkUrl", linkUrl.trim())
    formData.append("active", active ? "true" : "false")
    formData.append("order", order)
    if (selectedFile) {
      formData.append("image", selectedFile)
    }

    let res
    if (editingBanner) {
      formData.append("id", editingBanner.id.toString())
      res = await updateBannerAction(formData)
    } else {
      res = await createBannerAction(formData)
    }

    if (res.success) {
      setMessage(editingBanner ? "แก้ไขแบนเนอร์สำเร็จ!" : "อัพโหลดแบนเนอร์ใหม่สำเร็จ!")
      setShowForm(false)
      loadData()
    } else {
      setError(res.error || "เกิดข้อผิดพลาด")
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบแบนเนอร์นี้ใช่หรือไม่?")) return
    setError("")
    setMessage("")
    await deleteBanner(id)
    setMessage("ลบแบนเนอร์สำเร็จ!")
    loadData()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">แบนเนอร์สไลด์</h1>
          <p className="text-slate-400 text-sm">จัดการรูปภาพแบนเนอร์สไลด์ประชาสัมพันธ์ที่จะแสดงในหน้าแรกของเว็บไซต์</p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-violet-600/10"
          >
            <Plus className="w-4.5 h-4.5" />
            เพิ่มแบนเนอร์ใหม่
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

      {/* Form Card */}
      {showForm && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {editingBanner ? "แก้ไขข้อมูลแบนเนอร์" : "เพิ่มแบนเนอร์สไลด์ใหม่"}
          </h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="title">
                    หัวข้อแบนเนอร์ (ใช้ระบุชื่อรูปภาพ)
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น แบนเนอร์เปิดตัวเว็บใหม่"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="linkUrl">
                    ลิงก์ปลายทาง (เมื่อผู้ใช้งานคลิกแบนเนอร์ - ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="เช่น /news/1 หรือ https://example.com"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="order">
                      ลำดับการแสดงผล (น้อยไปมาก)
                    </label>
                    <input
                      type="number"
                      id="order"
                      required
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition font-mono"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-slate-800 cursor-pointer"
                      />
                      <label htmlFor="active" className="text-slate-300 text-sm cursor-pointer select-none">
                        แสดงแบนเนอร์นี้
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload image area with Preview */}
              <div className="space-y-3">
                <span className="block text-slate-300 text-xs font-medium">รูปภาพแบนเนอร์</span>
                {previewUrl ? (
                  <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[21/9] w-full rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center bg-slate-900/40 text-slate-500 text-sm">
                    <ImageIcon className="w-8 h-8 mb-2 text-slate-600" />
                    <span>ไม่พบรูปภาพตัวอย่าง</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer cursor-pointer"
                />
              </div>
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

      {/* Grid listing items */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.length === 0 ? (
            <div className="col-span-2 bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center text-slate-500">
              ไม่พบข้อมูลรูปภาพแบนเนอร์ประชาสัมพันธ์
            </div>
          ) : (
            banners.map((b) => (
              <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg group relative flex flex-col justify-between">
                {/* Thumbnail */}
                <div className="relative aspect-[21/9] w-full bg-slate-900 border-b border-slate-850 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-300" />
                  
                  {/* Active/Inactive badge absolute overlay */}
                  <div className="absolute top-3 left-3">
                    {b.active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                        <Eye className="w-3.5 h-3.5" /> แสดงใช้งาน
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-md">
                        <EyeOff className="w-3.5 h-3.5" /> ซ่อนไว้
                      </span>
                    )}
                  </div>

                  {/* Order badge */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-xs font-bold text-violet-400 backdrop-blur-md">
                    #{b.order}
                  </div>
                </div>

                {/* Banner details */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1 truncate">{b.title}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      ลิงก์ไปที่: <span className="font-mono text-slate-300">{b.linkUrl || "ไม่ได้กำหนดลิงก์"}</span>
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-900 pt-4 mt-auto">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs rounded-lg font-medium transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg font-medium transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบออก
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
