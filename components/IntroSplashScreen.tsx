"use client";

import { useState, useEffect, useRef } from "react";

export default function IntroSplashScreen() {
  const [showIntro, setShowIntro] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Must start muted to autoplay
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Check screen size for mobile video
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }

    // Check if the user has already seen the intro during this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro_v2");
    
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const finishIntro = () => {
    setIsFadingOut(true);
    sessionStorage.setItem("hasSeenIntro_v2", "true");
    
    // Completely unmount after transition finishes
    setTimeout(() => {
      setShowIntro(false);
    }, 1000);
  };

  if (!isMounted || !showIntro) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        key={isMobile ? "mobile" : "desktop"}
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={finishIntro}
      >
        <source src={isMobile ? "/malayali_intro_mobile.mp4" : "/malayali_new_intro.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Subtle gradient overlay on the video itself */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

      {/* Unmute Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute bottom-10 right-10 z-[105] w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg group"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      <button
        onClick={finishIntro}
        className="absolute bottom-10 right-28 z-[110] px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur-md transition-all hover:scale-105 border border-white/20 shadow-xl uppercase tracking-wider text-xs md:text-sm"
      >
        Skip Intro
      </button>
    </div>
  );
}
