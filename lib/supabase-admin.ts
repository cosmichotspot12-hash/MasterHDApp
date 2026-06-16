import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { getPublicEnv } from '@/lib/env'
import { getServerEnv } from '@/lib/server-env'

const supabaseUrl = getPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
const serviceRoleKey = getServerEnv('SUPABASE_SERVICE_ROLE_KEY')

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
