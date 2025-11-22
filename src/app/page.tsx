import { SearchForm } from "@/components/search-form";
import { Atom, Play } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Why Rainbows Are Actually Circular",
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "How Black Holes Actually Work",
    color: "bg-neutral-800",
  },
  {
    id: 3,
    title: "The Secret Pattern In Prime Numbers",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    title: "Why Ice Floats (And Why That's Amazing)",
    color: "bg-cyan-500",
  },
  {
    id: 5,
    title: "The Mathematics of Bee Honeycomb",
    color: "bg-amber-500",
  },
  {
    id: 6,
    title: "How Sound Waves Actually Look",
    color: "bg-purple-500",
  },
  {
    id: 7,
    title: "Why Mirrors Flip Left-Right But Not Up-Down",
    color: "bg-stone-500",
  },
  {
    id: 8,
    title: "Why Hot Water Freezes Faster Than Cold",
    color: "bg-sky-500",
  },
  {
    id: 9,
    title: "Why Soap Bubbles Are Perfect Spheres",
    color: "bg-indigo-500",
  },
  {
    id: 10,
    title: "The Mathematics of Music",
    color: "bg-violet-500",
  },
  {
    id: 11,
    title: "How Cats Always Land on Their Feet",
    color: "bg-orange-500",
  },
  {
    id: 12,
    title: "The Secret Math of Roller Coasters",
    color: "bg-red-500",
  },
  {
    id: 13,
    title: "How Vaccines Train Your Immune System",
    color: "bg-emerald-500",
  },
  {
    id: 14,
    title: "The Mathematics of Online Encryption",
    color: "bg-slate-600",
  },
  {
    id: 15,
    title: "The Physics of Spinning Tops",
    color: "bg-rose-500",
  },
  {
    id: 16,
    title: "Carbon Dating: The Mathematical Clock",
    color: "bg-green-500",
  },
  {
    id: 17,
    title: "The Mathematical Magic of GPS",
    color: "bg-lime-500",
  },
  {
    id: 18,
    title: "The Architecture of Memory",
    color: "bg-pink-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 md:px-6 border-b-2 border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1 border-2 border-border">
            <Atom className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight uppercase">
            Daemon
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center gap-12">
        {/* Hero Section */}
        <SearchForm />

        {/* Video Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col gap-0 cursor-pointer animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
              style={{ animationDelay: `${video.id * 50}ms` }}
            >
              {/* Thumbnail Card */}
              <div
                className={`relative aspect-video border-2 border-border ${video.color} shadow-[6px_6px_0px_0px_var(--foreground)] transition-all duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0px_0px_var(--foreground)] group-active:translate-x-[6px] group-active:translate-y-[6px] group-active:shadow-none`}
              >
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-background border-2 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_var(--foreground)] group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 text-foreground fill-foreground ml-1" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="border-x-2 border-b-2 border-border p-3 bg-background">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-tight line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
