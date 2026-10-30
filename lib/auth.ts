import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { admin } from "better-auth/plugins";
import { getAuthEnv } from "@/lib/env";

function createAuth() {
  const { MONGODB_URI, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = getAuthEnv();
  const client = new MongoClient(MONGODB_URI);
  const database = client.db();

  globalThis.digiSafeAuthClient = client;

  return betterAuth({
    appName: "DigiSafe AI",
    baseURL: BETTER_AUTH_URL,
    secret: BETTER_AUTH_SECRET,
    database: mongodbAdapter(database, { client }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    plugins: [
      admin({
        defaultRole: "safeguarding_officer",
        adminRoles: ["admin"],
      }),
    ],
    trustedOrigins: [BETTER_AUTH_URL],
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

declare global {
  var digiSafeAuth: AuthInstance | undefined;
  var digiSafeAuthClient: MongoClient | undefined;
}

export function getAuth() {
  return (globalThis.digiSafeAuth ??= createAuth());
}
