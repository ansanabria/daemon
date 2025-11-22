"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Atom, Loader2, Play, Send, ArrowUp, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function VideoWorkspace({ videoId }: { videoId: string }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [input, setInput] = useState("");
  const [isGenerateVideo, setIsGenerateVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoReady(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Handle submit if needed
      setInput("");
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
        <div className="font-mono text-sm uppercase tracking-widest opacity-50">
          ID: {videoId.slice(0, 8)}...
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Chat */}
        <div className="w-1/3 min-w-[320px] border-r-2 border-border flex flex-col bg-background">
           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="flex flex-col gap-2 items-start">
                 <div className="bg-secondary border-2 border-border p-3 max-w-[85%] shadow-[4px_4px_0px_0px_var(--foreground)]">
                    <p className="text-sm font-medium">Hello! I'm generating a video about "{videoId.replace(/-/g, " ")}". What specific aspects are you interested in?</p>
                 </div>
                 <span className="text-xs font-mono text-muted-foreground uppercase">Daemon • Now</span>
              </div>
           </div>

           {/* Chat Input */}
           <div className="p-4 border-t-2 border-border bg-background">
              <div className="relative flex flex-col w-full border-2 border-border bg-background shadow-[4px_4px_0px_0px_var(--foreground)]">
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
                     size="icon"
                     disabled={!input.trim()}
                     className="h-8 w-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 border-2 border-transparent"
                   >
                      <ArrowUp className="w-4 h-4" />
                   </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Pane - Video */}
        <div className="flex-1 bg-secondary/20 p-6 flex flex-col items-center justify-center relative overflow-hidden">

          {/* Video Container */}
          <div className="w-full max-w-4xl aspect-video bg-black border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] relative flex flex-col items-center justify-center">
             {!isVideoReady ? (
               <div className="text-white flex flex-col items-center gap-4 animate-pulse">
                 <Loader2 className="w-12 h-12 animate-spin" />
                 <span className="font-mono uppercase tracking-widest font-bold">Generating Video...</span>
               </div>
             ) : (
               <div className="group relative w-full h-full flex items-center justify-center bg-zinc-900 cursor-pointer">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 <Play className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 fill-white" />
                 <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white font-mono text-sm">
                    <div className="h-2 flex-1 bg-white/20 rounded-none">
                       <div className="h-full w-1/3 bg-primary"></div>
                    </div>
                    <span>02:14 / 10:00</span>
                 </div>
               </div>
             )}
          </div>

          {/* Info / Title below video */}
          <div className="mt-8 w-full max-w-4xl">
             <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
               {videoId.replace(/-/g, " ")}
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
