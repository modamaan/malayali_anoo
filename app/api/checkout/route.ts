import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

// ─── Rate Limiter (in-memory, per IP) ─────────────────────────────────────────
// Allows max 5 checkout attempts per IP per 60 seconds.
// Works well for a single-instance deployment (Vercel serverless functions).
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    // First request in this window, or window expired — start fresh
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false // Rate limit exceeded
  }

  entry.count++
  return true
}

// Map currency symbol to ISO code for Stripe
const CURRENCY_MAP: Record<string, string> = {
  '£': 'gbp',
  '€': 'eur',
  '₹': 'inr',
}

// Map common hex codes to readable names for Stripe checkout
const getColorName = (hex: string) => {
  const colors: Record<string, string> = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#800080': 'Purple',
    '#ffa500': 'Orange',
    '#808080': 'Grey',
    '#c0c0c0': 'Silver',
  }
  return colors[hex.toLowerCase()] || hex
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      { status: 429 }
    )
  }

  try {
    // Only accept an array of { productId, selectedSize, selectedColor, quantity }
    // We deliberately DO NOT accept price/name/images from the client
    const { items }: { items: { productId: string; selectedSize: string | null; selectedColor: string | null; quantity: number }[] } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate all product IDs are non-empty strings
    if (items.some(i => typeof i.productId !== 'string' || !i.productId)) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 })
    }

    // Fetch all products from the DATABASE — never trust client-sent prices
    const supabase = await createClient()
    const productIds = [...new Set(items.map(i => i.productId))]
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, description, price, currency, images')
      .in('id', productIds)

    if (dbError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: 'Products not found' }, { status: 404 })
    }

    // Build a lookup map for fast access
    const productMap = Object.fromEntries(dbProducts.map(p => [p.id, p]))

    // Verify all requested products exist in the DB
    for (const item of items) {
      if (!productMap[item.productId]) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
      }
    }

    // Use currency from the first DB product
    const firstProduct = productMap[items[0].productId]
    const currencySymbol = firstProduct.currency || '£'
    const currency = CURRENCY_MAP[currencySymbol] || 'gbp'

    // Build line items entirely from DB values — price manipulation is now impossible
    const line_items = items.map((item) => {
      const dbProduct = productMap[item.productId]
      return {
        price_data: {
          currency,
          product_data: {
            name: dbProduct.name,
            description: [
              item.selectedSize ? `Size: ${item.selectedSize}` : null,
              item.selectedColor ? `Color: ${getColorName(item.selectedColor)}` : null,
            ]
              .filter(Boolean)
              .join(' | ') || dbProduct.description || '',
            images: dbProduct.images?.slice(0, 1) || [],
            metadata: {
              productId: dbProduct.id,
              size: item.selectedSize || '',
              color: item.selectedColor || '',
            },
          },
          // ✅ Price is from DB — client has zero control over this
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: Math.max(1, Math.min(99, Math.round(item.quantity))), // clamp quantity 1–99
      }
    })

    // Use hardcoded env variable — never trust the Origin header
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['GB', 'IE', 'US', 'CA', 'AU', 'IN', 'AE', 'SG'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      success_url: `${origin}/shop?success=true`,
      cancel_url: `${origin}/shop?cancelled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('Stripe error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
