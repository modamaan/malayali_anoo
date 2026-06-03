"use client";

import { useState } from "react";
import { MOCK_YOUTUBE_VIDEOS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("Latest");
  const filters = ["Latest", "Trending", "Shorts"];

  // Filter videos based on active filter
  const filteredVideos = MOCK_YOUTUBE_VIDEOS.filter((video) => {
    if (activeFilter === "Latest") return true;
    if (activeFilter === "Trending") return (video as any).trending === true;
    if (activeFilter === "Shorts") return video.link.includes("/shorts/");
    return true;
  });

  // Sort videos based on date
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Always newest first
  });

  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24 overflow-hidden">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">WORK</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-12">
          Explore our latest podcasts, exclusive interviews, and engaging talk shows.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${activeFilter === filter ? "bg-primary-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-fade-in-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedVideos.map((video) => (
            <Link
              href={video.link}
              key={video.id}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#1a1a1d] border border-white/[0.06] hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(210,27,46,0.15)]"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1d]/80 via-black/20 to-transparent" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(210,27,46,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-4">
                <p className="text-primary-500 font-mono text-[10px] uppercase tracking-wider mb-1.5">{video.date}</p>
                <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
