import { NextRequest } from 'next/server'

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local'
}

export function assertRateLimit(
  request: NextRequest,
  scope: string,
  options: { max: number; windowMs: number }
) {
  const key = `${scope}:${getClientIp(request)}`
  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return
  }

  current.count += 1

  if (current.count > options.max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    const error = new Error(`Too many submissions. Please try again in ${retryAfterSeconds} seconds.`)
    error.name = 'RateLimitError'
    throw error
  }
}

export function isRateLimitError(error: unknown) {
  return error instanceof Error && error.name === 'RateLimitError'
}
