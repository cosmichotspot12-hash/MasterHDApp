import { NextRequest, NextResponse } from 'next/server'
import { adminForbidden, adminUnauthorized, isAdminRequest, isSameOriginRequest } from '@/lib/admin-auth'
import { getErrorMessage } from '@/lib/api-errors'
import { sanitizeListingPayload } from '@/lib/admin-validation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(request)) return adminForbidden('Invalid request origin')
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { id } = await params
    const body = sanitizeListingPayload(await request.json(), 'update')
    const { error } = await supabaseAdmin
      .from('listings')
      .update(body)
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(request)) return adminForbidden('Invalid request origin')
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { id } = await params
    const { error } = await supabaseAdmin
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}
