import { prisma } from "@/lib/prisma"
import HomeClient from "./HomeClient"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Fetch banners
  const banners = await prisma.banner.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })

  // Fetch categories
  const categories = await prisma.category.findMany()

  // Fetch posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { id: true, name: true },
      },
      categories: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Fetch pages
  const pages = await prisma.page.findMany({
    where: { published: true },
  })

  return (
    <HomeClient
      banners={banners}
      categories={categories}
      posts={posts}
      pages={pages}
      isAdmin={!!session}
    />
  )
}
