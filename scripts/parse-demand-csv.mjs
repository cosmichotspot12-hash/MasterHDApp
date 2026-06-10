// One-off parser: Google Form "Property Demand Data" CSV -> requirements-table-shaped preview.
// Reads:  public/Property Demand Data-350.csv
// Writes: requirements-import-preview.csv (review file — NO database writes)
// Usage:  node scripts/parse-demand-csv.mjs

import fs from 'node:fs'
import path from 'node:path'

const INPUT = path.resolve('public/Property Demand Data-350.csv')
const OUTPUT = path.resolve('requirements-import-preview.csv')

// ---------- CSV helpers ----------
function parseCSV(s) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = '' }
      else field += c
    }
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

function csvCell(v) {
  v = v == null ? '' : String(v)
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v
}

// ---------- field mappers ----------
function normalizePhone(raw) {
  let d = (raw || '').replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return d.length === 10 ? d : null
}

// "20k" -> 20000, "15-25k" -> [15000,25000], "40 lack" -> 4000000 (sale),
// "6 to 8" -> [6000,8000], "below 14000" -> [null,14000], "6000" -> 6000
function parseBudget(raw) {
  const flags = []
  const t = (raw || '').toLowerCase().trim()
  if (!t) return { min: null, max: null, listingType: 'rent', flags: ['no budget given'] }

  const lakh = /la?kh|lac|lack|lakhs/.test(t)
  const toNum = (numStr, hasK, hasLakh) => {
    let n = parseFloat(numStr.replace(/,/g, ''))
    if (isNaN(n)) return null
    if (hasLakh) n *= 100000
    else if (hasK) n *= 1000
    return Math.round(n)
  }

  // collect numbers with their suffix context
  const matches = [...t.matchAll(/(\d[\d,]*\.?\d*)\s*(k|la?kh?s?|lacs?|lacks?)?/g)]
    .filter(m => m[1])
  if (!matches.length) return { min: null, max: null, listingType: 'rent', flags: ['unparseable budget: ' + raw] }

  const anyK = matches.some(m => m[2] === 'k')
  const nums = matches.map(m => {
    const hasLakh = !!(m[2] && m[2] !== 'k') || (lakh && !m[2] && !anyK)
    return toNum(m[1], m[2] === 'k' || (anyK && !m[2] && !hasLakh), hasLakh)
  }).filter(n => n != null)

  if (!nums.length) return { min: null, max: null, listingType: 'rent', flags: ['unparseable budget: ' + raw] }

  let [a, b] = nums.length >= 2 ? [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])] : [null, nums[0]]

  // bare small numbers in a range like "6 to 8" mean thousands
  const fix = n => (n != null && n > 0 && n < 100 ? n * 1000 : n)
  a = fix(a); b = fix(b)

  if (/below|under|less|max|upto|up to|within/.test(t) && nums.length === 1) { a = null }
  else if (nums.length === 1) { a = null }

  // infer listing type: >= 2 lakh = sale
  const listingType = (b != null && b >= 200000) ? 'sale' : 'rent'
  if (b != null && b >= 100000 && b < 200000) flags.push('ambiguous budget scale: ' + raw)
  if (b != null && b < 1000) flags.push('suspiciously low budget: ' + raw)
  return { min: a, max: b, listingType, flags }
}

function parsePropertyType(raw) {
  const t = (raw || '').toLowerCase()
  if (t.includes('independent')) return { category: 'independent_house', bhk: 'any' }
  if (t.includes('room')) return { category: 'apartment', bhk: '1', note: 'wants single room' }
  const m = t.match(/(\d)\s*bhk/)
  if (m) return { category: 'apartment', bhk: m[1] === '4' ? '4+' : m[1] }
  return { category: 'apartment', bhk: 'any', flag: 'unknown property type: ' + raw }
}

