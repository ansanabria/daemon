"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Atom, ArrowUp, Video, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "generation" | "video";
  videoId?: string;
  timestamp: Date;
};

export default function ChatThreadPage({
  params,
}: {
  params: Promise<{ chatThead: string }>;
}) {
  const [chatId, setChatId] = useState<string>("");
  const [isGenerateVideo, setIsGenerateVideo] = useState(false);

  useEffect(() => {
     params.then((resolvedParams) => {
       setChatId(resolvedParams.chatThead);
     });
  }, [params]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm ready to help. What would you like to explore today?",
      type: "text",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      type: "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const shouldGenerateVideo = isGenerateVideo;
      const videoId = shouldGenerateVideo ? `vid-${Date.now()}` : undefined;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: shouldGenerateVideo ? "I've generated a video based on your request." : "Here is what I found based on your request.",
        type: shouldGenerateVideo ? "video" : "generation",
        videoId: videoId,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
             <Button variant="ghost" size="icon" className="rounded-none hover:bg-secondary border-2 border-transparent hover:border-border">
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
               <div className={`flex items-end gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 shrink-0 border-2 border-border flex items-center justify-center ${message.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {message.role === 'assistant' ? <Atom className="w-5 h-5" /> : <div className="w-3 h-3 bg-foreground" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`border-2 border-border p-4 shadow-[4px_4px_0px_0px_var(--foreground)] ${
                      message.role === "user"
                        ? "bg-white text-black"
                        : "bg-secondary"
                    }`}
                  >
                    {message.type === 'generation' ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-lg font-black uppercase border-b-2 border-border/20 pb-2 mb-1">Generated Output</p>
                        <div className="h-32 bg-background border-2 border-border flex items-center justify-center opacity-50">
                           <span className="font-mono uppercase text-sm">Generative Content Placeholder</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : message.type === 'video' && message.videoId ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-lg font-black uppercase border-b-2 border-border/20 pb-2 mb-1">Generated Video</p>
                        <Link href={`/${chatId}/${message.videoId}`} className="block">
                          <div className="group relative aspect-video bg-black border-2 border-border shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-pointer overflow-hidden">
                             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-12 h-12 bg-background border-2 border-border flex items-center justify-center shadow-[2px_2px_0px_0px_var(--foreground)] group-hover:scale-110 transition-transform duration-200">
                                 <Play className="w-6 h-6 text-foreground fill-foreground ml-1" />
                               </div>
                             </div>
                             <div className="absolute bottom-2 left-2 right-2">
                                <div className="h-1 bg-white/20 w-full">
                                   <div className="h-full w-1/3 bg-primary"></div>
                                </div>
                             </div>
                          </div>
                        </Link>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : (
                      <p className="text-base font-medium">{message.content}</p>
                    )}
                  </div>
               </div>

               <span className="text-xs font-mono text-muted-foreground uppercase px-12">
                 {message.role === "user" ? "You" : "Daemon"} •{" "}
                 {message.timestamp.toLocaleTimeString([], {
                   hour: "2-digit",
                   minute: "2-digit",
                 })}
               </span>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background">
           <form onSubmit={handleSendMessage} className="relative flex flex-col max-w-4xl mx-auto w-full border-2 border-border bg-background shadow-[4px_4px_0px_0px_var(--foreground)]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="w-full min-h-[100px] p-4 text-lg bg-transparent border-none focus:outline-none placeholder:uppercase placeholder:font-bold resize-none font-mono"
              />

              <div className="flex items-center justify-between p-3 border-t-2 border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsGenerateVideo(!isGenerateVideo)}
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
                  disabled={!input.trim()}
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
