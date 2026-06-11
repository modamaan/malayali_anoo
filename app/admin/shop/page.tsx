import { createClient } from '@/lib/supabase/server'
import ShopAdminClient from './ShopAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminShopPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error("Error fetching products:", error.message)
  }

  return (
    <div className="space-y-6">
      <ShopAdminClient initialProducts={products || []} />
    </div>
  )
}
