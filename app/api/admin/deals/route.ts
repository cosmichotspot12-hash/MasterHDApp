import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { adminUnauthorized, isAdminRequest } from '@/lib/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return adminUnauthorized()

  try {
    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('*')
      .order('closed_date', { ascending: false })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return adminUnauthorized()

  try {
    const body = await request.json()

    const deal = {
      listing_id: body.listing_id || null,
      requirement_id: body.requirement_id || null,
      property_title: body.property_title || null,
      seeker_name: body.seeker_name || null,
      seeker_phone: body.seeker_phone || null,
      deal_type: body.deal_type,
      fee_earned: Number(body.fee_earned) || 0,
      closed_date: body.closed_date || new Date().toISOString().slice(0, 10),
      notes: body.notes || null,
    }

    const { error: dealError } = await supabaseAdmin.from('deals').insert([deal])
    if (dealError) throw dealError

    // Closing a deal also retires the listing and fulfils the requirement.
    if (deal.listing_id) {
      await supabaseAdmin.from('listings').update({ status: 'rented_sold' }).eq('id', deal.listing_id)
    }
    if (deal.requirement_id) {
      await supabaseAdmin.from('requirements').update({ status: 'fulfilled' }).eq('id', deal.requirement_id)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
