"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type PortfolioVideo = {
  id: string;
  title: string;
  thumbnail_url: string;
  link: string;
  date: string;
  trending: boolean;
};

const ITEMS_PER_PAGE = 12;

export default function PortfolioGrid({ 
  initialVideos, 
  initialHasMore 
}: { 
  initialVideos: PortfolioVideo[], 
  initialHasMore: boolean 
}) {
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [videos, setVideos] = useState<PortfolioVideo[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(0);
  
  // Track first mount so we don't re-fetch "Latest" immediately
  const isFirstMount = useRef(true);

  const filters = ["Latest", "Trending", "Shorts"];
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

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 mt-12">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${activeFilter === filter ? "bg-primary-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
          >
            {filter}
          </button>
        ))}
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
              {videos.map((video) => (
                <Link
                  href={video.link}
                  key={video.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#1a1a1d] border border-white/[0.06] hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(210,27,46,0.15)]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-4">
                    <p className="text-primary-500 font-mono text-[10px] uppercase tracking-wider mb-1.5">{video.date}</p>
                    <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-primary-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </Link>
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
    </>
  );
}
