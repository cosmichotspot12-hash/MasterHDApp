import { NextRequest, NextResponse } from 'next/server'
import { hasRecentOwnerSubmission } from '@/lib/lead-dedupe'
import { validateOwnerSubmission } from '@/lib/lead-validation'
import { assertRateLimit, isRateLimitError } from '@/lib/rate-limit'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(request, 'owner-submissions', { max: 5, windowMs: 10 * 60 * 1000 })
    const body = await request.json()
    const submission = validateOwnerSubmission(body)
    if (await hasRecentOwnerSubmission(submission)) {
      return NextResponse.json({ success: true, duplicate: true })
    }
    const { error } = await supabaseAdmin
      .from('owner_submissions')
      .insert([submission])
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to submit right now.'
    return NextResponse.json({ error: message }, { status: isRateLimitError(err) ? 429 : 400 })
  }
}
