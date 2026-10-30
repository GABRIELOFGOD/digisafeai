import "server-only";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { encryptContactValue } from "@/lib/security/contact-encryption";
import { ReportContactModel } from "@/features/reports/report-contact.model";
import { ReportModel } from "@/features/reports/report.model";
import type { ReportInput } from "@/features/reports/report.schema";

function createReferenceCode() {
  return randomBytes(9).toString("hex").toUpperCase();
}

export async function createReport(input: ReportInput) {
  const connection = await connectToDatabase();
  const session = await connection.startSession();
  const reportId = new mongoose.Types.ObjectId();
  const referenceCode = createReferenceCode();

  try {
    await session.withTransaction(async () => {
      await ReportModel.create(
        [
          {
            _id: reportId,
            referenceCode,
            reportAbout: input.reportAbout,
            category: input.category,
            description: input.description,
            approximateDate: input.approximateDate || undefined,
            generalLocation: input.generalLocation || undefined,
            onlinePlatform: input.onlinePlatform || undefined,
            immediateDanger: input.immediateDanger,
          },
        ],
        { session },
      );

      if (input.safeContact) {
        await ReportContactModel.create(
          [
            {
              reportId,
              method: input.safeContact.method,
              encryptedValue: encryptContactValue(input.safeContact.value),
            },
          ],
          { session },
        );
      }
    });

    return referenceCode;
  } finally {
    await session.endSession();
  }
}
