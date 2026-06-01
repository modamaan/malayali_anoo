"use client";

import { useState, useEffect } from "react";

export default function ImageCarousel({ images, alt }: { images: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden bg-black">
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`${alt} ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        />
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={(e) => { e.preventDefault(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all backdrop-blur-sm shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all backdrop-blur-sm shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-primary-500 scale-125 shadow-[0_0_8px_rgba(210,27,46,0.8)]" : "bg-white/50 hover:bg-white/90"}`}
          />
        ))}
      </div>
    </div>
  );
}
