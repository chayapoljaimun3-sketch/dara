import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Newspaper, 
  FileText, 
  Image as ImageIcon,
  LogOut,
  User as UserIcon
} from "lucide-react"

// Server Actions or direct components can handle logout, 
// but we will provide a clean client side button or link.

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth/login")
  }

  // Get user details with role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true }
  })

  if (!user) {
    redirect("/auth/login")
  }

  const userRole = user.role.name // 'admin' or 'writer'

  const menuItems = [
    { name: "แดชบอร์ด", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["admin", "writer"] },
    { name: "จัดการผู้ใช้", href: "/admin/users", icon: Users, roles: ["admin"] },
    { name: "หมวดหมู่ข่าว", href: "/admin/category", icon: FolderKanban, roles: ["admin", "writer"] },
    { name: "จัดการข่าวสาร", href: "/admin/post", icon: Newspaper, roles: ["admin", "writer"] },
    { name: "หน้าเว็บเพจ", href: "/admin/page", icon: FileText, roles: ["admin", "writer"] },
    { name: "แบนเนอร์สไลด์", href: "/admin/banner", icon: ImageIcon, roles: ["admin", "writer"] },
  ]

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-ibm">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Portal Title */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <span className="text-xl font-bold tracking-wider text-violet-400">DARA ADMIN</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              if (!item.roles.includes(userRole)) return null
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium text-sm group"
                >
                  <item.icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-violet-400 transition-colors" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout Info */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              <UserIcon className="w-5 h-5 text-violet-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">
                @{user.username || "user"} • <span className="text-violet-400 font-medium uppercase">{userRole}</span>
              </p>
            </div>
          </div>

          <Link
            href="/auth/logout"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium text-sm w-full"
          >
            <LogOut className="w-4.5 h-4.5" />
            ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/40 sticky top-0 z-20 backdrop-blur-md">
          <div className="text-sm text-slate-400">
            ระบบแผงควบคุมหลัก &bull; <span className="text-white">{userRole === "admin" ? "ผู้ดูแลระบบ" : "ผู้เขียนข่าว"}</span>
          </div>
          <div className="text-xs text-slate-500">
            เวลาท้องถิ่น: {new Date().toLocaleDateString("th-TH")}
          </div>
        </header>

        <main className="p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
