import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_AUTH_COOKIE = 'admin_auth'

export function getAdminSessionValue() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

export function isValidAdminSession(value: string | undefined) {
  const expected = getAdminSessionValue()
  return Boolean(expected && value && value === expected)
}

export function isAdminRequest(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)
}

export function adminUnauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
}
