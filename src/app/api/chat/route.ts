import { openrouter } from "@/lib/openrouter";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { db } from "@/db/client";
import { messages as messagesSchema } from "@/db/schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();

  const coreMessages = convertToModelMessages(messages);
  const lastMessage = coreMessages[coreMessages.length - 1];

  const content = Array.isArray(lastMessage.content)
    ? lastMessage.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("")
    : lastMessage.content;

  // Save user message
  await db.insert(messagesSchema).values({
    id: messages[messages.length - 1].id, // Use original ID from UIMessage
    chatId,
    role: "user",
    content,
  });

  const result = streamText({
    model: openrouter.chat("x-ai/grok-4.1-fast:free"),
    system: "You are a helpful AI assistant named Daemon.",
    messages: coreMessages,
    onFinish: async ({ text }) => {
      // Save assistant message
      const responseId = crypto.randomUUID();
      await db.insert(messagesSchema).values({
        id: responseId,
        chatId,
        role: "assistant",
        content: text,
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
