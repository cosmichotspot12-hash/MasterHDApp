import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_AUTH_COOKIE = 'admin_auth'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function sha256(value: string) {
  return toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
}

async function sign(value: string) {
  const secret = getAdminSecret()
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)))
}

async function safeEqual(left: string, right: string) {
  return (await sha256(left)) === (await sha256(right))
}

export async function isValidAdminPassword(value: unknown) {
  return typeof value === 'string' && Boolean(process.env.ADMIN_PASSWORD && await safeEqual(value, process.env.ADMIN_PASSWORD))
}

export async function createAdminSessionToken(now = Date.now()) {
  const issuedAt = String(now)
  return `${issuedAt}.${await sign(issuedAt)}`
}

export async function isValidAdminSession(value: string | undefined) {
  const secret = getAdminSecret()
  if (!secret || !value) return false

  const [issuedAt, signature] = value.split('.')
  const issuedAtNumber = Number(issuedAt)
  if (!issuedAt || !signature || !Number.isFinite(issuedAtNumber)) return false

  const ageSeconds = Math.floor((Date.now() - issuedAtNumber) / 1000)
  if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) return false

  return safeEqual(signature, await sign(issuedAt))
}

export function isAdminRequest(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)
}

export function adminUnauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function adminForbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).origin === request.nextUrl.origin
  } catch {
    return false
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_MAX_AGE_SECONDS,
  path: '/',
}
