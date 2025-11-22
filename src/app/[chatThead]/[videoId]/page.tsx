import { VideoWorkspace } from "@/components/video-workspace";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  return <VideoWorkspace videoId={videoId} />;
}

