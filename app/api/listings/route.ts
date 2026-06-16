import { NextRequest, NextResponse } from 'next/server'
import { getPublicListings } from '@/lib/listings-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const bhk = searchParams.get('bhk')
    const locality = searchParams.get('locality')
    const view = searchParams.get('view')
    const sort = searchParams.get('sort')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Number(limitParam) : undefined
    const data = await getPublicListings({
      view: view === 'closed' ? 'closed' : 'available',
      type,
      category,
      bhk,
      locality,
      sort: sort === 'recent' ? 'recent' : 'featured',
      limit,
    })
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to fetch listings'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
