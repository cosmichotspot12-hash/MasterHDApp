// One-off import: requirements-import-preview.csv -> Supabase `requirements` table.
// Safety: backs up current table to backups/, dedupes against existing phones,
// every row tagged [GF-import] in special_requirements for one-line rollback:
//   DELETE FROM requirements WHERE special_requirements LIKE '%[GF-import]%'
// Usage: node scripts/import-demand.mjs          (dry run — shows what would happen)
//        node scripts/import-demand.mjs --commit (actually inserts)

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const COMMIT = process.argv.includes('--commit')

// load .env.local
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// ---- parse preview CSV ----
function parseCSV(s) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++ } else inQuotes = false }
      else field += c
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

const txt = fs.readFileSync('requirements-import-preview.csv', 'utf8').replace(/^﻿/, '')
const rows = parseCSV(txt)
const head = rows[0]
const records = rows.slice(1)
  .filter(r => r.some(c => c && c.trim()))
  .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])))

// ---- shape rows for the table ----
const IMPORT_COLS = ['finder_name', 'finder_phone', 'listing_type', 'property_category', 'bhk_count',
  'locality_preference', 'budget_min', 'budget_max', 'furnishing_preference', 'timeline',
  'tenant_type', 'food_preference', 'facing_preference', 'special_requirements', 'status', 'created_at']

let skippedPhone = 0
const toInsert = []
for (const rec of records) {
  if (!/^\d{10}$/.test(rec.finder_phone)) { skippedPhone++; continue }
  const row = {}
  for (const c of IMPORT_COLS) {
    let v = rec[c]
    if (c === 'budget_min' || c === 'budget_max') v = v === '' ? null : parseInt(v, 10)
    if (c === 'created_at' && !v) v = null
    row[c] = v === '' ? null : v
  }
  if (!row.created_at) delete row.created_at
  // budget_max is NOT NULL in the table; keep no-budget leads with 0 + a note
  if (row.budget_max == null) {
    row.budget_max = 0
    row.special_requirements = ('Budget not specified — ask on call • ' + (row.special_requirements || '')).slice(0, 600)
  }
  toInsert.push(row)
}

// ---- main ----
const { data: existing, error: exErr } = await supabase.from('requirements').select('*')
if (exErr) { console.error('Failed to read existing requirements:', exErr.message); process.exit(1) }

// backup current table
fs.mkdirSync('backups', { recursive: true })
const backupFile = path.join('backups', `requirements-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
fs.writeFileSync(backupFile, JSON.stringify(existing, null, 2))

// dedupe against DB phones
const existingPhones = new Set(existing.map(r => r.finder_phone))
const fresh = toInsert.filter(r => !existingPhones.has(r.finder_phone))
const dupes = toInsert.length - fresh.length

console.log('Existing rows in DB:', existing.length, '(backed up to', backupFile + ')')
console.log('Preview records:', records.length)
console.log('Skipped (invalid phone):', skippedPhone)
console.log('Already in DB (same phone), skipped:', dupes)
console.log('To insert:', fresh.length)

if (!COMMIT) {
  console.log('\nDRY RUN — nothing inserted. Sample record:')
  console.log(JSON.stringify(fresh[0], null, 2))
  console.log('\nRun with --commit to insert.')
  process.exit(0)
}

let inserted = 0
for (let i = 0; i < fresh.length; i += 100) {
  const batch = fresh.slice(i, i + 100)
  const { error } = await supabase.from('requirements').insert(batch)
  if (error) {
    console.error(`Batch ${i / 100 + 1} failed after ${inserted} inserts:`, error.message)
    console.error('Rollback if needed: DELETE FROM requirements WHERE special_requirements LIKE \'%[GF-import]%\'')
    process.exit(1)
  }
  inserted += batch.length
  console.log(`Inserted ${inserted}/${fresh.length}`)
}

const { count } = await supabase.from('requirements').select('*', { count: 'exact', head: true })
console.log('\nDone. Table now has', count, 'rows.')
console.log('Rollback any time: DELETE FROM requirements WHERE special_requirements LIKE \'%[GF-import]%\'')