function parseTimeline(raw) {
  const t = (raw || '').toLowerCase().trim()
  if (!t || t === 'yes' || t === '-') return 'just_exploring'
  if (/immediat|urgent|asap|as soon|now|this week|within a week|today|tomorrow|week/.test(t)) return 'immediately'
  if (/this month|next month|within a month|1 month|one month|15|10 day|20 day|month end|first week|1st week|feb|jan/.test(t)) return 'within_1_month'
  if (/2 month|3 month|march|april|may/.test(t)) return 'within_3_months'
  if (/next year|year|exploring|not sure|later/.test(t)) return 'just_exploring'
  return 'within_3_months' // free-text month names etc. — reviewed via flag
}

function parseTenantType(raw) {
  const t = (raw || '').toLowerCase()
  if (t.includes('student')) return 'student'
  if (t.includes('bachelor')) return 'bachelor'
  return 'family'
}

function parseFood(raw) {
  const t = (raw || '').toLowerCase()
  if (t.includes('non')) return 'non_veg'
  if (t.includes('veg')) return 'veg'
  return 'veg' // blank — least-restrictive for matching is debatable; flagged below
}

function parseFacing(raw) {
  const t = (raw || '').toLowerCase()
  if (/east/.test(t) && /west|north|south/.test(t)) return 'any'
  if (/east/.test(t)) return 'east'
  if (/west/.test(t)) return 'west'
  if (/north/.test(t)) return 'north'
  if (/south/.test(t)) return 'south'
  return 'any'
}

const LOCALITY_CANON = [
  [/vidya\s*nagar|vidyanagar/i, 'Vidyanagar'],
  [/keshwapur|kheswapur|keshvapur/i, 'Keshwapur'],
  [/gokul\s*road|gokul/i, 'Gokul Road'],
  [/shirur\s*park/i, 'Shirur Park'],
  [/akshay\s*(park|colony)/i, 'Akshay Park'],
  [/nava\s*nagar|navanagar/i, 'Navanagar'],
  [/bvb/i, 'BVB'],
  [/unkal|unnakal/i, 'Unkal'],
  [/lingraj\s*nagar/i, 'Lingraj Nagar'],
  [/manjunath\s*nagar/i, 'Manjunath Nagar'],
]

function primaryLocality(area, city) {
  const a = (area || '').trim()
  if (!a) return { locality: city || 'Hubli', flag: 'no area given, used city' }
  // canonical match anywhere in the text first (handles spelling variants)
  for (const [re, canon] of LOCALITY_CANON) if (re.test(a)) return { locality: canon }
  // else first segment before comma / slash / "or" / "and"
  const seg = a.split(/[,/]| or | and |&/i)[0].trim().replace(/\s+/g, ' ')
  const cleaned = seg.replace(/^near( by)?\s*/i, '').trim()
  return { locality: cleaned ? cleaned[0].toUpperCase() + cleaned.slice(1) : (city || 'Hubli') }
}

function parseTimestamp(raw) {
  // "1/2/2026 21:53:07" -> M/D/YYYY (Google Forms US-style)
  const m = (raw || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[ T](\d{1,2}):(\d{2}):(\d{2})/)
  if (!m) return null
  const [, mo, d, y, h, mi, s] = m.map(Number)
  const dt = new Date(Date.UTC(y, mo - 1, d, h - 5, mi - 30, s)) // IST -> UTC
  return isNaN(dt) ? null : dt.toISOString()
}

// ---------- main ----------
const txt = fs.readFileSync(INPUT, 'utf8').replace(/^﻿/, '')
const rows = parseCSV(txt)
const head = rows[0].map(h => h.trim())
const col = name => head.findIndex(h => h.toLowerCase().startsWith(name.toLowerCase()))
const idx = {
  ts: col('Timestamp'), name: col('Full Name'), phone: col('Mobile No'),
  city: col('Preferred City'), area: col('Preferred Area'), facing: col('Home Facing'),
  ptype: col('Property Type'), budget: col('Budget Range'), when: col('when Do you need'),
  lease1: col('Want to lease a house'), food: col('Food preferences'),
  who: col('What describes you'), lease2: col('Want to lease mention'),
}

const out = []
const byPhone = new Map()
let noPhone = 0

