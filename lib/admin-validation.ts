import { LISTING_TYPES } from '@/lib/listing-types'
import { LOCALITIES } from '@/lib/localities'

type Payload = Record<string, unknown>

// Snap known localities onto their canonical spelling (case-insensitive) so
// admin grouping/matching stays consistent; unknown localities kept as typed.
const LOCALITY_BY_LOWER = new Map(LOCALITIES.map((l) => [l.toLowerCase(), l]))

function canonicalLocality(text: string) {
  return LOCALITY_BY_LOWER.get(text.toLowerCase()) ?? text
}

const LISTING_STATUSES = ['draft', 'active', 'rented_sold', 'inactive']
const PROPERTY_CATEGORIES = ['apartment', 'independent_house', 'house_in_layout', 'commercial', 'plot']
const OWNER_STATUSES = ['new', 'contacted', 'visit_scheduled', 'listed', 'rejected']
const REQUIREMENT_STATUSES = ['new', 'contacted', 'matched', 'fulfilled', 'no_match', 'converted', 'closed', 'dropped']
const VISIT_STATUSES = ['new', 'contacted', 'visit_scheduled', 'visit_done', 'converted', 'dropped']
const SOURCES = ['website', 'google_form', 'instagram', 'whatsapp', 'referral', 'walk_in', 'manual']
const DEAL_TYPES = LISTING_TYPES

const LISTING_TEXT_FIELDS = [
  'listing_type',
  'property_category',
  'city',
  'locality',
  'landmark',
  'google_maps_url',
  'title',
  'society_building_name',
  'bhk_count',
  'bathrooms',
  'age_of_property',
  'water_supply',
  'facing',
  'furnishing',
  'maintenance_charges',
  'available_from',
  'preferred_tenants',
  'food_preference',
  'description',
  'nearby_places',
  'youtube_url',
  'owner_name',
  'owner_phone',
  'status',
  'date_listed',
  'follow_up_date',
  'internal_notes',
  'slug',
] as const

const LISTING_NUMBER_FIELDS = ['price', 'deposit_amount', 'property_floor', 'total_floors'] as const

const LISTING_BOOLEAN_FIELDS = [
  'is_ground_floor',
  'negotiable',
  'pets_allowed',
  'female_bachelors_allowed',
  'lift',
  'power_backup',
  'water_24_7',
  'cctv',
  'security_guard',
  'car_parking',
  'two_wheeler_parking',
  'gym',
  'garden',
  'swimming_pool',
  'is_featured',
] as const

function asPayload(value: unknown): Payload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid request body.')
  return value as Payload
}

function asText(value: unknown, maxLength = 1000) {
  if (value === null || value === undefined) return null
  return String(value).trim().slice(0, maxLength)
}

function asNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) return null
  return Math.round(number)
}

function asBoolean(value: unknown) {
  return value === true
}

function asChoice(value: unknown, allowed: readonly string[], field: string) {
  const text = asText(value, 80)
  if (!text || !allowed.includes(text)) throw new Error(`Invalid ${field}.`)
  return text
}

function requireText(body: Payload, field: string, maxLength = 160) {
  const text = asText(body[field], maxLength)
  if (!text) throw new Error(`Missing ${field}.`)
  return text
}

function compact<T extends Payload>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>
}

function assertHasFields(value: Payload) {
  if (Object.keys(value).length === 0) throw new Error('No valid fields to update.')
}

export function sanitizeListingPayload(input: unknown, mode: 'create' | 'update') {
  const body = asPayload(input)
  const listing: Payload = {}

  for (const field of LISTING_TEXT_FIELDS) {
    if (field in body) listing[field] = asText(body[field], field === 'description' || field === 'internal_notes' ? 2000 : 300)
  }
  for (const field of LISTING_NUMBER_FIELDS) {
    if (field in body) listing[field] = asNumber(body[field])
  }
  for (const field of LISTING_BOOLEAN_FIELDS) {
    if (field in body) listing[field] = asBoolean(body[field])
  }
  if ('photos' in body) {
    listing.photos = Array.isArray(body.photos)
      ? body.photos.map((photo) => asText(photo, 600)).filter(Boolean).slice(0, 8)
      : []
  }

  if (typeof listing.locality === 'string' && listing.locality) {
    listing.locality = canonicalLocality(listing.locality)
  }

  if (listing.listing_type) listing.listing_type = asChoice(listing.listing_type, LISTING_TYPES, 'listing_type')
  if (listing.status) listing.status = asChoice(listing.status, LISTING_STATUSES, 'status')
  if (listing.property_category) listing.property_category = asChoice(listing.property_category, PROPERTY_CATEGORIES, 'property_category')

  if (mode === 'create') {
    for (const field of ['title', 'locality', 'owner_name', 'owner_phone']) requireText(listing, field)
    if (!listing.price) throw new Error('Missing price.')
  }

  assertHasFields(listing)
  return compact(listing)
}

export function sanitizeOwnerSubmissionPayload(input: unknown) {
  const body = asPayload(input)
  return {
    owner_name: requireText(body, 'owner_name', 80),
    owner_phone: requireText(body, 'owner_phone', 20),
    listing_type: asChoice(body.listing_type, LISTING_TYPES, 'listing_type'),
    locality: canonicalLocality(requireText(body, 'locality', 100)),
    expected_price: asNumber(body.expected_price),
    source: 'source' in body ? asChoice(body.source, SOURCES, 'source') : 'manual',
    status: 'status' in body ? asChoice(body.status, OWNER_STATUSES, 'status') : 'new',
  }
}

export function sanitizeOwnerSubmissionPatch(input: unknown) {
  const body = asPayload(input)
  const patch: Payload = {}
  if ('status' in body) patch.status = asChoice(body.status, OWNER_STATUSES, 'status')
  if ('source' in body) patch.source = asChoice(body.source, SOURCES, 'source')
  assertHasFields(patch)
  return patch
}

export function sanitizeRequirementPatch(input: unknown) {
  const body = asPayload(input)
  const patch: Payload = {}
  if ('status' in body) patch.status = asChoice(body.status, REQUIREMENT_STATUSES, 'status')
  if ('source' in body) patch.source = asChoice(body.source, SOURCES, 'source')
  assertHasFields(patch)
  return patch
}

export function sanitizeVisitRequestPatch(input: unknown) {
  const body = asPayload(input)
  const patch: Payload = {}
  if ('status' in body) patch.status = asChoice(body.status, VISIT_STATUSES, 'status')
  if ('source' in body) patch.source = asChoice(body.source, SOURCES, 'source')
  assertHasFields(patch)
  return patch
}

export function sanitizeDealPayload(input: unknown) {
  const body = asPayload(input)
  return {
    listing_id: asText(body.listing_id, 80) || null,
    requirement_id: asText(body.requirement_id, 80) || null,
    property_title: asText(body.property_title, 200),
    seeker_name: asText(body.seeker_name, 100),
    seeker_phone: asText(body.seeker_phone, 20),
    deal_type: asChoice(body.deal_type, DEAL_TYPES, 'deal_type'),
    fee_earned: asNumber(body.fee_earned) || 0,
    closed_date: asText(body.closed_date, 20) || new Date().toISOString().slice(0, 10),
    notes: asText(body.notes, 1000),
  }
}
