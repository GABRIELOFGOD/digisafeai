import { reportInputSchema } from "@/features/reports/report.schema";
import { createReport } from "@/features/reports/report.service";
import { isTrustedSameOrigin } from "@/lib/security/same-origin";

const maximumRequestLength = 12_000;

export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) {
    return Response.json({ error: "Request origin was not accepted." }, { status: 403 });
  }

  if (
    request.headers.get("content-type")?.split(";")[0] !== "application/json"
  ) {
    return Response.json(
      { error: "A JSON report is required." },
      { status: 415 },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);

  if (declaredLength > maximumRequestLength) {
    return Response.json(
      { error: "The report is too long. Please shorten it and try again." },
      { status: 413 },
    );
  }

  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalLength += value.byteLength;

        if (totalLength > maximumRequestLength) {
          await reader.cancel();
          return Response.json(
            { error: "The report is too long. Please shorten it and try again." },
            { status: 413 },
          );
        }

        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  const bodyBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const body = new TextDecoder().decode(bodyBytes);

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json(
      { error: "The report could not be read. Please review it and try again." },
      { status: 400 },
    );
  }

  const result = reportInputSchema.safeParse(payload);

  if (!result.success) {
    return Response.json(
      {
        error: "Please check the required fields and try again.",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const referenceCode = await createReport(result.data);

    return Response.json({ referenceCode }, { status: 201 });
  } catch (error) {
    console.error(
      "Report submission failed.",
      error instanceof Error ? error.name : "UnknownError",
    );

    return Response.json(
      {
        error:
          "Your report could not be confirmed as saved. Please do not assume it was received.",
      },
      { status: 503 },
    );
  }
}
