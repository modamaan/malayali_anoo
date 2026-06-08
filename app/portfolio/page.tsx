import PortfolioGrid from "@/components/PortfolioGrid";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: 'Portfolio | Malayali Aaanoo',
  description: 'Explore our latest podcasts, exclusive interviews, and engaging talk shows.',
}

export default async function PortfolioPage() {
  const supabase = await createClient();
  
  // Fetch initial 12 videos securely on the server
  const { data: initialVideos, count } = await supabase
    .from('portfolio_videos')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .limit(12);

  const hasMore = count !== null ? (initialVideos?.length || 0) < count : false;

  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24 overflow-hidden">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">WORK</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-8">
          Explore our latest podcasts, exclusive interviews, and engaging talk shows.
        </p>

        {/* Client Component handles interactivity, filtering, and pagination */}
        <PortfolioGrid initialVideos={initialVideos || []} initialHasMore={hasMore} />
        
      </section>
    </div>
  );
}
