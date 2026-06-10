import { createClient } from '@/lib/supabase/server'
import CategoriesClient from './CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('video_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error.message)
  }

  return (
    <div className="space-y-6">
      <CategoriesClient initialCategories={categories || []} />
    </div>
  )
}
