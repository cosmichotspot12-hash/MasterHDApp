import { redirect } from 'next/navigation'

export default function LeaseRedirect() {
  redirect('/properties?type=lease')
}
