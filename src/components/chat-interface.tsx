"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Atom, ArrowUp, Video, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatInterfaceProps {
  chatId: string;
  initialMessages: UIMessage[];
}

export function ChatInterface({ chatId, initialMessages }: ChatInterfaceProps) {
  const [isGenerateVideo, setIsGenerateVideo] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
    messages: initialMessages,
  });
  const [input, setInput] = useState("");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGenerateVideo = async (prompt: string) => {
    setIsGeneratingVideo(true);
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate video");

      const data = await response.json();

      // Immediately redirect to the video page
      router.push(`/chat/${chatId}/${data.videoId}`);
    } catch (error) {
      console.error("Error generating video:", error);
      setIsGeneratingVideo(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (isGenerateVideo) {
      // Generate video and redirect
      await handleGenerateVideo(input);
      setInput("");
    } else {
    // Send message using AI SDK's sendMessage
    sendMessage({ text: input });
    setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between p-4 border-b-2 border-border bg-background z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none hover:bg-secondary border-2 border-transparent hover:border-border"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1 border-2 border-border">
              <Atom className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">
              Daemon
            </span>
          </div>
        </div>
        <div className="font-mono text-sm uppercase tracking-widest opacity-50 hidden sm:block">
          THREAD: {chatId.slice(0, 8)}...
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-2 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex items-end gap-2 max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 shrink-0 border-2 border-border flex items-center justify-center ${
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Atom className="w-5 h-5" />
                  ) : (
                    <div className="w-3 h-3 bg-foreground" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`border-2 border-border p-4 shadow-[4px_4px_0px_0px_var(--foreground)] ${
                    message.role === "user"
                      ? "bg-white text-black"
                      : "bg-secondary"
                  }`}
                >
                  <div className={`text-base font-medium prose prose-sm max-w-none ${
                    message.role === "user" ? "prose-slate" : "dark:prose-invert"
                  }`}>
                    {message.parts
                      ?.filter((part) => part.type === "text")
                      .map((part, index) => (
                        <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                          {part.text}
                        </ReactMarkdown>
                      ))}
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono text-muted-foreground uppercase px-12">
                {message.role === "user" ? "You" : "Daemon"}
              </span>
            </div>
          ))}

          {status === "streaming" && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 shrink-0 border-2 border-border flex items-center justify-center bg-primary text-primary-foreground">
                <Atom className="w-5 h-5 animate-pulse" />
              </div>
              <div className="border-2 border-border p-4 bg-secondary">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background">
          <form
            onSubmit={handleSendMessage}
            className="relative flex flex-col max-w-4xl mx-auto w-full border-2 border-border bg-background shadow-[4px_4px_0px_0px_var(--foreground)]"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGeneratingVideo ? "GENERATING VIDEO..." : "Type your message here..."}
              disabled={(status !== "ready" && status !== "error") || isGeneratingVideo}
              className="w-full min-h-[100px] p-4 text-lg bg-transparent border-none focus:outline-none placeholder:uppercase placeholder:font-bold resize-none font-mono disabled:opacity-50"
            />

            <div className="flex items-center justify-between p-3 border-t-2 border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGenerateVideo(!isGenerateVideo)}
                  disabled={(status !== "ready" && status !== "error") || isGeneratingVideo}
                  className={`rounded-none border-2 border-border font-bold uppercase text-xs h-8 px-3 transition-all flex items-center gap-2 ${
                    isGenerateVideo
                      ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] translate-x-px translate-y-px"
                      : "bg-background hover:bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-none"
                  }`}
                >
                  {isGeneratingVideo ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                  <Video className="w-3 h-3" />
                  )}
                  {isGeneratingVideo ? "Generating..." : isGenerateVideo ? "Video: ON" : "Generate video"}
                </Button>
              </div>

              <Button
                type="submit"
                size="icon"
                disabled={
                  !input.trim() || (status !== "ready" && status !== "error") || isGeneratingVideo
                }
                className="h-8 w-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 border-2 border-transparent"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
