const { PrismaClient } = require("@prisma/client")
const { PrismaMariaDb } = require("@prisma/adapter-mariadb")
const fs = require("fs")
const path = require("path")

async function main() {
  // Load .env variables manually
  const envPath = path.join(process.cwd(), ".env")
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8")
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const parts = trimmed.split("=")
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "")
          process.env[key] = value
        }
      }
    })
  }

  const connectionString = process.env.DATABASE_URL || "mysql://root:@localhost:3306/dara_db"
  const adapter = new PrismaMariaDb(connectionString)
  const prisma = new PrismaClient({ adapter })

  console.log("Updating banners in database...")

  const banners = await prisma.banner.findMany()
  for (let i = 0; i < banners.length; i++) {
    const banner = banners[i]
    if (i < 3) {
      let newUrl = `/uploads/seed-banner-${i + 1}.png`
      await prisma.banner.update({
        where: { id: banner.id },
        data: { imageUrl: newUrl }
      })
      console.log(`Updated banner ${banner.id} image to ${newUrl}`)
    }
  }

  console.log("Update completed!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Update failed:", err)
  process.exit(1)
})
