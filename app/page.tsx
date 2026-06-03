"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MOCK_GAMESHOWS,
  MOCK_SADANAM_KAYYILUNDO,
  MOCK_UK_UPDATES,
  MOCK_PODCASTS,
  MOCK_OTHERS,
  MOCK_EVENTS,
  MOCK_SPONSORS
} from "@/lib/data";
import HeroBanner from "@/components/HeroBanner";
import IntroSplashScreen from "@/components/IntroSplashScreen";

const VideoCard = ({ video }: { video: any }) => (
  <Link
    href={video.link}
    key={video.id}
    target="_blank"
    rel="noopener noreferrer"
    className="group shrink-0 w-[260px] sm:w-[300px] md:w-[320px] snap-start flex flex-col rounded-2xl overflow-hidden bg-[#1a1a1d] border border-white/[0.06] hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(210,27,46,0.15)]"
  >
    {/* Thumbnail */}
    <div className="relative w-full aspect-video overflow-hidden">
      <Image
        src={video.thumbnailUrl}
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

    {/* Card Body — always visible */}
    <div className="flex flex-col flex-1 p-4">
      <p className="text-primary-500 font-mono text-[10px] uppercase tracking-wider mb-1.5">{video.date}</p>
      <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-2">
        {video.title}
      </h3>
      {video.description && (
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-auto pt-1">{video.description}</p>
      )}
    </div>
  </Link>
);

const VideoRow = ({ title, subtitle, videos, linkHref }: { title: string; subtitle: string; videos: any[]; linkHref: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></span>
          </h2>
          {subtitle && <p className="text-gray-300 text-xs md:text-sm mt-4">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Link href={linkHref} className="flex items-center text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-full transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">
            More
          </Link>
          
          <div className="hidden md:flex items-center gap-1.5">
            <button 
              onClick={() => scroll('left')}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

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
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <IntroSplashScreen />
      <HeroBanner />

      <div className="py-12">
        <VideoRow
          title="Gameshows"
          subtitle="Watch our thrilling competition series"
          videos={MOCK_GAMESHOWS}
          linkHref="/portfolio"
        />
        <VideoRow
          title="Sadanam Kayyilundo??"
          subtitle="Hilarious public interactions"
          videos={MOCK_SADANAM_KAYYILUNDO}
          linkHref="/portfolio"
        />
        <VideoRow
          title="Latest UK Updates"
          subtitle="Essential news and updates you can't miss"
          videos={MOCK_UK_UPDATES}
          linkHref="/portfolio"
        />
        <VideoRow
          title="Podcasts & Interviews"
          subtitle="Deep conversations with fascinating people"
          videos={MOCK_PODCASTS}
          linkHref="/portfolio"
        />
        <VideoRow
          title="Others"
          subtitle="More exciting content and giveaways"
          videos={MOCK_OTHERS}
          linkHref="/portfolio"
        />
      </div>

      {/* Upcoming Events Section (Ticker Style) */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        {/* Angled background effect */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-background -skew-y-2 origin-top-left z-10 -mt-8"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background skew-y-2 origin-bottom-left z-10 -mb-8"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tight">Community Events</h2>
          </div>

          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="glass p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-6 md:w-1/3">
                  <div className="text-center bg-black/50 p-4 rounded-xl min-w-[100px]">
                    <p className="text-primary-500 font-bold text-xl uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                    <p className="text-white font-black text-3xl">{new Date(event.date).getDate()}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                    <p className="text-gray-300 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="md:w-1/3 text-center md:text-left text-gray-200">
                  <p>{event.description}</p>
                  {/* @ts-ignore */}
                  {event.price && <p className="text-primary-500 font-bold mt-2">{event.price}</p>}
                </div>

                <div className="md:w-1/4 flex justify-end w-full">
                  <Link
                    /* @ts-ignore */
                    href={event.ticketLink || `/events/${event.id}`}
                    /* @ts-ignore */
                    target={event.ticketLink ? "_blank" : "_self"}
                    /* @ts-ignore */
                    rel={event.ticketLink ? "noopener noreferrer" : ""}
                    className="px-6 py-3 w-full text-center bg-zinc-950 hover:bg-white hover:text-black text-white font-bold rounded-full transition-colors"
                  >
                    {/* @ts-ignore */}
                    {event.ticketLink ? "Register Now" : "Details"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <section className="py-24 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 uppercase tracking-widest text-sm font-bold mb-10">Trusted By Our Partners</p>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
            {MOCK_SPONSORS.map((sponsor) => (
              <div key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 md:h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
