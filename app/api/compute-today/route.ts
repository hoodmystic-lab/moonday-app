import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabaseAdmin'

// Helper: local date string in America/Detroit as YYYY-MM-DD
function detroitDateString(d = new Date()) {
  // Use Intl to format parts in Detroit tz
  const fmt = new Intl.DateTimeFormat('en-CA', { // en-CA => YYYY-MM-DD
    timeZone: 'America/Detroit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  // @ts-ignore - formatToParts types
  const parts = Object.fromEntries(fmt.formatToParts(d).map(p => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

export async function GET(request: Request) {
  const supabase = getAdminSupabase()
  const url = new URL(request.url)
  const force = url.searchParams.get('force') === '1'

  const today = detroitDateString()

  // Check if we already have today
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

  // 🔹 For now, insert a simple placeholder row (Step 2.5 will plug real astronomy)
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

  // upsert: insert if missing, replace if force=1
  const { error: upsertErr } = await supabase
    .from('days')
    .upsert(payload, { onConflict: 'id' })

  if (upsertErr) {
    return NextResponse.json({ ok: false, step: 'upsert', error: upsertErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: today, inserted: true })
}
