import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a Property Visit | MasterHD',
  description: 'Schedule a property visit in Hubli-Dharwad. We coordinate the visit for you.',
}

export default function VisitLayout({ children }: { children: React.ReactNode }) {
  return children
}