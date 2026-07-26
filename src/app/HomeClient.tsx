"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Eye, X, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

type Category = {
  id: number
  name: string
}

type UserType = {
  id: string
  name: string
}

type Post = {
  id: number
  title: string
  content: string | null
  coverUrl: string | null
  createdAt: Date
  author: UserType
  categories: Category[]
}

type Banner = {
  id: number
  title: string
  imageUrl: string
  linkUrl: string | null
}

type Page = {
  id: number
  title: string
  slug: string
  content: string | null
}

type HomeClientProps = {
  banners: Banner[]
  categories: Category[]
  posts: Post[]
  pages: Page[]
  isAdmin: boolean
}

export default function HomeClient({ banners, categories, posts, pages, isAdmin }: HomeClientProps) {
  const [activeBanner, setActiveBanner] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)

  // Banner autoplay
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory
      ? post.categories.some((c) => c.id === selectedCategory)
      : true
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  const nextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white pb-16">
      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <span className="font-extrabold text-white text-lg tracking-wider">D</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-rose-400">
              DARA PORTAL
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <a
                href="/admin/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-lg hover:shadow-rose-600/20 transition cursor-pointer"
              >
                เข้าสู่แผงควบคุม
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <a
                href="/auth/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
              >
                ผู้เขียนข่าว / แอดมิน
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Banner Slider */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-900 bg-slate-900 group">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center transform scale-100 group-hover:scale-105 transition duration-1000"
                />
                
                {/* Banner Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 max-w-3xl">
                  <span className="inline-block px-2.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">
                    ข่าวเด่นวันนี้
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
                    {banner.title}
                  </h2>
                  {banner.linkUrl && (
                    <a
                      href={banner.linkUrl}
                      className="inline-flex items-center gap-1 text-sm font-medium text-rose-400 hover:text-rose-300 transition mt-2"
                    >
                      อ่านรายละเอียดเพิ่มเติม
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white border border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white border border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slider Dots */}
                <div className="absolute bottom-4 right-6 z-20 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveBanner(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeBanner ? "w-6 bg-rose-500" : "w-2 bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* 3. Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* News Content Grid (Left 3 Columns) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-900 pb-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-500" />
              บทความและข่าวสารล่าสุด
            </h3>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาหัวข้อ หรือ เนื้อหาข่าว..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          {/* Categories Pill List */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedCategory === null
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-850"
              }`}
            >
              ทั้งหมด
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-500/10"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-850"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* News Cards Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-900">
              <p className="text-slate-400 text-sm">ไม่พบข่าวสารที่คุณต้องการค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group relative flex flex-col bg-slate-900/40 hover:bg-slate-900 border border-slate-900/60 hover:border-slate-850 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video bg-slate-800 overflow-hidden">
                    {post.coverUrl ? (
                      <Image
                        src={post.coverUrl}
                        alt={post.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-700">
                        ไม่มีรูปภาพหน้าปก
                      </div>
                    )}
                    {/* Category Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                      {post.categories.map((c) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 text-[10px] font-semibold bg-slate-950/80 backdrop-blur-sm text-rose-400 border border-rose-500/20 rounded"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-rose-400 transition leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      {/* Short Description */}
                      <p className="text-sm text-slate-400 line-clamp-2"
                         dangerouslySetInnerHTML={{
                           __html: (post.content || "").replace(/<[^>]*>/g, "").slice(0, 120) + "..."
                         }}
                      />
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-900/80 pt-3">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[100px]">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.createdAt).toLocaleDateString("th-TH")}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info (Right 1 Column) */}
        <aside className="space-y-6">
          {/* Static Pages Widget */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
            <h4 className="text-base font-bold text-white border-b border-slate-900 pb-3 mb-4">
              ข้อมูลเว็บไซต์
            </h4>
            <nav className="flex flex-col gap-2.5">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPage(p)}
                  className="flex items-center justify-between text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-950/20 hover:bg-slate-950/60 border border-transparent hover:border-slate-850 transition cursor-pointer text-left"
                >
                  <span>{p.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                </button>
              ))}
            </nav>
          </div>

          {/* Connect Panel Widget */}
          <div className="bg-gradient-to-tr from-red-950/30 to-rose-950/30 border border-rose-950/40 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/10 rounded-full blur-2xl" />
            <h4 className="text-base font-bold text-white mb-2">
              ร่วมเขียนข่าวสารกับเรา?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              หากคุณมีข่าวสารที่อยากแบ่งปัน สามารถสมัครสมาชิกเพื่อเป็น Writer และสร้างสรรค์ข่าวสารในแพลตฟอร์มของเราได้ทันที
            </p>
            <a
              href="/auth/register"
              className="inline-block text-center w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-lg py-2 text-xs font-semibold shadow-md transition cursor-pointer"
            >
              สมัครเขียนข่าว
            </a>
          </div>
        </aside>
      </main>

      {/* 4. Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-16 pt-8 text-center text-xs text-slate-500">
        <p>© 2026 DARA Portal. All rights reserved.</p>
      </footer>

      {/* 5. Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full">
                  ข่าวและบทความ
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">•</span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  ผู้แต่ง: {selectedPost.author.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="h-8 w-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1">
              {/* Cover Image */}
              {selectedPost.coverUrl && (
                <div className="relative h-[240px] md:h-[380px] rounded-xl overflow-hidden bg-slate-950">
                  <Image
                    src={selectedPost.coverUrl}
                    alt={selectedPost.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-b border-slate-800/60 pb-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    เขียนโดย: {selectedPost.author.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    วันที่เผยแพร่: {new Date(selectedPost.createdAt).toLocaleDateString("th-TH")}
                  </span>
                </div>
              </div>

              {/* Rich-Text content */}
              <div
                className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-a:text-rose-400 prose-blockquote:border-l-4 prose-blockquote:border-rose-500 prose-blockquote:pl-4 prose-blockquote:italic text-slate-300"
                dangerouslySetInnerHTML={{ __html: selectedPost.content || "" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Page Details Modal */}
      {selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h4 className="text-lg font-bold text-white">
                {selectedPage.title}
              </h4>
              <button
                onClick={() => setSelectedPage(null)}
                className="h-8 w-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1">
              {/* Content */}
              <div
                className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white text-slate-300"
                dangerouslySetInnerHTML={{ __html: selectedPage.content || "" }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
