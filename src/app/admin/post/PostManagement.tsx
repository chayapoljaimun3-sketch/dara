"use client"

import { useState } from "react"
import { createPostAction, updatePostAction, deletePost } from "@/app/actions/admin"
import TiptapEditor from "@/components/TiptapEditor"
import { Newspaper, Plus, Trash2, Edit3, Eye, EyeOff, Calendar, User, Folder } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface PostItem {
  id: number
  title: string
  content: string | null
  coverUrl: string | null
  published: boolean
  createdAt: Date
  author: {
    name: string
  }
  categories: Category[]
}

interface PostManagementProps {
  initialPosts: PostItem[]
  categories: Category[]
  userId: string
}

export default function PostManagement({ initialPosts, categories, userId }: PostManagementProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<PostItem | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleOpenCreate = () => {
    setEditingPost(null)
    setTitle("")
    setContent("")
    setPublished(false)
    setSelectedCategories([])
    setSelectedFile(null)
    setPreviewUrl("")
    setError("")
    setShowForm(true)
  }

  const handleOpenEdit = (post: PostItem) => {
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.content || "")
    setPublished(post.published)
    setSelectedCategories(post.categories.map((c) => c.id))
    setSelectedFile(null)
    setPreviewUrl(post.coverUrl || "")
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

  const handleCategoryToggle = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((catId) => catId !== id))
    } else {
      setSelectedCategories([...selectedCategories, id])
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (!editingPost && !selectedFile) {
      setError("กรุณาเลือกรูปภาพหน้าปกข่าว")
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("content", content)
    formData.append("published", published ? "true" : "false")
    formData.append("authorId", userId)
    formData.append("categoryIds", JSON.stringify(selectedCategories))
    if (selectedFile) {
      formData.append("cover", selectedFile)
    }

    let res
    if (editingPost) {
      formData.append("id", editingPost.id.toString())
      res = await updatePostAction(formData)
    } else {
      res = await createPostAction(formData)
    }

    if (res.success) {
      setMessage(editingPost ? "แก้ไขโพสต์ข่าวสำเร็จ!" : "สร้างข่าวสารใหม่สำเร็จ!")
      setShowForm(false)
      
      // Reload posts
      window.location.reload()
    } else {
      setError(res.error || "เกิดข้อผิดพลาด")
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบข่าวสารนี้ใช่หรือไม่?")) return
    setError("")
    setMessage("")
    await deletePost(id)
    setMessage("ลบข่าวสารเรียบร้อยแล้ว!")
    
    // Reload posts
    window.location.reload()
  }

  return (
    <div className="space-y-8 font-ibm">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">จัดการข่าวสาร</h1>
          <p className="text-slate-400 text-sm">สร้างข่าวสารใหม่ อัพเดตเนื้อหาข่าวด่วน และเลือกหมวดหมู่ที่เหมาะสม</p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-rose-600/10"
          >
            <Plus className="w-4.5 h-4.5" />
            เขียนข่าวสารใหม่
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

      {/* Form overlay screen */}
      {showForm && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-lg font-semibold text-white">
            {editingPost ? "แก้ไขข้อมูลข่าวสาร" : "เขียนและเผยแพร่ข่าวสารใหม่"}
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Input fields */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="title">
                    หัวข้อข่าว / หัวเรื่องหลัก
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="กรอกพาดหัวข่าวที่ดึงดูดความสนใจ"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  />
                </div>

                {/* Editor container */}
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">
                    เนื้อหาข่าวสาร (ใช้ TipTap Rich Text)
                  </label>
                  <TiptapEditor value={content} onChange={setContent} />
                </div>
              </div>

              {/* Sidebar metadata (Categories + Cover) */}
              <div className="space-y-5">
                {/* Image Cover upload */}
                <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl space-y-3">
                  <span className="block text-slate-300 text-xs font-medium">รูปภาพหน้าปกข่าว</span>
                  {previewUrl ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-lg border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                      <Newspaper className="w-6 h-6 mb-1.5 text-slate-600" />
                      <span>ยังไม่มีรูปหน้าปก</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-700 file:cursor-pointer cursor-pointer"
                  />
                </div>

                {/* Categories checkbox */}
                <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl space-y-3">
                  <span className="block text-slate-300 text-xs font-medium">หมวดหมู่ข่าวสาร</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {categories.length === 0 ? (
                      <p className="text-slate-500 text-xs">ยังไม่มีหมวดหมู่ข่าวในระบบ</p>
                    ) : (
                      categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-800 cursor-pointer"
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Published check */}
                <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-800 cursor-pointer"
                  />
                  <label htmlFor="published" className="text-slate-300 text-sm cursor-pointer select-none">
                    เผยแพร่ข่าวนี้ทันที (Published)
                  </label>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center gap-3 border-t border-slate-900 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "กำลังบันทึก..." : "บันทึกและปิด"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Posts List */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-full bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center text-slate-500">
              ไม่พบข้อมูลโพสต์ข่าวสารในระบบ
            </div>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group">
                
                {/* Image Cover */}
                <div className="relative aspect-video w-full bg-slate-900 border-b border-slate-850 overflow-hidden">
                  {p.coverUrl ? (
                    // eslint-disable-next-line @img
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/60">
                      <Newspaper className="w-10 h-10 mb-2" />
                      <span className="text-xs">ไม่มีรูปภาพหน้าปก</span>
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    {p.published ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                        <Eye className="w-3.5 h-3.5" /> แสดงอยู่
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-md">
                        <EyeOff className="w-3.5 h-3.5" /> ซ่อนไว้
                      </span>
                    )}
                  </div>
                </div>

                {/* Post details body */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                  <div className="space-y-2">
                    {/* Categories list */}
                    <div className="flex flex-wrap gap-1">
                      {p.categories.map((c) => (
                        <span key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400">
                          <Folder className="w-3 h-3" /> {c.name}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-semibold text-white text-base leading-snug line-clamp-2">{p.title}</h3>
                  </div>

                  {/* Author / Date info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-3">
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {p.author.name}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(p.createdAt).toLocaleDateString("th-TH")}
                    </span>
                  </div>

                  {/* Actions list */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-900 pt-3">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg font-medium transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> แก้ไขข่าว
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg font-medium transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบ
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
