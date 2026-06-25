"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type PortfolioVideo = {
  id: string;
  title: string;
  thumbnail_url: string;
  link: string;
  date: string;
  trending: boolean;
};

const ITEMS_PER_PAGE = 12;

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function PortfolioGrid({ 
  initialVideos, 
  initialHasMore,
  categories = []
}: { 
  initialVideos: PortfolioVideo[], 
  initialHasMore: boolean,
  categories?: { title: string }[]
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams.get('category');

  const [activeFilter, setActiveFilter] = useState(initialCategory || "Latest");
  const [videos, setVideos] = useState<PortfolioVideo[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  
  // Sync filter when URL params change
  useEffect(() => {
    const category = searchParams.get('category') || "Latest";
    setActiveFilter(category);
  }, [searchParams]);

  // Track first mount so we don't re-fetch "Latest" immediately
  const isFirstMount = useRef(true);

  const filters = ["Latest", "Trending", "Shorts", ...categories.map(c => c.title)];
  const supabase = createClient();

  const fetchVideos = useCallback(async (filter: string, pageNum: number, isInitial: boolean) => {
    if (isInitial) setLoading(true);
    else setFetchingMore(true);

    const from = pageNum * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('portfolio_videos')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to);

    if (filter === "Trending") {
      query = query.eq('trending', true);
    } else if (filter === "Shorts") {
      query = query.ilike('link', '%/shorts/%');
    } else if (filter !== "Latest") {
      query = query.eq('category', filter);
    }

    const { data, count } = await query;

    if (data) {
      if (isInitial) {
        setVideos(data);
      } else {
        setVideos((prev) => [...prev, ...data]);
      }
      
      if (count !== null) {
        setHasMore(from + data.length < count);
      } else {
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    }
    
    if (isInitial) setLoading(false);
    else setFetchingMore(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter changes, reset page and fetch
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    setPage(0);
    setVideos([]);
    setHasMore(true);
    fetchVideos(activeFilter, 0, true);
  }, [activeFilter, fetchVideos]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(activeFilter, nextPage, false);
  };

  const handleVideoClick = (e: React.MouseEvent, url: string) => {
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      e.preventDefault();
      setPlayingVideoId(youtubeId);
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="relative w-full max-w-full mb-12 mt-12 group">
        {/* Fading Edges for better UX to indicate scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#111] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#111] to-transparent pointer-events-none z-10" />
        
        <div className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-4 pb-4 snap-x px-4 md:px-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (filter === "Latest") {
                  params.delete('category');
                } else {
                  params.set('category', filter);
                }
                router.push(pathname + '?' + params.toString(), { scroll: false });
              }}
              className={`shrink-0 snap-start px-6 py-2.5 rounded-full font-medium text-sm transition-all border ${
                activeFilter === filter 
                  ? "bg-primary-600 border-primary-500 text-white shadow-[0_0_15px_rgba(210,27,46,0.4)]" 
                  : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full animate-fade-in-up">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No videos found. Check back later!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 text-left">
              {videos.map((video, index) => (
                <a
                  href={video.link}
                  key={video.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleVideoClick(e, video.link)}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#1a1a1d] border border-white/[0.06] hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(210,27,46,0.15)] cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={index < 6}
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
                    <p className="text-primary-500 font-mono text-[10px] uppercase tracking-wider mb-1.5">{video.date}</p>
                    <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={fetchingMore}
                  className="px-10 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full transition-colors border border-white/10 disabled:opacity-50"
                >
                  {fetchingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal Overlay */}
      {playingVideoId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/90 backdrop-blur-sm"
          onClick={() => setPlayingVideoId(null)}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setPlayingVideoId(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-primary-500 text-white rounded-full flex items-center justify-center transition-colors border border-white/10"
              aria-label="Close video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
