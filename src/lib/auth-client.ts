import { createAuthClient } from "better-auth/react";
import { usernameClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // Defaults to window.location.origin
  plugins: [
    usernameClient(),
    inferAdditionalFields<typeof auth>()
  ]
});
