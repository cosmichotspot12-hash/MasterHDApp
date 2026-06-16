import { NextRequest, NextResponse } from 'next/server'
import { hasRecentVisitRequest } from '@/lib/lead-dedupe'
import { validateVisitRequest } from '@/lib/lead-validation'
import { assertRateLimit, isRateLimitError } from '@/lib/rate-limit'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(request, 'visit-requests', { max: 8, windowMs: 10 * 60 * 1000 })
    const body = await request.json()
    const visitRequest = validateVisitRequest(body)
    if (await hasRecentVisitRequest(visitRequest)) {
      return NextResponse.json({ success: true, duplicate: true })
    }
    const { error } = await supabaseAdmin
      .from('visit_requests')
      .insert([visitRequest])
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to submit right now.'
    return NextResponse.json({ error: message }, { status: isRateLimitError(err) ? 429 : 400 })
  }
}
