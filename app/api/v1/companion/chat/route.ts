import { z } from "zod";
import {
  appendAssistantMessage,
  appendUserMessage,
  companionChatCodePattern,
  createConversation,
} from "@/features/companion/chat.service";
import type { CompanionMessage } from "@/features/companion/chat.model";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getOpenAIEnv } from "@/lib/env";
import { isTrustedSameOrigin } from "@/lib/security/same-origin";

const maximumRequestLength = 5000;
const maximumContextMessages = 12;
const maximumContextCharacters = 10_000;
const maximumOutputTokens = 350;

const chatRequestSchema = z
  .object({
    chatCode: z.string().regex(companionChatCodePattern).optional(),
    message: z.string().trim().min(1).max(2000),
  })
  .strict();

const instructions = `You are Digisafe AI, a supportive AI-powered child and teen protection and digital-safety companion. DigiSafe AI is a product of Advocacy for Youth and Vulnerable Development Initiative (AYVDI). If asked who created, provides, or is behind DigiSafe AI, clearly identify AYVDI by its full name. You may answer questions about child protection, online safety, safeguarding, digital wellbeing, online harassment, cyberstalking, image-based abuse, DigiSafe AI, and AYVDI's related services and educational work. If asked about something unrelated, briefly say you can only help with those topics.

Use plain, age-appropriate, compassionate language and concise, practical answers. First check whether anyone is in immediate danger; if so, prioritize getting to a safer place and contacting local emergency services or a trusted adult now. Do not claim to investigate, contact authorities, dispatch help, diagnose, or replace a trusted adult or safeguarding professional.

Tailor next steps to the concern when relevant:
- Bullying or cyberbullying: avoid escalating or retaliating, save non-explicit messages and account details if safe, block or restrict the account, report it on the platform, and tell a trusted adult or school safeguarding contact.
- Threats, blackmail, or coercion: do not pay, send more material, or meet the person; preserve messages and account details if safe, stop engaging, report the account, and get help from a trusted adult or appropriate local authority.
- Unwanted sexual messages or exposure: do not reply, forward, or share the material; block and report the account and tell a trusted adult or safeguarding professional.
- Intimate-image threats or sharing: never ask the person to send, download, save, or forward an intimate image, especially an image of a child. Preserve only surrounding threat messages or account details if safe, report the account and content through the platform, and involve a trusted adult or safeguarding professional.
- Grooming or exploitation: do not arrange a meeting or confront the suspected person; preserve non-explicit messages if safe, stop contact if safe to do so, and tell a trusted adult or safeguarding professional promptly.
- Physical or sexual abuse: focus on immediate safety, reach a safe trusted adult, and contact local emergency services when danger is immediate. Do not press for graphic details.
- Discrimination, stalking, or other unsafe behaviour: prioritize safety, avoid confrontation, keep a record of non-explicit incidents if safe, use platform blocking and reporting tools where applicable, and seek trusted adult or professional support.

Offer a short, prioritized action list (what to do now, what to do next, and where to get help) rather than overwhelming the user. Do not pressure anyone to disclose more than necessary. Never ask for a name, exact address, school, phone number, password, or other identifying detail. Do not ask for location. If the person volunteers a location, use only the broad country or region they provide to tailor general guidance; do not infer a location, repeat precise location details, or claim to know local services based on it.

Only recommend named organizations, phone numbers, or helplines that are explicitly published as verified contacts on this website. The site's Get help now page lists AYVDI safeguarding support and current verified contact details. If no verified local service for the user's location is listed, say you do not have a verified local contact and suggest local emergency services for immediate danger, a trusted adult or safeguarding professional, and the website's report form. Do not invent AYVDI's mission, services, contacts, history, laws, local emergency numbers, or other facts; when asked for unsupported information, say it is not verified here and direct the person to the site's About or Get help now page.`;

