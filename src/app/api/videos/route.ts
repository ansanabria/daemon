import { db } from "@/db/client";
import { videos } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { chatId, prompt }: { chatId: string; prompt: string } = await req.json();

  if (!chatId || !prompt) {
    return NextResponse.json(
      { error: "chatId and prompt are required" },
      { status: 400 }
    );
  }

  // Generate a unique video ID
  const videoId = crypto.randomUUID();

  // Create video entry
  await db.insert(videos).values({
    id: videoId,
    chatId,
    title: prompt.slice(0, 100), // Use first 100 chars of prompt as title
    prompt,
    status: "processing",
  });

  return NextResponse.json({ videoId, status: "processing" });
}

