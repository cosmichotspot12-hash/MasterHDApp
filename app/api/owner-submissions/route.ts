import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateOwnerSubmission } from '@/lib/lead-validation'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const submission = validateOwnerSubmission(body)
    const { error } = await supabaseAdmin
      .from('owner_submissions')
      .insert([submission])
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to submit right now.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
