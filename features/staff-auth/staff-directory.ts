import "server-only";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ReportModel } from "@/features/reports/report.model";

export type StaffDirectoryEntry = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "safeguarding_officer";
};

type StaffUserDocument = {
  _id?: unknown;
  name?: unknown;
  email?: unknown;
  role?: unknown;
  banned?: unknown;
};

export async function listStaffDirectory(): Promise<StaffDirectoryEntry[]> {
  await connectToDatabase();
  const users = await ReportModel.db
    .collection<StaffUserDocument>("user")
    .find(
      { role: { $in: ["admin", "safeguarding_officer"] }, banned: { $ne: true } },
      { projection: { _id: 1, name: 1, email: 1, role: 1 } },
    )
    .sort({ name: 1 })
    .toArray();

  return users.flatMap((user) => {
    if (
      (user.role !== "admin" && user.role !== "safeguarding_officer") ||
      typeof user.email !== "string" ||
      user._id == null
    ) {
      return [];
    }

    return [
      {
        id: String(user._id),
        name:
          (typeof user.name === "string" && user.name.trim()) || user.email,
        email: user.email,
        role: user.role,
      },
    ];
  });
}
