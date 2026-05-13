import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@loanplatform.com" },
    update: {},
    create: {
      email: "admin@loanplatform.com",
      password,
      name: "Super Admin",
      role: "superadmin",
    },
  });

  console.log("Seed complete: admin created (admin@loanplatform.com / admin123)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
