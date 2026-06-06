import { redirect } from 'next/navigation'

export default function SalePage() {
  redirect('/properties?type=sale')
}
