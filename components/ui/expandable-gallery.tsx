"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import React, { useState, useId, useRef, useMemo } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryPhoto {
  id: string;
  image_url: string;
  title: string | null;
}

interface ExpandableGalleryProps {
  photos: GalleryPhoto[];
}

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
} as const;

export function ExpandableGallery({ photos }: ExpandableGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const layoutGroupId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  // Calculate stacked positions deterministically based on index so it works with any number of photos
  const stackedPhotos = useMemo(() => {
    return photos.map((photo, index) => {
      // Deterministic pseudo-random values based on index
      const seed = index + 1;
      const rotation = ((seed * 37) % 30) - 15; // -15 to +15
      const x = ((seed * 53) % 120) - 60; // -60 to +60
      const y = ((seed * 71) % 40) - 20; // -20 to +20
      const zIndex = 100 - index; // First photo is on top

      return {
        ...photo,
        rotation,
        x,
        y,
        zIndex,
      };
    });
  }, [photos]);

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 glass w-full max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-2">No photos yet</h3>
        <p className="text-gray-400">Check back later for photos from our programs.</p>
      </div>
    );
  }

  return (
    <section className="relative w-full px-4 md:px-8 flex flex-col items-center justify-start overflow-hidden">
      <LayoutGroup id={layoutGroupId}>
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-full h-12 flex items-center justify-between px-4 mb-2">
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group z-50"
                >
                  <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors text-white">
                    <ArrowLeft size={20} />
                  </div>
                  <span className="font-medium">Go back</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            ref={containerRef}
            layout
            className={cn(
              "relative w-full",
              isExpanded
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4"
                : "flex flex-col items-center justify-start pt-4"
            )}
            transition={transition}
          >
            <div
              className={cn(
                "relative",
                isExpanded
                  ? "contents"
                  : "h-[350px] md:h-[400px] w-full flex items-center justify-center mb-4 mt-8"
              )}
            >
              {stackedPhotos.map((photo, index) => {
                // In stacked view, only render the top 5 to prevent DOM bloat and messy stacking
                const isPrimary = index < 5;
                if (!isPrimary && !isExpanded) return null;

                return (
                  <motion.div
                    key={`card-${photo.id}`}
                    layoutId={`card-container-${photo.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? photo.rotation : 0,
                      x: !isExpanded ? photo.x : 0,
                      y: !isExpanded ? photo.y : 0,
                      zIndex: !isExpanded ? photo.zIndex : 10,
                    }}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: photo.y - 15,
                            rotate: photo.rotation * 0.8,
                            zIndex: 150,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }
                        : { scale: 1.02 }
                    }
                    className={cn(
                      "cursor-pointer overflow-hidden glass",
                      isExpanded
                        ? "relative aspect-square rounded-xl border border-white/10 shadow-lg group"
                        : "absolute w-56 h-56 md:w-72 md:h-72 rounded-2xl border-4 border-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    )}
                    onClick={() => {
                      if (!isExpanded) {
                        setIsExpanded(true);
                      } else {
                        setSelectedIndex(index);
                      }
                    }}
                  >
                    <motion.div
                      layoutId={`image-inner-${photo.id}`}
                      layout="position"
                      className="w-full h-full relative"
                      transition={transition}
                    >
                      <Image
                        src={photo.image_url}
                        alt={photo.title || "Gallery photo"}
                        fill
                        className="object-cover select-none pointer-events-none"
                        sizes={
                          isExpanded
                            ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            : "300px"
                        }
                        priority={isPrimary}
                      />

                      {/* Title overlay when expanded */}
                      {isExpanded && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                          <h3 className="text-white font-bold text-xl drop-shadow-md">
                            {photo.title || "Gallery Image"}
                          </h3>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  key="stack-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-2xl space-y-8 z-10"
                >
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      onClick={() => setIsExpanded(true)}
                      className="rounded-full cursor-pointer py-6 px-8 border-border/40 font-bold group shadow-[0_0_20px_rgba(210,27,46,0.3)] hover:shadow-[0_0_30px_rgba(210,27,46,0.5)] transition-all"
                    >
                      Explore Gallery
                      <ArrowRight
                        className="transition-transform group-hover:translate-x-1 ml-2"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>

      {/* Lightbox / Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[101]"
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null) }}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Previous button */}
          {photos.length > 1 && (
            <button
              className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[101] hidden sm:block"
              onClick={(e) => {
                e.stopPropagation()
                let newIndex = selectedIndex - 1
                if (newIndex < 0) newIndex = photos.length - 1
                setSelectedIndex(newIndex)
              }}
              aria-label="Previous photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          {/* Main Image Container */}
          <div className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <div className="relative w-full h-full min-h-[50vh]">
              <Image
                src={stackedPhotos[selectedIndex].image_url}
                alt={stackedPhotos[selectedIndex].title || "Gallery photo"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            
            {stackedPhotos[selectedIndex].title && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-center">
                <p className="text-white font-bold text-xl drop-shadow-lg">
                  {stackedPhotos[selectedIndex].title}
                </p>
              </div>
            )}
          </div>

          {/* Next button */}
          {photos.length > 1 && (
            <button
              className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[101] hidden sm:block"
              onClick={(e) => {
                e.stopPropagation()
                let newIndex = selectedIndex + 1
                if (newIndex >= photos.length) newIndex = 0
                setSelectedIndex(newIndex)
              }}
              aria-label="Next photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}

          {/* Mobile swipe hints or basic nav if no mouse */}
          {photos.length > 1 && (
            <div className="absolute bottom-8 flex gap-4 sm:hidden z-[101]">
              <button
                className="p-3 text-white bg-black/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  let newIndex = selectedIndex - 1
                  if (newIndex < 0) newIndex = photos.length - 1
                  setSelectedIndex(newIndex)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                className="p-3 text-white bg-black/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  let newIndex = selectedIndex + 1
                  if (newIndex >= photos.length) newIndex = 0
                  setSelectedIndex(newIndex)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
