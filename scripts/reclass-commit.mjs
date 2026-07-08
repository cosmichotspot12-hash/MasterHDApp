// Applies the reviewed reclassification: the 20 IDs in scratch-movers.json -> listing_type='lease'.
// Backs up affected rows first. Updates one id at a time, only rows currently 'sale'.
// Usage: node scripts/reclass-commit.mjs --commit   (dry run without the flag)
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
const COMMIT = process.argv.includes('--commit')
for (const line of fs.readFileSync('.env.local','utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim()
}
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const ids = JSON.parse(fs.readFileSync('scratch-movers.json','utf8'))

const { data: rows, error } = await s.from('requirements').select('*').in('id', ids)
if (error) { console.error(error.message); process.exit(1) }

// safety: only touch rows currently 'sale'
const targets = rows.filter(r => r.listing_type === 'sale')
const skipped = rows.filter(r => r.listing_type !== 'sale')
if (skipped.length) console.log('Skipping (not currently sale):', skipped.map(r=>r.finder_name).join(', '))

fs.mkdirSync('backups', { recursive: true })
const bak = path.join('backups', `reclass-lease-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
fs.writeFileSync(bak, JSON.stringify(targets, null, 2))
console.log(`Backed up ${targets.length} rows -> ${bak}`)

if (!COMMIT) {
  console.log(`\nDRY RUN — would set ${targets.length} rows to listing_type='lease'. Run with --commit.`)
  process.exit(0)
}

let done = 0
for (const r of targets) {
  const { error: e } = await s.from('requirements').update({ listing_type: 'lease' }).eq('id', r.id).eq('listing_type','sale')
  if (e) { console.error(`FAILED ${r.finder_name} (${r.id}):`, e.message); process.exit(1) }
  done++
  console.log(`  ${done}/${targets.length}  ${r.finder_name} sale -> lease`)
}
const { data: chk } = await s.from('requirements').select('listing_type')
const c = {}; chk.forEach(x=>c[x.listing_type]=(c[x.listing_type]||0)+1)
console.log('\nDone. listing_type counts now:', JSON.stringify(c))
console.log('Rollback: restore from', bak, '(each of those ids back to listing_type sale)')
