// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // For server components, no session persistence is needed
  return createClient(url, key, { auth: { persistSession: false } })
}
