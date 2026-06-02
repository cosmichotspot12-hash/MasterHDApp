import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('id, title, slug, listing_type, property_category, city, locality, landmark, google_maps_url, society_building_name, bhk_count, bathrooms, property_floor, total_floors, is_ground_floor, age_of_property, water_supply, facing, furnishing, price, negotiable, deposit_amount, maintenance_charges, available_from, preferred_tenants, food_preference, pets_allowed, female_bachelors_allowed, lift, power_backup, water_24_7, cctv, security_guard, car_parking, two_wheeler_parking, gym, garden, swimming_pool, description, nearby_places, photos, youtube_url, is_featured, status')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}