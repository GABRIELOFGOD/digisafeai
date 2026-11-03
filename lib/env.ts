import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI must not be empty."),
});

const authEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI must not be empty."),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
});

const openAIEnvSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1),
  OPENAI_MODEL: z.string().trim().min(1).default("gpt-4o-mini"),
});

export function getServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const missingVariables = result.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");

    throw new Error(`Missing or invalid server environment variables: ${missingVariables}`);
  }

  return result.data;
}

export function getAuthEnv() {
  const result = authEnvSchema.safeParse(process.env);

  if (!result.success) {
    const missingVariables = result.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");

    throw new Error(`Missing or invalid authentication environment variables: ${missingVariables}`);
  }

  return result.data;
}

export function getOpenAIEnv() {
  const result = openAIEnvSchema.safeParse(process.env);

  if (!result.success) {
    const missingVariables = result.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");

    throw new Error(
      `Missing or invalid OpenAI environment variables: ${missingVariables}`,
    );
  }

  return result.data;
}
