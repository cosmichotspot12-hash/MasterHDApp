import { createClient } from '@supabase/supabase-js'
import { getPublicEnv } from '@/lib/env'

const supabaseUrl = getPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
