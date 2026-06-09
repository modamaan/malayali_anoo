"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  youtube_id?: string;
}

// Extract YouTube video ID from various URL formats
// Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // MUST default to true for browsers to allow autoplay on page load

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const syncVideoState = () => {
      banners.forEach((banner, index) => {
        const youtubeId = banner.youtube_id || extractYoutubeId(banner.link || '');
        if (youtubeId) {
          const iframe = document.getElementById(`yt-${banner.id}`) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            if (index !== currentIndex) {
              // Mute and pause hidden videos
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
            } else {
              // Unmute/mute current video based on state and ensure it's playing
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: isMuted ? 'mute' : 'unMute', args: [] }), '*');
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
            }
          }
        }
      });
    };

    // Apply immediately and then retry to catch late-loading iframes
    syncVideoState();
    timeouts.push(setTimeout(syncVideoState, 500));
    timeouts.push(setTimeout(syncVideoState, 1500));
    timeouts.push(setTimeout(syncVideoState, 3000));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [currentIndex, isMuted]);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % (banners.length || 1));
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {banners.map((banner, index) => {
        const youtubeId = banner.youtube_id || extractYoutubeId(banner.link || '');
        const hasVideo = !!youtubeId;
        const isActive = index === currentIndex;

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image / Video */}
            <div className="absolute inset-0 bg-black">
              {hasVideo ? (
                <div className="relative w-full h-full scale-[1.3] md:scale-[1.5] pointer-events-none bg-zinc-950">
                  {isActive && (
                    <iframe
                      id={`yt-${banner.id}`}
                      src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
                      className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
                      allow="autoplay; encrypted-media"
                    ></iframe>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 bg-zinc-950" />
              )}
              {/* Gradient Overlay to make text readable but keep video visible */}
              <div className={`absolute inset-0 bg-gradient-to-r ${hasVideo ? 'from-black/50 via-transparent to-transparent' : 'from-black/90 via-black/50 to-transparent'}`}></div>
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-50"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col justify-center h-full max-w-7xl mx-auto px-12 sm:px-16 lg:px-24">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-2 max-w-lg animate-fade-in-up drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-100 mb-4 max-w-md drop-shadow-md">
                {banner.subtitle}
              </p>
              <div className="flex gap-4 items-center mt-2">
                {!hasVideo && (
                  <Link
                    href={banner.link}
                    target={banner.link.startsWith('http') ? '_blank' : '_self'}
                    rel={banner.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="inline-block px-6 py-2 md:px-8 md:py-3 text-sm md:text-base bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-full transition-all hover:scale-105 pointer-events-auto"
                  >
                    Explore Now
                  </Link>
                )}

                {hasVideo && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm pointer-events-auto border border-white/20"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      // Muted icon (speaker with cross)
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      // Sound on icon (speaker with waves)
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevBanner}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-black/30 hover:bg-primary-600 backdrop-blur-sm text-white rounded-full transition-colors"
        aria-label="Previous banner"
      >
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextBanner}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-black/30 hover:bg-primary-600 backdrop-blur-sm text-white rounded-full transition-colors"
        aria-label="Next banner"
      >
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2 md:space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-primary-500 scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
