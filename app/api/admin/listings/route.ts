import { NextRequest, NextResponse } from 'next/server'
import { adminForbidden, adminUnauthorized, isAdminRequest, isSameOriginRequest } from '@/lib/admin-auth'
import { getErrorMessage } from '@/lib/api-errors'
import { sanitizeListingPayload } from '@/lib/admin-validation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return adminForbidden('Invalid request origin')
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const body = sanitizeListingPayload(await request.json(), 'create')
    
    const { error } = await supabaseAdmin
      .from('listings')
      .insert([body])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 })
  }
}
