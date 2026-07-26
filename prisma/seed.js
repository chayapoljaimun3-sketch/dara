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

  console.log("Starting seed...")

  // 1. Get default Admin user
  const admin = await prisma.user.findFirst({
    where: { roleId: 1 },
  })

  if (!admin) {
    console.error("Error: Please register or run the app once first so the default admin user is seeded.")
    process.exit(1)
  }

  const authorId = admin.id
  console.log(`Using admin author ID: ${authorId}`)

  // 2. Ensure public/uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // 3. Create SVG mock images for Banners and Covers
  const createSvgImage = (filename, title, bgColor, textColor) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
      <rect width="1200" height="600" fill="${bgColor}"/>
      <circle cx="600" cy="300" r="200" fill="#ffffff" opacity="0.03"/>
      <text x="50%" y="45%" font-family="'IBM Plex Sans Thai', sans-serif" font-size="48" font-weight="bold" fill="${textColor}" dominant-baseline="middle" text-anchor="middle">
        ${title}
      </text>
      <text x="50%" y="55%" font-family="sans-serif" font-size="20" fill="${textColor}" opacity="0.6" dominant-baseline="middle" text-anchor="middle">
        DARA PORTAL SEED ASSET
      </text>
    </svg>`
    fs.writeFileSync(path.join(uploadDir, filename), svgContent)
    return `/uploads/${filename}`
  }

  const getBannerImage = (index, title, bgColor, textColor) => {
    const pngName = `seed-banner-${index + 1}.png`
    const pngPath = path.join(uploadDir, pngName)
    if (fs.existsSync(pngPath)) {
      return `/uploads/${pngName}`
    }
    return createSvgImage(`seed-banner-${index + 1}.svg`, title, bgColor, textColor)
  }

  const bannerImages = [
    getBannerImage(0, "ยินดีต้อนรับสู่ DARA Portal", "#1e1b4b", "#c084fc"),
    getBannerImage(1, "อัพเดทวงการเทคโนโลยีและนวัตกรรมใหม่", "#064e3b", "#34d399"),
    getBannerImage(2, "เกาะติดทุกสถานการณ์ข่าวด่วน 24 ชั่วโมง", "#7f1d1d", "#f87171"),
  ]

  const postImages = [
    createSvgImage("seed-cover-1.svg", "ข่าวนโยบายการเมืองใหม่", "#172554", "#60a5fa"),
    createSvgImage("seed-cover-2.svg", "เจาะลึกนวัตกรรม AI 2026", "#450a0a", "#f87171"),
    createSvgImage("seed-cover-3.svg", "สรุปผลฟุตบอลระดับโลก", "#064e3b", "#34d399"),
    createSvgImage("seed-cover-4.svg", "ตลาดหุ้นฟื้นตัวบวกแรง", "#3b0764", "#c084fc"),
    createSvgImage("seed-cover-5.svg", "คอนเสิร์ตใหญ่รอบปีสั่นสะเทือนวงการ", "#1c1917", "#e7e5e4"),
    createSvgImage("seed-cover-6.svg", "เปิดวิสัยทัศน์ผู้นำเศรษฐกิจคนใหม่", "#1e3a8a", "#93c5fd"),
    createSvgImage("seed-cover-7.svg", "สมาร์ทโฟนรุ่นเด่นเปิดตัวปีนี้", "#022c22", "#6ee7b7"),
    createSvgImage("seed-cover-8.svg", "การแข่งขันกีฬาระดับชาติเริ่มต้นแล้ว", "#78350f", "#fcd34d"),
    createSvgImage("seed-cover-9.svg", "เทศกาลท่องเที่ยววิถีไทยคึกคัก", "#831843", "#fbcfe8"),
    createSvgImage("seed-cover-10.svg", "วิเคราะห์ทิศทางค่าเงินบาทครึ่งปีหลัง", "#164e63", "#67e8f9"),
  ]

  // 4. Seed Banners (3 items)
  console.log("Seeding Banners...")
  await prisma.banner.deleteMany({}) // Clear old banners
  const bannersData = [
    { title: "ยินดีต้อนรับสู่ DARA Portal", imageUrl: bannerImages[0], linkUrl: "/news", active: true, order: 1 },
    { title: "อัพเดทวงการเทคโนโลยีและนวัตกรรมใหม่", imageUrl: bannerImages[1], linkUrl: "/category/tech", active: true, order: 2 },
    { title: "เกาะติดทุกสถานการณ์ข่าวด่วน 24 ชั่วโมง", imageUrl: bannerImages[2], linkUrl: "/news/urgent", active: true, order: 3 },
  ]
  for (const banner of bannersData) {
    await prisma.banner.create({ data: banner })
  }

  // 5. Seed Categories (5 items)
  console.log("Seeding Categories...")
  await prisma.category.deleteMany({}) // Clear old categories
  const categoriesData = [
    { name: "การเมือง" },
    { name: "เทคโนโลยี" },
    { name: "กีฬา" },
    { name: "เศรษฐกิจ" },
    { name: "บันเทิง" },
  ]
  const categories = []
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat })
    categories.push(created)
  }

  // 6. Seed Pages (10 items)
  console.log("Seeding Pages...")
  await prisma.page.deleteMany({}) // Clear old pages
  const pagesData = [
    { title: "เกี่ยวกับเรา", slug: "about-us", content: "<h3>เกี่ยวกับเรา</h3><p>DARA Portal เป็นสำนักข่าวออนไลน์ที่รวบรวมข่าวสารรอบตัวคุณตลอด 24 ชั่วโมง...</p>", published: true },
    { title: "ติดต่อเรา", slug: "contact-us", content: "<h3>ติดต่อเรา</h3><p>อีเมล: contact@dara.com<br>เบอร์โทรศัพท์: 02-123-4567</p>", published: true },
    { title: "นโยบายความเป็นส่วนตัว", slug: "privacy-policy", content: "<h3>นโยบายความเป็นส่วนตัว</h3><p>เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ...</p>", published: true },
    { title: "ข้อตกลงการใช้งาน", slug: "terms-of-service", content: "<h3>ข้อตกลงการใช้งาน</h3><p>การเข้าใช้งานเว็บไซต์ DARA Portal ถือเป็นการยอมรับข้อตกลงนี้...</p>", published: true },
    { title: "บริการของเรา", slug: "services", content: "<h3>บริการของเรา</h3><p>เราให้บริการลงโฆษณา ประชาสัมพันธ์ และเขียนบทความข่าว...</p>", published: true },
    { title: "คำถามที่พบบ่อย", slug: "faq", content: "<h3>คำถามที่พบบ่อย</h3><p>รวบรวมคำถามที่ผู้ใช้งานสอบถามเข้ามาบ่อยที่สุด...</p>", published: true },
    { title: "ประวัติความเป็นมา", slug: "history", content: "<h3>ประวัติความเป็นมา</h3><p>DARA Portal ก่อตั้งเมื่อปี 2026 โดยกลุ่มนักพัฒนาที่รักการเขียนข่าว...</p>", published: true },
    { title: "ทีมงานของเรา", slug: "team", content: "<h3>ทีมงานของเรา</h3><p>แนะนำผู้บริหาร บรรณาธิการ และนักเขียนมืออาชีพของเรา...</p>", published: true },
    { title: "ร่วมงานกับเรา", slug: "careers", content: "<h3>ร่วมงานกับเรา</h3><p>เรากำลังเปิดรับสมัครผู้เขียนข่าว บรรณาธิการ และทีมงานไอที...</p>", published: true },
    { title: "พันธมิตรทางธุรกิจ", slug: "partners", content: "<h3>พันธมิตรทางธุรกิจ</h3><p>รายชื่อพันธมิตรทางธุรกิจที่เป็นผู้สนับสนุนหลักของเรา...</p>", published: true },
  ]
  for (const page of pagesData) {
    await prisma.page.create({ data: page })
  }

  // 7. Seed Posts (10 items)
  console.log("Seeding Posts...")
  await prisma.post.deleteMany({}) // Clear old posts
  
  const postsData = [
    {
      title: "ประกาศนโยบายปฏิรูปการศึกษาใหม่ เริ่มต้นปีการศึกษาหน้า",
      content: "<h3>รายละเอียดนโยบาย</h3><p>กระทรวงศึกษาธิการประกาศแผนปฏิรูปการศึกษาแบบก้าวกระโดด เน้นการใช้เทคโนโลยีและฝึกทักษะการคิดวิเคราะห์มากกว่าการท่องจำ...</p>",
      published: true,
      coverUrl: postImages[0],
      categoryIndexes: [0], // การเมือง
    },
    {
      title: "เปิดตัวโมเดล AI ล่าสุด รองรับภาษาไทยสมบูรณ์แบบ 100%",
      content: "<h3>ความสามารถใหม่ของ AI</h3><p>ทีมนักวิจัยไทยเปิดตัวปัญญาประดิษฐ์โมเดลภาษาขนาดใหญ่ที่ถูกเทรนด้วยภาษาไทยโดยเฉพาะ เข้าใจบริบทและวัฒนธรรมไทยอย่างลึกซึ้ง...</p>",
      published: true,
      coverUrl: postImages[1],
      categoryIndexes: [1], // เทคโนโลยี
    },
    {
      title: "สรุปผลศึกดาร์บี้แมตช์สุดมันส์ ชัยชนะตกเป็นของทีมเจ้าบ้าน 3-2",
      content: "<h3>สรุปผลการแข่งขัน</h3><p>เป็นเกมระดับ 5 ดาวอย่างแท้จริงเมื่อเจ้าบ้านพลิกนรกยิงสองประตูรวดในช่วงท้ายเกม คว้าสามแต้มสำคัญไปครองต่อหน้าแฟนบอล...</p>",
      published: true,
      coverUrl: postImages[2],
      categoryIndexes: [2], // กีฬา
    },
    {
      title: "ดัชนีตลาดหุ้นพุ่งกระฉูด ขานรับมาตรการกระตุ้นเศรษฐกิจระยะยาว",
      content: "<h3>การเคลื่อนไหวของตลาด</h3><p>นักวิเคราะห์ชี้ ตลาดตอบรับเชิงบวกอย่างมากหลังจากรัฐบาลประกาศลดภาษีและให้เงินสนับสนุนอุตสาหกรรมเป้าหมายส่งออก...</p>",
      published: true,
      coverUrl: postImages[3],
      categoryIndexes: [3], // เศรษฐกิจ
    },
    {
      title: "ศิลปินชื่อดังเปิดคอนเสิร์ตใหญ่ แฟนเพลงล้นฮอลล์ฉลองครบรอบ 10 ปี",
      content: "<h3>บรรยากาศในงานคอนเสิร์ต</h3><p>แสง สี เสียง จัดเต็มตลอด 3 ชั่วโมง ขนเพลงฮิตตั้งแต่อัลบั้มแรกมาสร้างความสุขและความประทับใจให้กับแฟนๆ อย่างอบอุ่น...</p>",
      published: true,
      coverUrl: postImages[4],
      categoryIndexes: [4], // บันเทิง
    },
    {
      title: "วิเคราะห์การประชุมสภาความมั่นคง ร่วมมือจัดการภัยพิบัติระดับภูมิภาค",
      content: "<h3>สาระสำคัญของการประชุม</h3><p>ผู้นำแต่ละประเทศบรรลุข้อตกลงในการแชร์ข้อมูลสภาพภูมิอากาศและช่วยเหลืออพยพประชาชนร่วมกันเมื่อเกิดเหตุฉุกเฉินภัยธรรมชาติ...</p>",
      published: true,
      coverUrl: postImages[5],
      categoryIndexes: [0, 3], // การเมือง, เศรษฐกิจ
    },
    {
      title: "เปิดตัวสมาร์ทโฟนจอพับรุ่นใหม่ บางเฉียบกว่าเดิมและแบตเตอรี่อึดขึ้น",
      content: "<h3>จุดเด่นของตัวเครื่อง</h3><p>มาพร้อมกล้องระดับเรือธง 108MP และบานพับแบบใหม่ที่ทนทานกว่า 5 แสนครั้ง วางจำหน่ายอย่างเป็นทางการสิ้นเดือนนี้...</p>",
      published: true,
      coverUrl: postImages[6],
      categoryIndexes: [1], // เทคโนโลยี
    },
    {
      title: "สมาคมกรีฑาประกาศรายชื่อนักวิ่งลุยศึกโอลิมปิกฤดูร้อน",
      content: "<h3>ความพร้อมของนักกีฬา</h3><p>คัดเลือกตัวเต็งที่ผ่านการเก็บตัวฟิตซ้อมในต่างประเทศ มั่นใจทำผลงานทำลายสถิติประเทศไทยและคว้าเหรียญมาฝากแฟนๆ...</p>",
      published: true,
      coverUrl: postImages[7],
      categoryIndexes: [2], // กีฬา
    },
    {
      title: "แห่เที่ยวงานเทศกาลอาหารไทย รวบรวมสตรีทฟู้ดกว่า 200 ร้านค้า",
      content: "<h3>บรรยากาศภายในงาน</h3><p>งานเริ่มขึ้นอย่างคึกคักที่ลานหน้าห้างสรรพสินค้าดัง นักท่องเที่ยวชาวต่างชาติและชาวไทยร่วมชิมเมนูระดับมิชลินไกด์...</p>",
      published: true,
      coverUrl: postImages[8],
      categoryIndexes: [3, 4], // เศรษฐกิจ, บันเทิง
    },
    {
      title: "วิเคราะห์ทิศทางเงินบาทแข็งค่าขึ้น ส่งผลกระทบต่อภาคส่งออกอย่างไร?",
      content: "<h3>บทวิเคราะห์เศรษฐกิจ</h3><p>ผู้เชี่ยวชาญชี้แจงค่าเงินบาทที่แข็งค่าสุดในรอบปี อาจส่งผลเสียต่อการท่องเที่ยวและการส่งออกพืชผลทางการเกษตรระยะสั้น...</p>",
      published: true,
      coverUrl: postImages[9],
      categoryIndexes: [3], // เศรษฐกิจ
    },
  ]

  for (const post of postsData) {
    const { categoryIndexes, ...rest } = post
    const connectCategories = categoryIndexes.map((idx) => ({
      id: categories[idx].id,
    }))

    await prisma.post.create({
      data: {
        ...rest,
        authorId,
        categories: {
          connect: connectCategories,
        },
      },
    })
  }

  console.log("Seed completed successfully!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seed execution failed:", err)
  process.exit(1)
})
