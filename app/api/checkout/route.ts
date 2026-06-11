import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import type { CartItem } from '@/lib/cart-context'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

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
  try {
    const { items }: { items: CartItem[] } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const currencySymbol = items[0]?.product.currency || '£'
    const currency = CURRENCY_MAP[currencySymbol] || 'gbp'

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.product.name,
          description: [
            item.selectedSize ? `Size: ${item.selectedSize}` : null,
            item.selectedColor ? `Color: ${getColorName(item.selectedColor)}` : null,
          ]
            .filter(Boolean)
            .join(' | ') || item.product.description || '',
          images: item.product.images?.slice(0, 1) || [],
          metadata: {
            productId: item.product.id,
            size: item.selectedSize || '',
            color: item.selectedColor || '',
          },
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }))

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
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
