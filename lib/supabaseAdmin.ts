// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}
