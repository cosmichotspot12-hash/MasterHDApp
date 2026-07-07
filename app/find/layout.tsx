import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find My Property in Hubli-Dharwad | HubliDharwad.app',
  description: 'Tell us what you are looking for. We will match you with the right property in Hubli-Dharwad and contact you directly.',
  alternates: { canonical: '/find' },
}

export default function FindLayout({ children }: { children: React.ReactNode }) {
  return children
}
