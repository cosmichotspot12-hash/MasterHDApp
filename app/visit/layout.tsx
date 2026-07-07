import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a Property Visit | HubliDharwad.app',
  description: 'Schedule a property visit in Hubli-Dharwad. We coordinate the visit for you.',
  alternates: { canonical: '/visit' },
}

export default function VisitLayout({ children }: { children: React.ReactNode }) {
  return children
}
