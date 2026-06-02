import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.delete('admin_auth')
  return response
}
