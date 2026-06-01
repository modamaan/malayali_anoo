"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_BANNERS } from "@/lib/data";

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_BANNERS.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_BANNERS.length) % MOCK_BANNERS.length);
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {MOCK_BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="object-cover w-full h-full"
            />
            {/* Gradient Overlay similar to Colors TV to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-20 flex flex-col justify-center h-full max-w-7xl mx-auto px-10 sm:px-16 lg:px-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-tight mb-4 max-w-2xl animate-fade-in-up">
              {banner.title}
            </h2>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl">
              {banner.subtitle}
            </p>
            <div>
              <Link
                href={banner.link}
                className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-full transition-all hover:scale-105"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-primary-600 backdrop-blur-sm text-white rounded-full transition-colors"
        aria-label="Previous banner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-primary-600 backdrop-blur-sm text-white rounded-full transition-colors"
        aria-label="Next banner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {MOCK_BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-primary-500 scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
