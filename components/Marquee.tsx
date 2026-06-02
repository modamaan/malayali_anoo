"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

interface MarqueeItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  link: string;
  date?: string;
}

interface MarqueeProps {
  items: MarqueeItem[];
  direction?: "left" | "right";
  speed?: number;
}

export default function Marquee({ items, direction = "left", speed = 30 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    
    if (direction === "right") {
      gsap.set(track, { xPercent: -50 });
    }

    const tween = gsap.to(track, {
      xPercent: direction === "left" ? -50 : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    const pauseMarquee = () => tween.pause();
    const playMarquee = () => tween.play();

    track.addEventListener("mouseenter", pauseMarquee);
    track.addEventListener("mouseleave", playMarquee);

    return () => {
      tween.kill();
      track.removeEventListener("mouseenter", pauseMarquee);
      track.removeEventListener("mouseleave", playMarquee);
    };
  }, [direction, speed]);

  // Duplicate items twice to ensure smooth infinite scrolling
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap py-10 w-full">
      <div className="inline-flex gap-6 px-3" ref={trackRef}>
        {displayItems.map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-video flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-background border border-white/5 transition-colors hover:border-primary-500/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-300"></div>
            
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-white whitespace-normal line-clamp-2 leading-snug">{item.title}</h4>
            </div>
            
            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-600 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(210,27,46,0.6)]">
                 <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
