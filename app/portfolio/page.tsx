import PortfolioGrid from "@/components/PortfolioGrid";
import { createPublicClient } from "@/lib/supabase/public";
import { Suspense } from "react";

export const revalidate = 0; // Always fetch fresh data

export const metadata = {
  title: 'Portfolio | Malayali Aaanoo',
  description: 'Explore our latest podcasts, exclusive interviews, and engaging talk shows.',
}

export default async function PortfolioPage() {
  const supabase = createPublicClient();

  // Fetch initial videos and categories on server (first page only)
  const { data: initialVideos, count } = await supabase
    .from('portfolio_videos')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .limit(12);

  const hasMore = count !== null ? (initialVideos?.length || 0) < count : false;

  const { data: categoriesData } = await supabase.from('video_categories').select('title').order('sort_order');
  const categories = categoriesData || [];

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-24 overflow-hidden">
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">WORK</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-8">
          Explore our latest podcasts, exclusive interviews, and engaging talk shows.
        </p>

        {/* Client Component handles interactivity, filtering, and pagination */}
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading videos...</div>}>
          <PortfolioGrid initialVideos={initialVideos || []} initialHasMore={hasMore} categories={categories} />
        </Suspense>

      </section>
    </div>
  );
}
