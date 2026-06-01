"use client";

import { useState, useEffect } from "react";
import { MOCK_YOUTUBE_VIDEOS, MOCK_INSTAGRAM_POSTS } from "@/lib/data";
import Marquee from "@/components/Marquee";
import Script from "next/script";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "YouTube", "Instagram"];

  useEffect(() => {
    // Process Instagram embeds whenever the DOM changes (e.g. filter toggle)
    if (typeof window !== "undefined" && (window as any).instgrm) {
      setTimeout(() => {
        (window as any).instgrm.Embeds.process();
      }, 100);
    }
  }, [activeFilter]);

  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24 overflow-hidden">
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">WORK</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-12">
          Explore our latest podcasts, exclusive interviews, and engaging talk shows.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          {filters.map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                activeFilter === filter ? "bg-primary-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="w-full space-y-16 py-10">
        {/* YouTube Marquee */}
        {(activeFilter === "All" || activeFilter === "YouTube") && (
          <div className="animate-fade-in-up">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">YouTube Highlights</h2>
            </div>
            <Marquee items={MOCK_YOUTUBE_VIDEOS} direction="left" speed={40} />
          </div>
        )}

        {/* Instagram Grid */}
        {(activeFilter === "All" || activeFilter === "Instagram") && (
          <div className="animate-fade-in-up">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Instagram Reels</h2>
            </div>
            
            {/* Instagram Static Grid */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {MOCK_INSTAGRAM_POSTS.map((item) => (
                <div key={item.id} className="w-full flex justify-center max-w-[400px]">
                  <blockquote 
                    className="instagram-media" 
                    data-instgrm-permalink={`${item.link}?utm_source=ig_embed&amp;utm_campaign=loading`} 
                    data-instgrm-version="14" 
                    style={{ background: '#FFF', border: 0, borderRadius: '3px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth: '400px', minWidth: '326px', padding: 0, width: '100%' }}
                  >
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
