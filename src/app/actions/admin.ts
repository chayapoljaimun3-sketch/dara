"use server"

import { prisma } from "@/lib/prisma"
import { uploadFile } from "@/lib/upload"
import { revalidatePath } from "next/cache"

// ----------------------------------------------------
// DASHBOARD STATS
// ----------------------------------------------------
export async function getDashboardStats() {
  const [usersCount, postsCount, categoriesCount, bannersCount, pagesCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.category.count(),
    prisma.banner.count(),
    prisma.page.count(),
  ])

  return {
    usersCount,
    postsCount,
    categoriesCount,
    bannersCount,
    pagesCount,
  }
}

// ----------------------------------------------------
// USERS CRUD & ROLES
// ----------------------------------------------------
export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function updateUserRole(userId: string, roleId: number) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { roleId },
  })
  revalidatePath("/admin/users")
  return user
}

// ----------------------------------------------------
// CATEGORIES CRUD
// ----------------------------------------------------
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function createCategory(name: string) {
  try {
    const category = await prisma.category.create({
      data: { name },
    })
    revalidatePath("/admin/category")
    return { success: true, category }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "หมวดหมู่นี้มีอยู่แล้วในระบบ" }
    }
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างหมวดหมู่" }
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    })
    revalidatePath("/admin/category")
    return { success: true, category }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "หมวดหมู่นี้มีอยู่แล้วในระบบ" }
    }
    return { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่" }
  }
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({
    where: { id },
  })
  revalidatePath("/admin/category")
  return { success: true }
}

// ----------------------------------------------------
// PAGES CRUD (About us, Contact, etc)
// ----------------------------------------------------
export async function getPages() {
  return await prisma.page.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function createPage(title: string, slug: string, content: string, published: boolean) {
  try {
    const page = await prisma.page.create({
      data: { title, slug, content, published },
    })
    revalidatePath("/admin/page")
    return { success: true, page }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Slug นี้มีอยู่แล้วในระบบ" }
    }
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างหน้าเพจ" }
  }
}

export async function updatePage(id: number, title: string, slug: string, content: string, published: boolean) {
  try {
    const page = await prisma.page.update({
      where: { id },
      data: { title, slug, content, published },
    })
    revalidatePath("/admin/page")
    return { success: true, page }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Slug นี้มีอยู่แล้วในระบบ" }
    }
    return { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขหน้าเพจ" }
  }
}

export async function deletePage(id: number) {
  await prisma.page.delete({
    where: { id },
  })
  revalidatePath("/admin/page")
  return { success: true }
}

// ----------------------------------------------------
// BANNERS CRUD (Sliders)
// ----------------------------------------------------
export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: {
      order: "asc",
    },
  })
}

export async function createBannerAction(formData: FormData) {
  const title = formData.get("title") as string
  const linkUrl = formData.get("linkUrl") as string
  const active = formData.get("active") === "true"
  const order = parseInt(formData.get("order") as string || "0")
  const file = formData.get("image") as File

  if (!file || file.size === 0) {
    return { success: false, error: "กรุณาอัพโหลดรูปภาพแบนเนอร์" }
  }

  try {
    const imageUrl = await uploadFile(file)
    const banner = await prisma.banner.create({
      data: {
        title,
        linkUrl: linkUrl || null,
        active,
        order,
        imageUrl,
      },
    })
    revalidatePath("/admin/banner")
    return { success: true, banner }
  } catch (error) {
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างแบนเนอร์" }
  }
}

export async function updateBannerAction(formData: FormData) {
  const id = parseInt(formData.get("id") as string)
  const title = formData.get("title") as string
  const linkUrl = formData.get("linkUrl") as string
  const active = formData.get("active") === "true"
  const order = parseInt(formData.get("order") as string || "0")
  const file = formData.get("image") as File

  try {
    let imageUrl: string | undefined
    if (file && file.size > 0) {
      imageUrl = await uploadFile(file)
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title,
        linkUrl: linkUrl || null,
        active,
        order,
        ...(imageUrl ? { imageUrl } : {}),
      },
    })
    revalidatePath("/admin/banner")
    return { success: true, banner }
  } catch (error) {
    return { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขแบนเนอร์" }
  }
}

export async function deleteBanner(id: number) {
  await prisma.banner.delete({
    where: { id },
  })
  revalidatePath("/admin/banner")
  return { success: true }
}

// ----------------------------------------------------
// POSTS CRUD (News & Cover Upload)
// ----------------------------------------------------
export async function getPosts() {
  return await prisma.post.findMany({
    include: {
      author: true,
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const published = formData.get("published") === "true"
  const authorId = formData.get("authorId") as string
  const categoryIds = JSON.parse(formData.get("categoryIds") as string || "[]") as number[]
  const file = formData.get("cover") as File

  let coverUrl: string | null = null
  if (file && file.size > 0) {
    try {
      coverUrl = await uploadFile(file)
    } catch (e) {
      console.error("Cover image upload failed:", e)
    }
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverUrl,
        published,
        authorId,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    })
    revalidatePath("/admin/post")
    return { success: true, post }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างโพสต์ข่าว" }
  }
}

export async function updatePostAction(formData: FormData) {
  const id = parseInt(formData.get("id") as string)
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const published = formData.get("published") === "true"
  const categoryIds = JSON.parse(formData.get("categoryIds") as string || "[]") as number[]
  const file = formData.get("cover") as File

  try {
    let coverUrl: string | undefined
    if (file && file.size > 0) {
      coverUrl = await uploadFile(file)
    }

    // Clear current categories relation
    await prisma.post.update({
      where: { id },
      data: {
        categories: {
          set: [],
        },
      },
    })

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        published,
        ...(coverUrl ? { coverUrl } : {}),
        categories: {
          connect: categoryIds.map((cid) => ({ id: cid })),
        },
      },
    })
    revalidatePath("/admin/post")
    return { success: true, post }
  } catch (error) {
    console.error("Failed to update post:", error)
    return { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขโพสต์ข่าว" }
  }
}

export async function deletePost(id: number) {
  await prisma.post.delete({
    where: { id },
  })
  revalidatePath("/admin/post")
  return { success: true }
}
