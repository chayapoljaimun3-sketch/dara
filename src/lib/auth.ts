import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { username } from "better-auth/plugins";
import { ensureRolesExist } from "@/lib/db-init";

// Trigger seeding of roles in database
ensureRolesExist();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
  ],
  user: {
    additionalFields: {
      roleId: {
        type: "number",
        required: true,
        defaultValue: 2, // 2 represents writer, 1 represents admin
        input: true,
      },
    },
  },
});
