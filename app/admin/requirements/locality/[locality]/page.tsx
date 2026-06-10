import { redirect } from 'next/navigation'

export default async function RequirementsLocalityPage({ params }: { params: Promise<{ locality: string }> }) {
  const { locality: localityParam } = await params
  redirect('/admin/requirements/locality?name=' + encodeURIComponent(localityParam))
}
