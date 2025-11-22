"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Atom,
  Loader2,
  Play,
  Send,
  ArrowUp,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface VideoWorkspaceProps {
  videoId: string;
  chatId: string;
  videoTitle: string;
  initialMessages: UIMessage[];
}

export function VideoWorkspace({
  videoId,
  chatId,
  videoTitle,
  initialMessages,
}: VideoWorkspaceProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [input, setInput] = useState("");
  const [isGenerateVideo, setIsGenerateVideo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
    messages: initialMessages,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoReady(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Send message using AI SDK's sendMessage
    sendMessage({ text: input });
    setInput("");
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
          <Link href={`/${chatId}`}>
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
        <div className="font-mono text-sm uppercase tracking-widest opacity-50">
          ID: {videoId.slice(0, 8)}...
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Chat */}
        <div className="w-1/3 min-w-[320px] border-r-2 border-border flex flex-col bg-background">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    className={`w-6 h-6 shrink-0 border-2 border-border flex items-center justify-center ${
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Atom className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`border-2 border-border p-3 shadow-[2px_2px_0px_0px_var(--foreground)] ${
                      message.role === "user"
                        ? "bg-white text-black"
                        : "bg-secondary"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium prose prose-sm max-w-none ${
                        message.role === "user"
                          ? "prose-slate"
                          : "dark:prose-invert"
                      }`}
                    >
                      {message.parts
                        ?.filter((part) => part.type === "text")
                        .map((part, index) => (
                          <ReactMarkdown
                            key={index}
                            remarkPlugins={[remarkGfm]}
                          >
                            {part.text}
                          </ReactMarkdown>
                        ))}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono text-muted-foreground uppercase px-8">
                  {message.role === "user" ? "You" : "Daemon"}
                </span>
              </div>
            ))}
            {status === "streaming" && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 shrink-0 border-2 border-border flex items-center justify-center bg-primary text-primary-foreground">
                  <Atom className="w-4 h-4 animate-pulse" />
                </div>
                <div className="border-2 border-border p-3 bg-secondary">
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

          {/* Chat Input */}
          <div className="p-4 border-t-2 border-border bg-background">
            <form
              onSubmit={handleSendMessage}
              className="relative flex flex-col w-full border-2 border-border bg-background shadow-[4px_4px_0px_0px_var(--foreground)]"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={status !== "ready" && status !== "error"}
                className="w-full min-h-[100px] p-4 text-base bg-transparent border-none focus:outline-none placeholder:uppercase placeholder:font-bold resize-none font-mono disabled:opacity-50"
              />

              <div className="flex items-center justify-between p-3 border-t-2 border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsGenerateVideo(!isGenerateVideo)}
                    disabled={status !== "ready" && status !== "error"}
                    className={`rounded-none border-2 border-border font-bold uppercase text-xs h-8 px-3 transition-all flex items-center gap-2 ${
                      isGenerateVideo
                        ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] translate-x-px translate-y-px"
                        : "bg-background hover:bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-none"
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    {isGenerateVideo ? "Video: ON" : "Generate video"}
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    !input.trim() || (status !== "ready" && status !== "error")
                  }
                  className="h-8 w-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 border-2 border-transparent"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Pane - Video */}
        <div className="flex-1 bg-secondary/20 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Video Container */}
          <div className="w-full max-w-4xl aspect-video bg-black border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] relative flex flex-col items-center justify-center">
            {!isVideoReady ? (
              <div className="text-white flex flex-col items-center gap-4 animate-pulse">
                <Loader2 className="w-12 h-12 animate-spin" />
                <span className="font-mono uppercase tracking-widest font-bold">
                  Generating Video...
                </span>
              </div>
             ) : (
               <div className="relative w-full h-full">
                 <iframe
                   className="w-full h-full"
                   src="https://www.youtube.com/embed/hnkUEXgi5Tk"
                   title="YouTube video player"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                   allowFullScreen
                 ></iframe>
               </div>
             )}
          </div>

          {/* Info / Title below video */}
          <div className="mt-8 w-full max-w-4xl">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
              {videoTitle}
            </h1>
            <p className="text-muted-foreground font-mono text-sm uppercase border-l-4 border-primary pl-4">
              Generated content based on your prompt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