for (const r of rows.slice(1)) {
  if (!r.some(c => c && c.trim())) continue
  const get = i => (i >= 0 && r[i] ? r[i].trim() : '')
  const flags = []

  const phone = normalizePhone(get(idx.phone))
  if (!phone) { noPhone++; flags.push('INVALID PHONE: ' + get(idx.phone)) }

  const budget = parseBudget(get(idx.budget))
  flags.push(...budget.flags)

  const pt = parsePropertyType(get(idx.ptype))
  if (pt.flag) flags.push(pt.flag)

  const loc = primaryLocality(get(idx.area), get(idx.city))
  if (loc.flag) flags.push(loc.flag)

  const timelineRaw = get(idx.when)
  const timeline = parseTimeline(timelineRaw)

  if (!get(idx.food)) flags.push('no food preference given, defaulted veg')

  // preserve everything unmapped in special_requirements
  const extras = []
  if (get(idx.area)) extras.push('Areas: ' + get(idx.area))
  if (get(idx.facing)) extras.push('Facing note: ' + get(idx.facing))
  if (pt.note) extras.push(pt.note)
  if (timelineRaw) extras.push('Needed by: ' + timelineRaw)
  const leaseNote = [get(idx.lease1), get(idx.lease2)].filter(v => v && !/^(no|na|nil|-|nothing|n\/a)\.?$/i.test(v)).join(' | ')
  if (leaseNote) extras.push('Lease/notes: ' + leaseNote)
  extras.push('[GF-import]')

  const rec = {
    finder_name: get(idx.name) || 'Unknown',
    finder_phone: phone || get(idx.phone),
    listing_type: budget.listingType,
    property_category: pt.category,
    bhk_count: pt.bhk,
    locality_preference: loc.locality,
    budget_min: budget.min ?? '',
    budget_max: budget.max ?? '',
    furnishing_preference: 'any',
    timeline,
    tenant_type: parseTenantType(get(idx.who)),
    food_preference: parseFood(get(idx.food)),
    facing_preference: parseFacing(get(idx.facing)),
    special_requirements: extras.join(' • ').slice(0, 600),
    status: 'new',
    created_at: parseTimestamp(get(idx.ts)) || '',
    source: 'google_form',
    REVIEW_FLAGS: flags.join(' | '),
    RAW_BUDGET: get(idx.budget),
  }

  if (phone && byPhone.has(phone)) {
    const prev = byPhone.get(phone)
    prev.REVIEW_FLAGS = [prev.REVIEW_FLAGS, 'DUPLICATE phone — kept latest, earlier merged'].filter(Boolean).join(' | ')
    // keep the latest submission (rows are chronological)
    Object.assign(prev, rec, { REVIEW_FLAGS: prev.REVIEW_FLAGS })
  } else {
    if (phone) byPhone.set(phone, rec)
    out.push(rec)
  }
}

const cols = Object.keys(out[0])
const lines = [cols.join(',')]
for (const rec of out) lines.push(cols.map(c => csvCell(rec[c])).join(','))
fs.writeFileSync(OUTPUT, '﻿' + lines.join('\n'), 'utf8')

// ---------- summary ----------
const flagged = out.filter(r => r.REVIEW_FLAGS).length
const sale = out.filter(r => r.listing_type === 'sale').length
const tl = {}
out.forEach(r => tl[r.timeline] = (tl[r.timeline] || 0) + 1)
const locCount = {}
out.forEach(r => { const k = r.locality_preference.toLowerCase(); locCount[k] = (locCount[k] || 0) + 1 })
const topLoc = Object.entries(locCount).sort((a, b) => b[1] - a[1]).slice(0, 8)

console.log('Input rows:', rows.length - 1)
console.log('Output records (after dedupe):', out.length)
console.log('Invalid phones:', noPhone)
console.log('Inferred SALE seekers:', sale, '| RENT:', out.length - sale)
console.log('Timelines:', JSON.stringify(tl))
console.log('Top localities:', JSON.stringify(topLoc))
console.log('Rows with review flags:', flagged)
console.log('Preview written to:', OUTPUT)
