// Moves reviewed rent->lease rows. Excludes Suresh + Renu by id.
// Backs up affected rows, updates only rows currently 'rent'.
// Usage: node scripts/rent-lease-commit.mjs --commit   (dry run without flag)
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
const COMMIT = process.argv.includes('--commit')
for (const line of fs.readFileSync('.env.local','utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim()
}
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const EXCLUDE = new Set([
  '23d0c4ce-2b0c-4327-9794-2975665da1ea', // Suresh - "Rent for 1 year"
  'e3135247-7585-4d64-a6f8-6617b5d6a5f2', // Renu - "Lease or rent both ok"
])
const ids = JSON.parse(fs.readFileSync('scratch-rent-movers.json','utf8')).filter(id => !EXCLUDE.has(id))

const { data: rows, error } = await s.from('requirements').select('*').in('id', ids)
if (error) { console.error(error.message); process.exit(1) }
const targets = rows.filter(r => r.listing_type === 'rent')
const skipped = rows.filter(r => r.listing_type !== 'rent')
if (skipped.length) console.log('Skipping (not currently rent):', skipped.map(r=>r.finder_name).join(', '))

fs.mkdirSync('backups', { recursive: true })
const bak = path.join('backups', `reclass-rent-lease-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
fs.writeFileSync(bak, JSON.stringify(targets, null, 2))
console.log(`Backed up ${targets.length} rows -> ${bak}`)

if (!COMMIT) { console.log(`\nDRY RUN — would set ${targets.length} rows rent -> lease. Run with --commit.`); process.exit(0) }

let done = 0
for (const r of targets) {
  const { error: e } = await s.from('requirements').update({ listing_type: 'lease' }).eq('id', r.id).eq('listing_type','rent')
  if (e) { console.error(`FAILED ${r.finder_name} (${r.id}):`, e.message); process.exit(1) }
  done++; console.log(`  ${done}/${targets.length}  ${r.finder_name} rent -> lease`)
}
const { data: chk } = await s.from('requirements').select('listing_type')
const c = {}; chk.forEach(x=>c[x.listing_type]=(c[x.listing_type]||0)+1)
console.log('\nDone. listing_type counts now:', JSON.stringify(c))
console.log('Rollback: restore from', bak)
