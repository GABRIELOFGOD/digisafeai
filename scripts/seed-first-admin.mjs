import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, ObjectId } from "mongodb";
import { betterAuth } from "better-auth";

const required = [
  "MONGODB_URI",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "FIRST_ADMIN_NAME",
  "FIRST_ADMIN_EMAIL",
  "FIRST_ADMIN_PASSWORD",
];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

if (process.env.FIRST_ADMIN_PASSWORD.length < 12) {
  throw new Error("FIRST_ADMIN_PASSWORD must contain at least 12 characters.");
}

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  const database = client.db();
  const users = database.collection("user");
  const existingAdmins = await users.countDocuments({ role: "admin" });

  if (existingAdmins > 0) {
    throw new Error(
      "An administrator already exists. Use the staff dashboard to add more administrators.",
    );
  }

  const auth = betterAuth({
    appName: "DigiSafe AI",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(database, { client }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    plugins: [
      admin({
        defaultRole: "safeguarding_officer",
        adminRoles: ["admin"],
      }),
    ],
    trustedOrigins: [process.env.BETTER_AUTH_URL],
  });
  const result = await auth.api.signUpEmail({
    body: {
      name: process.env.FIRST_ADMIN_NAME,
      email: process.env.FIRST_ADMIN_EMAIL,
      password: process.env.FIRST_ADMIN_PASSWORD,
    },
    headers: new Headers({ origin: process.env.BETTER_AUTH_URL }),
  });

  const promoteResult = await users.updateOne(
    { _id: new ObjectId(result.user.id), role: "safeguarding_officer" },
    { $set: { role: "admin" } },
  );

  if (promoteResult.modifiedCount !== 1) {
    throw new Error("The new account could not be promoted to administrator.");
  }

  console.log(`Created the first administrator account: ${result.user.email}`);
} finally {
  await client.close();
}
