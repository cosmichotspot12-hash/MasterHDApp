'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LocalityCombobox from '@/components/locality-combobox'

type PropertyType = 'all' | 'rent' | 'sale' | 'lease'
type PropertyView = 'available' | 'closed'

export type FiltersState = {
  view: PropertyView
  type: PropertyType
  bhk: string
  category: string
  locality: string
}

const CATEGORIES_WITHOUT_BHK = new Set(['plot', 'commercial'])

function buildHref(state: FiltersState) {
  const query = new URLSearchParams()
  if (state.view === 'closed') query.set('view', 'closed')
  if (state.type !== 'all') query.set('type', state.type)
  // BHK has no meaning for plot/commercial — never carry it for those.
  if (state.bhk && !CATEGORIES_WITHOUT_BHK.has(state.category)) query.set('bhk', state.bhk)
  if (state.category) query.set('category', state.category)
  if (state.locality) query.set('locality', state.locality)

  const queryString = query.toString()
  return '/properties' + (queryString ? '?' + queryString : '')
}

const TYPE_TABS: { value: PropertyType; label: string; i18n: string }[] = [
  { value: 'all', label: 'All', i18n: 'properties_all' },
  { value: 'rent', label: 'Rent', i18n: 'nav_rent' },
  { value: 'sale', label: 'Sale', i18n: 'nav_buy' },
  { value: 'lease', label: 'Lease', i18n: 'nav_lease' },
]

export default function FiltersForm({ initial }: { initial: FiltersState }) {
  const router = useRouter()
  const [locality, setLocality] = useState(initial.locality)

  const bhkDisabled = CATEGORIES_WITHOUT_BHK.has(initial.category)

  // All navigation (tabs, selects, submit) preserves the locality text currently
  // typed in the box, even if it hasn't been "submitted" yet.
  function navigate(next: Partial<FiltersState>) {
    router.push(buildHref({ ...initial, ...next, locality: locality.trim() }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate({})
  }

  return (
    <div className="properties-toolbar">
      <nav className="properties-tabs" aria-label="Listing type filters">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={'properties-tab' + (initial.type === tab.value ? ' properties-tab-active' : '')}
            onClick={() => navigate({ type: tab.value })}
            data-i18n={tab.i18n}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <form onSubmit={onSubmit} className="properties-form">
        <select
          aria-label="BHK"
          value={bhkDisabled ? '' : initial.bhk}
          disabled={bhkDisabled}
          title={bhkDisabled ? 'BHK does not apply to this property type' : undefined}
          onChange={(e) => navigate({ bhk: e.target.value })}
        >
          <option value="">All BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4+">4+ BHK</option>
        </select>
        <select
          aria-label="Property category"
          value={initial.category}
          onChange={(e) => {
            const category = e.target.value
            // Drop BHK when switching to a category that has no BHK.
            navigate({ category, bhk: CATEGORIES_WITHOUT_BHK.has(category) ? '' : initial.bhk })
          }}
        >
          <option value="">All types</option>
          <option value="apartment">Apartment</option>
          <option value="independent_house">Independent house</option>
          <option value="house_in_layout">House in layout</option>
          <option value="commercial">Commercial</option>
          <option value="plot">Plot</option>
        </select>
        <div className="properties-search-field">
          <LocalityCombobox
            value={locality}
            onChange={setLocality}
            placeholder="Search locality"
            className=""
          />
          <button type="submit" className="properties-search-btn" aria-label="Search" title="Search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
