import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC_* vars are only inlined into the client bundle when referenced as
// static literals. Reading them dynamically (e.g. process.env[name] via
// getPublicEnv) leaves them undefined in the browser, so we reference them
// directly here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
