// Applies scripts/deals-table.sql to Supabase via the REST SQL endpoint.
// Requires a Postgres connection — uses the service role to call the
// `exec_sql` RPC if present, else prints instructions. Usage: node scripts/setup-deals.mjs

import fs from 'node:fs'

for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const sql = fs.readFileSync('scripts/deals-table.sql', 'utf8')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

// Supabase has no generic "run SQL" REST endpoint without a custom RPC.
// Try the pg-meta query endpoint that the dashboard itself uses.
const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: sql }),
})

if (res.ok) {
  console.log('Applied deals-table.sql successfully.')
} else {
  console.log('Could not auto-apply (status ' + res.status + ').')
  console.log('Run scripts/deals-table.sql manually in the Supabase SQL editor.')
}
