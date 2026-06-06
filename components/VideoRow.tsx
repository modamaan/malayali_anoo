"use client";

import { useRef } from "react";
import Link from "next/link";
import VideoCard from "./VideoCard";
import type { Video } from "@/lib/types";

interface VideoRowProps {
  title: string;
  subtitle?: string;
  videos: Video[];
  linkHref: string;
}

export default function VideoRow({ title, subtitle, videos, linkHref }: VideoRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const scrollTo =
      direction === "left"
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75;
    scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
          </h2>
          {subtitle && (
            <p className="text-gray-300 text-xs md:text-sm mt-4">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href={linkHref}
            className="flex items-center text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-full transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold"
          >
            More
          </Link>

          {/* Prev / Next arrows — desktop only */}
          <div className="hidden md:flex items-center gap-1.5">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label={`Scroll ${dir}`}
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-5 md:gap-6 pb-6 hide-scrollbar scroll-smooth"
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
