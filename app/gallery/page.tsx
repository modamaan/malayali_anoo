import { createPublicClient } from "@/lib/supabase/public"
import { ExpandableGallery } from "@/components/ui/expandable-gallery"

export const revalidate = 0 // Always fetch fresh data

export const metadata = {
  title: 'Gallery - Malayali Aaanoo',
  description: 'View photos from Malayali Aaanoo programs and events.',
}

export default async function GalleryPage() {
  const supabase = createPublicClient()

  const { data: gallery, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true })

  const { data: categoriesData } = await supabase
    .from("video_categories")
    .select("id, title")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching gallery:", error.message)
  }

  const items = gallery || []
  const categories = categoriesData || []

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="relative pt-8 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] pointer-events-none" />
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
            OUR <span className="text-primary-500">GALLERY</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            Capturing the best moments from Malayali Aaanoo events and programs.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <ExpandableGallery photos={items} categories={categories} />
    </div>
  )
}
