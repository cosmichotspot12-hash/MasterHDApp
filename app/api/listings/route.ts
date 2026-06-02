import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const bhk = searchParams.get('bhk')
    const locality = searchParams.get('locality')

    let query = supabaseAdmin
      .from('listings')
      .select('id, title, slug, listing_type, property_category, locality, price, bhk_count, furnishing, photos, youtube_url, is_featured, negotiable, status, facing, preferred_tenants, food_preference')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (type) query = query.eq('listing_type', type)
    if (category) query = query.eq('property_category', category)
    if (bhk) query = query.eq('bhk_count', bhk)
    if (locality) query = query.ilike('locality', '%' + locality + '%')

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}