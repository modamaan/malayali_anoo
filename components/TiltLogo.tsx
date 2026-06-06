"use client";

import React, { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

export default function TiltLogo() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // The multiplier controls how extreme the 3D tilt is
    const rotX = ((y - centerY) / centerY) * -45;
    const rotY = ((x - centerX) / centerX) * 45;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setScale(1.05); // Slight pop-out effect
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
    setScale(1); // Return to original size
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center p-2 cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }} // This gives the 3D depth illusion
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          // Snappy response while hovering, smooth reset when mouse leaves
          transition: isHovering ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transformStyle: "preserve-3d"
        }}
      >
        <Image
          src="/logo_white-1.png"
          alt="Malayali Aano Logo"
          width={280}
          height={80}
          // Added a glowing red drop-shadow on hover to make it feel like it's floating above the navbar
          className={`w-48 sm:w-56 md:w-64 h-auto object-contain transition-all duration-300 ${isHovering
            ? 'drop-shadow-[0_15px_15px_rgba(229,9,20,0.4)]'
            : 'drop-shadow-none'
            }`}
          priority
          loading="eager"
        />
      </div>
    </div>
  );
}
