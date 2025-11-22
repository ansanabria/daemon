import { ChatInterface } from "@/components/chat-interface";
import { db } from "@/db/client";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { UIMessage } from "ai";

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ chatThead: string }>;
}) {
  const { chatThead } = await params;

  const existingMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatThead))
    .orderBy(asc(messages.createdAt));

  const serializedMessages: UIMessage[] = existingMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as UIMessage["role"],
    content: msg.content,
    parts: [{ type: "text", text: msg.content }],
    createdAt: msg.createdAt,
  }));

  return (
    <ChatInterface chatId={chatThead} initialMessages={serializedMessages} />
  );
}
