import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/lib/types";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 w-[260px] sm:w-[300px] md:w-[320px] snap-start flex flex-col rounded-2xl overflow-hidden bg-[#1a1a1d] border border-white/[0.06] hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(210,27,46,0.15)]"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={video.thumbnail_url || video.thumbnailUrl || ''}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 320px"
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
        <p className="text-primary-500 font-mono text-[10px] uppercase tracking-wider mb-1.5">
          {video.date}
        </p>
        <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-auto pt-1">
            {video.description}
          </p>
        )}
      </div>
    </Link>
  );
}
