import { NextRequest, NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/api-errors'
import { getPublicListingBySlug } from '@/lib/listings-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const data = await getPublicListingBySlug(slug)
    if (!data) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}
