import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_AUTH_COOKIE, adminCookieOptions, getAdminSessionValue } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_AUTH_COOKIE, getAdminSessionValue(), adminCookieOptions)
    return response
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
