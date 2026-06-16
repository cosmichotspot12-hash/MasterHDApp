import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorized, isAdminRequest } from '@/lib/admin-auth'
import { getErrorMessage } from '@/lib/api-errors'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return adminUnauthorized()

  try {
    const { data, error } = await supabaseAdmin
      .from('visit_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}
