// app/api/compute-today/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client (uses service role)
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // DO NOT expose client-side
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

// Local date string for America/Detroit
function detroitDateString(d = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Detroit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  // @ts-ignore
  const parts = Object.fromEntries(fmt.formatToParts(d).map(p => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

export async function GET(request: Request) {
  const supabase = getAdminSupabase()
  const url = new URL(request.url)
  const force = url.searchParams.get('force') === '1'

  const today = detroitDateString()

  const { data: existing, error: selErr } = await supabase
    .from('days')
    .select('*')
    .eq('id', today)
    .maybeSingle()

  if (selErr) {
    return NextResponse.json({ ok: false, step: 'select', error: selErr.message }, { status: 500 })
  }

  if (existing && !force) {
    return NextResponse.json({ ok: true, message: 'Already computed', id: today })
  }

  const payload = {
    id: today,
    tz: 'America/Detroit',
    moon_sign: 'TBD',
    moon_degree: 0,
    decan: 1,
    phase_name: 'TBD',
    phase_angle: 0,
    minor_arcana: 'TBD',
    major_arcana: 'The Moon',
    sign_color: '#8aa0b4',
    meaning_combined:
      'Daily record placeholder. Astronomy compute will fill this automatically. Use this as a smoke test that cron + DB are wired.',
  }

  const { error: upsertErr } = await supabase
    .from('days')
    .upsert(payload, { onConflict: 'id' })

  if (upsertErr) {
    return NextResponse.json({ ok: false, step: 'upsert', error: upsertErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: today, inserted: true })
}
