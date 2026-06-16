import { NextRequest, NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/api-errors'
import { hasRecentRequirement } from '@/lib/lead-dedupe'
import { validateRequirement } from '@/lib/lead-validation'
import { assertRateLimit, isRateLimitError } from '@/lib/rate-limit'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('requirements')
      .select('id')
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err, 'Unable to fetch requirements') }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(request, 'requirements', { max: 5, windowMs: 10 * 60 * 1000 })
    const body = await request.json()
    const requirement = validateRequirement(body)
    if (await hasRecentRequirement(requirement)) {
      return NextResponse.json({ success: true, duplicate: true })
    }
    const { error } = await supabaseAdmin
      .from('requirements')
      .insert([requirement])
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to submit right now.'
    return NextResponse.json({ error: message }, { status: isRateLimitError(err) ? 429 : 400 })
  }
}
