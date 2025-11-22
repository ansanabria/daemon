"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Generate a random ID or use a slug from the query
      const threadId = query.toLowerCase().replace(/\s+/g, "-").slice(0, 20);
      router.push(`/${threadId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase border-b-4 border-border pb-2 inline-block self-center">
        What do you want to know?
      </h1>

      <div className="relative w-full">
        <Input
          type="text"
          placeholder="ASK ANYTHING..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-16 pl-4 pr-12 text-lg rounded-none border-2 border-border bg-background focus-visible:ring-0 focus-visible:border-4 shadow-[6px_6px_0px_0px_var(--foreground)] placeholder:uppercase placeholder:font-bold"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground">
          <Paperclip className="w-6 h-6 hover:scale-110 cursor-pointer transition-transform" />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto self-center h-14 px-10 text-lg rounded-none bg-primary text-primary-foreground border-2 border-border shadow-[6px_6px_0px_0px_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black uppercase hover:bg-primary"
      >
        Generate Video
      </Button>
    </form>
  );
}

