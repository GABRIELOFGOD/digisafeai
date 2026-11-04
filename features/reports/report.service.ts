import "server-only";
import { randomBytes } from "node:crypto";
import { connectToDatabase } from "@/lib/db/mongoose";
import { encryptContactValue } from "@/lib/security/contact-encryption";
import { ReportModel } from "@/features/reports/report.model";
import type { ReportInput } from "@/features/reports/report.schema";

function createReferenceCode() {
  return randomBytes(9).toString("hex").toUpperCase();
}

export async function createReport(input: ReportInput) {
  const referenceCode = createReferenceCode();
  let encryptedSafeContact: string | undefined;
  let safeContactStored: boolean | undefined;

  if (input.safeContact) {
    try {
      encryptedSafeContact = encryptContactValue(input.safeContact.value);
      safeContactStored = true;
    } catch (error) {
      safeContactStored = false;
      console.error(
        "Report safe contact could not be encrypted; saving the report without it.",
        error instanceof Error ? error.message : "UnknownError",
      );
    }
  }

  await connectToDatabase();
  await ReportModel.create({
    referenceCode,
    reportAbout: input.reportAbout,
    category: input.category,
    description: input.description,
    approximateDate: input.approximateDate || undefined,
    generalLocation: input.generalLocation || undefined,
    onlinePlatform: input.onlinePlatform || undefined,
    ...(input.safeContact && encryptedSafeContact
      ? {
          safeContactMethod: input.safeContact.method,
          encryptedSafeContact,
        }
      : {}),
    immediateDanger: input.immediateDanger,
  });

  return { referenceCode, safeContactStored };
}
