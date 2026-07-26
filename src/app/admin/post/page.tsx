import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getPosts, getCategories } from "@/app/actions/admin"
import PostManagement from "./PostManagement"

export default async function PostPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth/login")
  }

  const posts = await getPosts()
  const categories = await getCategories()

  return (
    <PostManagement 
      initialPosts={posts as any} 
      categories={categories} 
      userId={session.user.id} 
    />
  )
}
