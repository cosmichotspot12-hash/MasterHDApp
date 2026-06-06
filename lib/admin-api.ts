import { cookies } from 'next/headers'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

export async function adminApiHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_AUTH_COOKIE)?.value

  return session
    ? { Cookie: `${ADMIN_AUTH_COOKIE}=${encodeURIComponent(session)}` }
    : {}
}
