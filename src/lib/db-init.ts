import { prisma } from "@/lib/prisma"

export async function ensureRolesExist() {
  try {
    // 1. Seed default roles
    await prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: "admin" },
    })
    await prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: "writer" },
    })

    // 2. Seed default admin user dynamically to prevent circular dependencies
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: "admin@dara.com" },
          { username: "admin" }
        ]
      }
    })

    if (!adminUser) {
      console.log("Seeding default admin user...")
      const { auth } = await import("@/lib/auth")
      
      await auth.api.signUpEmail({
        body: {
          email: "admin@dara.com",
          username: "admin",
          name: "Administrator",
          password: "admin1234", // Default admin password
          roleId: 1 // Admin role id
        }
      })
      console.log("Default admin user seeded successfully.")
    }
  } catch (error) {
    console.error("Failed to seed roles or default admin:", error)
  }
}
