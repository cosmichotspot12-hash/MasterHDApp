export const LISTING_TYPES = ['rent', 'sale', 'lease'] as const

export type ListingType = (typeof LISTING_TYPES)[number]

export function isListingType(value: unknown): value is ListingType {
  return typeof value === 'string' && LISTING_TYPES.includes(value as ListingType)
}

export function listingTypeLabel(value?: string | null) {
  if (value === 'sale') return 'Sale'
  if (value === 'lease') return 'Lease'
  return 'Rent'
}

export function listingTypeActionLabel(value?: string | null) {
  if (value === 'sale') return 'Buy'
  if (value === 'lease') return 'Lease'
  return 'Rent'
}

export function listingTypeForLabel(value?: string | null) {
  if (value === 'sale') return 'For Sale'
  if (value === 'lease') return 'For Lease'
  return 'For Rent'
}

export function listingTypeClosedLabel(value?: string | null) {
  if (value === 'sale') return 'Sold'
  if (value === 'lease') return 'Leased'
  return 'Rented'
}

export function listingTypeVerb(value?: string | null) {
  if (value === 'sale') return 'Selling'
  if (value === 'lease') return 'Leasing out'
  return 'Renting out'
}

export function listingTypeNoun(value?: string | null) {
  if (value === 'sale') return 'sale'
  if (value === 'lease') return 'lease'
  return 'rent'
}

export function listingTypeI18nKey(value?: string | null) {
  if (value === 'sale') return 'nav_sale'
  if (value === 'lease') return 'nav_lease'
  return 'nav_rent'
}

export function listingTypeForI18nKey(value?: string | null) {
  if (value === 'sale') return 'label_for_sale'
  if (value === 'lease') return 'label_for_lease'
  return 'label_for_rent'
}

export function hasRecurringPrice(value?: string | null) {
  return value === 'rent'
}

export function hasRentalPreferences(value?: string | null) {
  return value === 'rent' || value === 'lease'
}
