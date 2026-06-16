import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_AUTH_COOKIE,
  adminForbidden,
  adminCookieOptions,
  createAdminSessionToken,
  isSameOriginRequest,
  isValidAdminPassword,
} from '@/lib/admin-auth'

const WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function getClientKey(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}

function isRateLimited(request: NextRequest) {
  const key = getClientKey(request)
  const now = Date.now()
  const current = loginAttempts.get(key)

  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > MAX_ATTEMPTS
}

function clearRateLimit(request: NextRequest) {
  loginAttempts.delete(getClientKey(request))
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return adminForbidden('Invalid request origin')

  if (isRateLimited(request)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again in a few minutes.' }, { status: 429 })
  }

  const { password } = await request.json()

  if (await isValidAdminPassword(password)) {
    clearRateLimit(request)
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_AUTH_COOKIE, await createAdminSessionToken(), adminCookieOptions)
    return response
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
