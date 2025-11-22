import { VideoWorkspace } from "@/components/video-workspace";
import { db } from "@/db/client";
import { videos, messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { UIMessage } from "ai";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ videoId: string; chatThead: string }>;
}) {
  const { videoId, chatThead } = await params;

  // Get video to find the chatId and title
  const video = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1);

  const chatId = video[0]?.chatId || chatThead;
  const videoTitle = video[0]?.title || "Untitled Video";

  // Load messages for this chat
  const existingMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.createdAt));

  const serializedMessages: UIMessage[] = existingMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as UIMessage["role"],
    content: msg.content,
    parts: [{ type: "text", text: msg.content }],
    createdAt: msg.createdAt,
  }));

  return (
    <VideoWorkspace
      videoId={videoId}
      chatId={chatId}
      videoTitle={videoTitle}
      initialMessages={serializedMessages}
    />
  );
}

