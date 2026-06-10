import { RequirementsLocalityView } from './locality-view'

export default async function RequirementsLocalityPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string | string[] }>
}) {
  const params = await searchParams
  const locality = Array.isArray(params.name) ? params.name[0] || '' : params.name || ''

  return <RequirementsLocalityView locality={locality} />
}
