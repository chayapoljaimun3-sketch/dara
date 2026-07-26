import { getDashboardStats } from "@/app/actions/admin"
import { Users, Newspaper, FolderKanban, Image as ImageIcon, FileText } from "lucide-react"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const cardItems = [
    { 
      name: "ผู้ใช้งานทั้งหมด", 
      value: stats.usersCount, 
      desc: "บัญชีผู้ใช้งานระบบจัดการ", 
      icon: Users, 
      color: "from-blue-600/20 to-red-600/20 border-blue-500/30 text-blue-400" 
    },
    { 
      name: "ข่าวสารทั้งหมด", 
      value: stats.postsCount, 
      desc: "บทความข่าวสารที่เขียนทั้งหมด", 
      icon: Newspaper, 
      color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400" 
    },
    { 
      name: "หมวดหมู่ข่าวสาร", 
      value: stats.categoriesCount, 
      desc: "หมวดหมู่ข่าวเพื่อคัดแยกข้อมูล", 
      icon: FolderKanban, 
      color: "from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400" 
    },
    { 
      name: "หน้าเว็บเพจ", 
      value: stats.pagesCount, 
      desc: "หน้าเนื้อหาคงที่ของเว็บไซต์", 
      icon: FileText, 
      color: "from-rose-600/20 to-fuchsia-600/20 border-rose-500/30 text-rose-400" 
    },
    { 
      name: "แบนเนอร์สไลด์", 
      value: stats.bannersCount, 
      desc: "ภาพแบนเนอร์ประชาสัมพันธ์หน้าแรก", 
      icon: ImageIcon, 
      color: "from-pink-600/20 to-rose-600/20 border-pink-500/30 text-pink-400" 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">ภาพรวมระบบ</h1>
        <p className="text-slate-400 text-sm">ข้อมูลสรุปและสถานะของเนื้อหาทั้งหมดบนเว็บไซต์ของคุณ</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardItems.map((item, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${item.color} border p-6 rounded-2xl flex items-center justify-between shadow-lg transition-transform hover:-translate-y-1 duration-200`}
          >
            <div className="space-y-2">
              <span className="text-slate-300 text-sm font-medium">{item.name}</span>
              <p className="text-4xl font-extrabold text-white">{item.value}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl">
              <item.icon className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Database Connection Status / Information */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">สถานะการเชื่อมต่อฐานข้อมูล</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Database Engine</span>
              <span className="text-emerald-400 font-semibold">MySQL (XAMPP)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Host & Port</span>
              <span className="text-slate-200">localhost:3006</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Prisma Version</span>
              <span className="text-slate-200">v7.9.0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Authentication Framework</span>
              <span className="text-slate-200">Better Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
