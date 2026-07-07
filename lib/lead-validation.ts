import { LISTING_TYPES } from '@/lib/listing-types'
import { LOCALITIES } from '@/lib/localities'

type LeadPayload = Record<string, unknown>

function asText(value: unknown, maxLength = 160) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

// Case-insensitive lookup so free-typed casing/whitespace collapses onto the
// canonical spelling. Keeps admin grouping/matching (which compares locality
// strings) from fragmenting. Unknown localities are kept as typed (trimmed).
const LOCALITY_BY_LOWER = new Map(LOCALITIES.map((l) => [l.toLowerCase(), l]))

function normalizeLocality(value: unknown, maxLength = 120) {
  const text = asText(value, maxLength)
  return LOCALITY_BY_LOWER.get(text.toLowerCase()) ?? text
}

function asNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : null
}

function asChoice(value: unknown, allowed: string[], fallback: string) {
  const text = asText(value)
  return allowed.includes(text) ? text : fallback
}

function normalizePhone(value: unknown) {
  const phone = asText(value).replace(/\D/g, '')
  if (phone.length === 10) return phone
  if (phone.length === 12 && phone.startsWith('91')) return phone.slice(2)
  return ''
}

export function validateOwnerSubmission(body: LeadPayload) {
  const owner_name = asText(body.owner_name, 80)
  const owner_phone = normalizePhone(body.owner_phone)
  const locality = normalizeLocality(body.locality, 100)

  if (!owner_name || !owner_phone || !locality) {
    throw new Error('Please enter your name, 10-digit phone number, and locality.')
  }

  return {
    owner_name,
    owner_phone,
    listing_type: asChoice(body.listing_type, [...LISTING_TYPES], 'rent'),
    locality,
    expected_price: asNumber(body.expected_price),
    status: 'new',
  }
}

export function validateRequirement(body: LeadPayload) {
  const finder_name = asText(body.finder_name, 80)
  const finder_phone = normalizePhone(body.finder_phone)
  const locality_preference = normalizeLocality(body.locality_preference, 120)
  const budget_max = asNumber(body.budget_max)

  if (!finder_name || !finder_phone || !locality_preference || !budget_max) {
    throw new Error('Please enter your name, 10-digit phone number, locality, and maximum budget.')
  }

  return {
    finder_name,
    finder_phone,
    listing_type: asChoice(body.listing_type, [...LISTING_TYPES], 'rent'),
    property_category: asChoice(
      body.property_category,
      ['apartment', 'independent_house', 'house_in_layout', 'commercial', 'plot'],
      'apartment'
    ),
    bhk_count: asChoice(body.bhk_count, ['any', '1', '2', '3', '4+'], 'any'),
    locality_preference,
    budget_min: asNumber(body.budget_min),
    budget_max,
    furnishing_preference: asChoice(body.furnishing_preference, ['any', 'furnished', 'semi_furnished', 'unfurnished'], 'any'),
    timeline: asChoice(body.timeline, ['immediately', 'within_1_month', 'within_3_months', 'just_exploring'], 'immediately'),
    tenant_type: asChoice(body.tenant_type, ['family', 'bachelor', 'student'], 'family'),
    food_preference: asChoice(body.food_preference, ['veg', 'non_veg'], 'veg'),
    facing_preference: asChoice(body.facing_preference, ['any', 'east', 'west', 'north', 'south'], 'any'),
    special_requirements: asText(body.special_requirements, 600) || null,
    status: 'new',
  }
}

export function validateVisitRequest(body: LeadPayload) {
  const finder_name = asText(body.finder_name, 80)
  const finder_phone = normalizePhone(body.finder_phone)
  const preferred_day = asText(body.preferred_day, 20)

  if (!finder_name || !finder_phone || !preferred_day) {
    throw new Error('Please enter your name, 10-digit phone number, and preferred day.')
  }

  return {
    finder_name,
    finder_phone,
    preferred_day,
    preferred_time: asChoice(body.preferred_time, ['morning', 'afternoon', 'evening'], 'morning'),
    message: asText(body.message, 500) || null,
    listing_id: asText(body.listing_id, 80) || null,
    property_title: asText(body.property_title, 160) || 'General Inquiry',
    status: 'new',
  }
}
