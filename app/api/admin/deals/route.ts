import { NextRequest, NextResponse } from 'next/server'
import { adminForbidden, adminUnauthorized, isAdminRequest, isSameOriginRequest } from '@/lib/admin-auth'
import { getErrorMessage } from '@/lib/api-errors'
import { sanitizeDealPayload } from '@/lib/admin-validation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('*')
      .order('closed_date', { ascending: false })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return adminForbidden('Invalid request origin')
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const deal = sanitizeDealPayload(await request.json())

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
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 })
  }
}
