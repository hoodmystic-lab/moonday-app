// Server-only Supabase client using the service role key (never expose on client)
import { createClient } from '@supabase/supabase-js'

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // NOT public
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
    global: { headers: { 'X-Client-Info': 'moonday-admin' } }
  })
}
