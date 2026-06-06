'use client'

import { usePathname } from 'next/navigation'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return children

  return (
    <>
      <SiteHeader />
      <div className="min-h-[calc(100vh-64px)]">{children}</div>
      <SiteFooter />
    </>
  )
}
