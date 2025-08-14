import { createServerClient } from '../lib/supabaseServer'

export default async function Page() {
  const supabase = createServerClient()
  // Placeholder query: show today’s row if exists (UTC date for now)
  const today = new Date().toISOString().slice(0,10)
  const { data } = await supabase.from('days').select('*').eq('id', today).maybeSingle()

  return (
    <main className="space-y-6">
      <section className="card p-5">
        <h2 className="text-lg font-medium">Today</h2>
        {!data ? (
          <p className="text-sm text-slate-300 mt-2">
            No daily record yet. Once the compute endpoint is wired, this will populate automatically at midnight.
          </p>
        ) : (
          <div className="mt-3 text-sm leading-6">
            <div>Sign: <span className="font-semibold">{data.moon_sign}</span></div>
            <div>Decan: <span className="font-semibold">{data.decan}</span></div>
            <div>Phase: <span className="font-semibold">{data.phase_name}</span></div>
            <div className="mt-3 whitespace-pre-wrap">{data.meaning_combined}</div>
          </div>
        )}
      </section>

      <section className="card p-5">
        <h3 className="text-base font-medium">Comments</h3>
        <p className="text-sm text-slate-300 mt-2">We’ll plug the anonymous comment box here in Step 3.</p>
      </section>
    </main>
  )
}
