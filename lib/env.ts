export function getPublicEnv(name: string, fallback?: string) {
  const value = process.env[name]
  if (value) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required environment variable: ${name}`)
}

export const APP_URL = getPublicEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
