import { createClient } from '@/lib/supabase/server'
import ShopAdminClient from './ShopAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminShopPage() {
  const supabase = await createClient()

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  const { data: shopColors, error: colorsError } = await supabase
    .from('shop_colors')
    .select('*')
    .order('created_at', { ascending: true })

  if (productsError) {
    console.error("Error fetching products:", productsError.message)
  }
  
  if (colorsError) {
    console.error("Error fetching colors:", colorsError.message)
  }

  return (
    <div className="space-y-6">
      <ShopAdminClient 
        initialProducts={products || []} 
        dbColors={shopColors || []}
      />
    </div>
  )
}
