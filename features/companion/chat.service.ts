import "server-only";
import { randomBytes } from "node:crypto";
import {
  CompanionConversationModel,
  type CompanionMessageRole,
} from "@/features/companion/chat.model";

export const companionChatCodePattern = /^DS-[A-F0-9]{32}$/;
const archivePageSize = 20;

export type CompanionArchiveSummary = {
  chatCode: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
};

export type CompanionArchiveMessage = {
  role: CompanionMessageRole;
  content: string;
  createdAt: string;
};

export async function createConversation(firstMessage: string) {
  const chatCode = `DS-${randomBytes(16).toString("hex").toUpperCase()}`;
  const conversation = await CompanionConversationModel.create({
    chatCode,
    messages: [{ role: "user", content: firstMessage }],
  });

  return conversation;
}

export async function appendUserMessage(
  chatCode: string,
  content: string,
) {
  return CompanionConversationModel.findOneAndUpdate(
    { chatCode },
    { $push: { messages: { role: "user", content } } },
    { new: true, runValidators: true },
  );
}

export async function appendAssistantMessage(
  chatCode: string,
  content: string,
) {
  return CompanionConversationModel.updateOne(
    { chatCode },
    { $push: { messages: { role: "assistant", content } } },
    { runValidators: true },
  );
}

export async function listConversationSummaries(page: number) {
  const filter = {};
  const [total, conversations] = await Promise.all([
    CompanionConversationModel.countDocuments(filter),
    CompanionConversationModel.aggregate<{
      chatCode: string;
      createdAt: Date;
      updatedAt: Date;
      messageCount: number;
      preview: string;
    }>([
      { $sort: { updatedAt: -1 } },
      { $skip: (page - 1) * archivePageSize },
      { $limit: archivePageSize },
      {
        $project: {
          chatCode: 1,
          createdAt: 1,
          updatedAt: 1,
          messageCount: { $size: "$messages" },
          preview: { $arrayElemAt: ["$messages.content", 0] },
        },
      },
    ]),
  ]);

  return {
    conversations: conversations.map((conversation) => ({
      chatCode: conversation.chatCode,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messageCount: conversation.messageCount,
      preview: conversation.preview ?? "",
    })),
    page,
    pageSize: archivePageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / archivePageSize)),
  };
}

export async function getConversation(chatCode: string) {
  const conversation = await CompanionConversationModel.findOne({ chatCode })
    .select("chatCode createdAt updatedAt messages")
    .lean();

  if (!conversation) {
    return null;
  }

  return {
    chatCode: conversation.chatCode,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    messages: conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}