const openAIResponseSchema = z.object({
  output: z
    .array(
      z.object({
        content: z
          .array(
            z.object({
              type: z.string().optional(),
              text: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

const openAIErrorSchema = z.object({
  error: z
    .object({
      type: z.string().optional(),
      code: z.union([z.string(), z.number()]).optional(),
      param: z.string().optional(),
    })
    .optional(),
});

function getRecentContext(messages: CompanionMessage[]) {
  const context: CompanionMessage[] = [];
  let totalCharacters = 0;

  for (const message of messages.slice(-maximumContextMessages).reverse()) {
    const content = message.content.slice(0, 3000);
    if (totalCharacters + content.length > maximumContextCharacters) break;
    context.unshift({ ...message, content });
    totalCharacters += content.length;
  }

  return context
    .map(
      ({ role, content }) =>
        `${role === "user" ? "User" : "Digisafe AI"}: ${content}`,
    )
    .join("\n\n")
    .concat("\n\nDigisafe AI:");
}

export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) {
    return Response.json(
      { error: "Request origin was not accepted." },
      { status: 403 },
    );
  }

  if (
    request.headers.get("content-type")?.split(";")[0] !== "application/json"
  ) {
    return Response.json(
      { error: "A JSON chat message is required." },
      { status: 415 },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maximumRequestLength) {
    return Response.json(
      { error: "That message is too long. Please shorten it and try again." },
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
            { error: "That message is too long. Please shorten it and try again." },
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

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    return Response.json({ error: "The message could not be read." }, { status: 400 });
  }

  const result = chatRequestSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      { error: "Enter a message to continue." },
      { status: 400 },
    );
  }

  let openAIEnv: ReturnType<typeof getOpenAIEnv>;
  try {
    openAIEnv = getOpenAIEnv();
  } catch {
    console.error("OpenAI companion configuration is missing or invalid.");
    return Response.json(
      { error: "Digisafe AI is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  try {
    await connectToDatabase();
    const conversation = result.data.chatCode
      ? await appendUserMessage(result.data.chatCode, result.data.message)
      : await createConversation(result.data.message);

    if (!conversation) {
      return Response.json(
        { error: "This conversation code could not be found. Start a new chat." },
        { status: 404 },
      );
    }

    const chatCode = conversation.chatCode;
    let response: Response;

    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIEnv.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: openAIEnv.OPENAI_MODEL,
          instructions,
          input: getRecentContext(conversation.messages),
          max_output_tokens: maximumOutputTokens,
          store: false,
        }),
      });
    } catch (error) {
      console.error(
        "OpenAI companion request failed.",
        error instanceof Error ? error.name : "UnknownError",
      );
      return Response.json(
        {
          chatCode,
          error: "Digisafe AI could not respond just now. Your message was saved; please try again.",
        },
        { status: 503 },
      );
    }

    if (!response.ok) {
      let providerError: unknown;
      try {
        providerError = await response.json();
      } catch {
        providerError = undefined;
      }

      const parsedProviderError = openAIErrorSchema.safeParse(providerError);
      console.error("OpenAI companion request failed.", {
        status: response.status,
        requestId: response.headers.get("x-request-id"),
        ...(parsedProviderError.success
          ? {
              errorType: parsedProviderError.data.error?.type,
              errorCode: parsedProviderError.data.error?.code,
              errorParam: parsedProviderError.data.error?.param,
            }
          : {}),
      });

      return Response.json(
        {
          chatCode,
          error: "Digisafe AI could not respond just now. Your message was saved; please try again.",
        },
        { status: 503 },
      );
    }

    let responsePayload: unknown;
    try {
      responsePayload = await response.json();
    } catch {
      console.error("OpenAI companion response was not valid JSON.");
      return Response.json(
        {
          chatCode,
          error: "Digisafe AI could not respond just now. Your message was saved; please try again.",
        },
        { status: 503 },
      );
    }

    const parsedResponse = openAIResponseSchema.safeParse(responsePayload);
    if (!parsedResponse.success) {
      console.error("OpenAI companion response had an unexpected shape.");
      return Response.json(
        {
          chatCode,
          error: "Digisafe AI could not respond just now. Your message was saved; please try again.",
        },
        { status: 503 },
      );
    }

    const reply = parsedResponse.data.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")
      ?.text?.trim();

    if (!reply) {
      console.error("OpenAI companion response did not contain text.");
      return Response.json(
        {
          chatCode,
          error: "Digisafe AI could not respond just now. Your message was saved; please try again.",
        },
        { status: 503 },
      );
    }

    const savedReply = await appendAssistantMessage(chatCode, reply);
    if (savedReply.matchedCount !== 1) {
      throw new Error("Conversation no longer exists.");
    }

    return Response.json({ chatCode, reply });
  } catch (error) {
    console.error(
      "Companion conversation could not be saved.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "Your message could not be confirmed as saved. Please try again." },
      { status: 503 },
    );
  }
}
