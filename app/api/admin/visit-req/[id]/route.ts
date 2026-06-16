import { NextRequest, NextResponse } from 'next/server'
import { adminForbidden, adminUnauthorized, isAdminRequest, isSameOriginRequest } from '@/lib/admin-auth'
import { getErrorMessage } from '@/lib/api-errors'
import { sanitizeVisitRequestPatch } from '@/lib/admin-validation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(request)) return adminForbidden('Invalid request origin')
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { id } = await params
    const body = sanitizeVisitRequestPatch(await request.json())
    const { error } = await supabaseAdmin
      .from('visit_requests')
      .update(body)
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 })
  }
}
