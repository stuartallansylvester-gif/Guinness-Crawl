import React, { useEffect, useMemo, useState } from 'react'
import { Trophy, Beer, Plus, Users, Trash2, Copy, Wifi } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'

const PINT_FIELDS = [
  { key: 'pour', label: 'Pour' },
  { key: 'head', label: 'Head' },
  { key: 'temp', label: 'Temp' },
  { key: 'taste', label: 'Taste' },
]

const PUB_FIELDS = [
  { key: 'vibe', label: 'Vibe' },
  { key: 'irishAuthenticity', label: 'Irish Authenticity' },
  { key: 'service', label: 'Service' },
  { key: 'pagansMoors', label: 'Pagans / Moors' },
]

const DEFAULT_PUBS = ["Allen's", "Noonan's", "McVeigh's", "P.J. O'Brien"]
const DEFAULT_JUDGES = ['Judge 1', 'Judge 2', 'Judge 3']

const SUPABASE_URL = 'https://zsmjicjsyowpnwbpbyvu.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_0o1l0knnxpTOg7aHcSKqfQ_6gkb7bck'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const SETUP_SQL = `create table if not exists public.bar_crawl_settings (
  id int primary key,
  pubs jsonb not null,
  judges jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.bar_crawl_scores (
  pub text not null,
  judge text not null,
  scores jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (pub, judge)
);

alter publication supabase_realtime add table public.bar_crawl_settings;
alter publication supabase_realtime add table public.bar_crawl_scores;`

const BRANDS = {
  "Allen's": {
    palette: 'from-slate-900 via-slate-800 to-amber-950',
    label: 'Gold on navy',
    note: 'Classic awning feel',
  },
  "Noonan's": {
    palette: 'from-neutral-950 via-zinc-900 to-red-950',
    label: 'Gold and red',
    note: 'Irish pub signage feel',
  },
  "McVeigh's": {
    palette: 'from-zinc-950 via-slate-900 to-emerald-950',
    label: 'Irish tricolour feel',
    note: 'Flag-inspired styling',
  },
  "P.J. O'Brien": {
    palette: 'from-blue-950 via-slate-900 to-amber-950',
    label: 'Blue and gold',
    note: 'Corner pub frontage feel',
  },
}

function avg(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
}

function scoreAverage(entry, fields) {
  const values = fields.map((field) => Number(entry?.[field.key])).filter((n) => !Number.isNaN(n) && n > 0)
  return avg(values)
}

function totalAverage(entry) {
  return scoreAverage(entry, [...PINT_FIELDS, ...PUB_FIELDS])
}

function formatScore(value) {
  return value ? value.toFixed(2) : '—'
}

function cardClass(pub) {
  const brand = BRANDS[pub] || { palette: 'from-slate-900 to-slate-700' }
  return `bg-gradient-to-br ${brand.palette} text-white`
}

function Button({ children, className = '', variant = 'solid', ...props }) {
  const base = 'rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99]'
  const style = variant === 'outline'
    ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
    : 'bg-slate-900 text-white hover:bg-slate-800'
  return <button className={`${base} ${style} ${className}`} {...props}>{children}</button>
}

function Card({ children, className = '' }) {
  return <div className={`rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>
}

function ScoreInput({ label, value, onChange }) {
  return (
    <label className="block rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <input
        type="number"
        min="1"
        max="10"
        step="1"
        value={value ?? ''}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
      />
    </label>
  )
}

export default function App() {
  const [pubs, setPubs] = useState(DEFAULT_PUBS)
  const [judges, setJudges] = useState(DEFAULT_JUDGES)
  const [selectedPub, setSelectedPub] = useState(DEFAULT_PUBS[0])
  const [selectedJudge, setSelectedJudge] = useState(DEFAULT_JUDGES[0])
  const [scores, setScores] = useState({})
  const [newPub, setNewPub] = useState('')
  const [newJudge, setNewJudge] = useState('')
  const [syncStatus, setSyncStatus] = useState('Connecting')
  const [activeTab, setActiveTab] = useState('pint')

  useEffect(() => {
    const boot = async () => {
      const { data: settings, error: settingsError } = await supabase
        .from('bar_crawl_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (settingsError) {
        setSyncStatus('Run SQL setup')
        return
      }

      if (!settings) {
        await supabase.from('bar_crawl_settings').upsert({
          id: 1,
          pubs: DEFAULT_PUBS,
          judges: DEFAULT_JUDGES,
        })
      } else {
        if (Array.isArray(settings.pubs) && settings.pubs.length) setPubs(settings.pubs)
        if (Array.isArray(settings.judges) && settings.judges.length) setJudges(settings.judges)
      }

      const { data: scoreRows, error: scoreError } = await supabase
        .from('bar_crawl_scores')
        .select('pub, judge, scores')

      if (scoreError) {
        setSyncStatus('Score error')
        return
      }

      const nextScores = {}
      ;(scoreRows || []).forEach((row) => {
        nextScores[`${row.pub}__${row.judge}`] = row.scores || {}
      })
      setScores(nextScores)
      setSyncStatus('Live')
    }

    boot()

    const scoreChannel = supabase
      .channel('scores-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bar_crawl_scores' }, (payload) => {
        const row = payload.new
        if (!row?.pub || !row?.judge) return
        setScores((prev) => ({ ...prev, [`${row.pub}__${row.judge}`]: row.scores || {} }))
      })
      .subscribe()

    const settingsChannel = supabase
      .channel('settings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bar_crawl_settings' }, (payload) => {
        const row = payload.new
        if (!row) return
        if (Array.isArray(row.pubs)) setPubs(row.pubs)
        if (Array.isArray(row.judges)) setJudges(row.judges)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(scoreChannel)
      supabase.removeChannel(settingsChannel)
    }
  }, [])

  useEffect(() => {
    if (pubs.length && !pubs.includes(selectedPub)) setSelectedPub(pubs[0])
  }, [pubs, selectedPub])

  useEffect(() => {
    if (judges.length && !judges.includes(selectedJudge)) setSelectedJudge(judges[0])
  }, [judges, selectedJudge])

  const key = `${selectedPub}__${selectedJudge}`
  const current = scores[key] || {}

  const leaderboard = useMemo(() => {
    return pubs
      .map((pub) => {
        const entries = judges.map((judge) => scores[`${pub}__${judge}`]).filter(Boolean)
        return {
          pub,
          entries: entries.length,
          pint: avg(entries.map((entry) => scoreAverage(entry, PINT_FIELDS)).filter(Boolean)),
          pubScore: avg(entries.map((entry) => scoreAverage(entry, PUB_FIELDS)).filter(Boolean)),
          overall: avg(entries.map((entry) => totalAverage(entry)).filter(Boolean)),
        }
      })
      .sort((a, b) => b.overall - a.overall)
  }, [pubs, judges, scores])

  const judgeProgress = useMemo(() => {
    return judges.map((judge) => {
      const entries = pubs.map((pub) => scores[`${pub}__${judge}`]).filter(Boolean)
      return { judge, completed: entries.length, avg: avg(entries.map((entry) => totalAverage(entry)).filter(Boolean)) }
    })
  }, [judges, pubs, scores])

  async function syncSettings(nextPubs, nextJudges) {
    await supabase.from('bar_crawl_settings').upsert({ id: 1, pubs: nextPubs, judges: nextJudges })
  }

  async function updateField(field, value) {
    const nextValue = value === '' ? '' : Math.max(1, Math.min(10, Number(value)))
    const nextEntry = { ...current, [field]: nextValue }
    setScores((prev) => ({ ...prev, [key]: nextEntry }))
    await supabase.from('bar_crawl_scores').upsert({ pub: selectedPub, judge: selectedJudge, scores: nextEntry })
  }

  async function addPub() {
    const value = newPub.trim()
    if (!value || pubs.includes(value)) return
    const next = [...pubs, value]
    setPubs(next)
    setSelectedPub(value)
    setNewPub('')
    await syncSettings(next, judges)
  }

  async function addJudge() {
    const value = newJudge.trim()
    if (!value || judges.includes(value)) return
    const next = [...judges, value]
    setJudges(next)
    setSelectedJudge(value)
    setNewJudge('')
    await syncSettings(pubs, next)
  }

  async function removePub(pubToRemove) {
    const next = pubs.filter((pub) => pub !== pubToRemove)
    setPubs(next)
    setScores((prev) => {
      const copy = { ...prev }
      Object.keys(copy).forEach((entryKey) => {
        if (entryKey.startsWith(`${pubToRemove}__`)) delete copy[entryKey]
      })
      return copy
    })
    await supabase.from('bar_crawl_scores').delete().eq('pub', pubToRemove)
    await syncSettings(next, judges)
  }

  async function removeJudge(judgeToRemove) {
    const next = judges.filter((judge) => judge !== judgeToRemove)
    setJudges(next)
    setScores((prev) => {
      const copy = { ...prev }
      Object.keys(copy).forEach((entryKey) => {
        if (entryKey.endsWith(`__${judgeToRemove}`)) delete copy[entryKey]
      })
      return copy
    })
    await supabase.from('bar_crawl_scores').delete().eq('judge', judgeToRemove)
    await syncSettings(pubs, next)
  }

  async function resetScores() {
    setScores({})
    await supabase.from('bar_crawl_scores').delete().neq('pub', '')
  }

  async function copySql() {
    await navigator.clipboard.writeText(SETUP_SQL)
    alert('Supabase SQL copied. Paste it into SQL Editor and click Run.')
  }

  function exportResults() {
    const blob = new Blob([JSON.stringify({ pubs, judges, scores, leaderboard }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bar-crawl-results.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Beer className="h-4 w-4" /> Guinness Bar Crawl Scoring
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                <Wifi className="h-3.5 w-3.5" /> {syncStatus}
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live pub leaderboard</h1>
            <p className="mt-2 text-slate-600">Score each stop across The Pint and The Pub. Everyone on their phone can use the same link once you deploy this project to Vercel.</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">First-time setup</h2>
            <p className="mt-2 text-sm text-slate-600">If the status says Run SQL setup, click the button below, paste into Supabase SQL Editor, and run it once.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" onClick={copySql}><Copy className="mr-2 h-4 w-4" /> Copy SQL</Button>
              <Button variant="outline" onClick={exportResults}>Export JSON</Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900">Enter scores</h2>
              <p className="mt-1 text-sm text-slate-600">Choose a Toronto pub stop and judge, then score all 8 categories.</p>

              <div className={`mt-5 rounded-3xl p-5 ${cardClass(selectedPub)}`}>
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">Toronto</div>
                <div className="mt-2 text-3xl font-semibold tracking-[0.14em]">{selectedPub}</div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
                  <span className="rounded-full border border-white/20 px-3 py-1">{BRANDS[selectedPub]?.label || 'Custom stop'}</span>
                  <span className="rounded-full border border-white/20 px-3 py-1">{BRANDS[selectedPub]?.note || 'Added manually'}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                  <div className="mb-2 text-sm font-medium text-slate-700">Pub</div>
                  <select value={selectedPub} onChange={(e) => setSelectedPub(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                    {pubs.map((pub) => <option key={pub} value={pub}>{pub}</option>)}
                  </select>
                </label>
                <label>
                  <div className="mb-2 text-sm font-medium text-slate-700">Judge</div>
                  <select value={selectedJudge} onChange={(e) => setSelectedJudge(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                    {judges.map((judge) => <option key={judge} value={judge}>{judge}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-6 inline-flex rounded-2xl bg-slate-100 p-1">
                <button onClick={() => setActiveTab('pint')} className={`rounded-xl px-4 py-2 text-sm ${activeTab === 'pint' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>The Pint</button>
                <button onClick={() => setActiveTab('pub')} className={`rounded-xl px-4 py-2 text-sm ${activeTab === 'pub' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>The Pub</button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(activeTab === 'pint' ? PINT_FIELDS : PUB_FIELDS).map((field) => (
                  <ScoreInput key={field.key} label={field.label} value={current[field.key]} onChange={(e) => updateField(field.key, e.target.value)} />
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <Card className="p-4"><div className="text-sm text-slate-500">Pint average</div><div className="mt-1 text-2xl font-semibold">{formatScore(scoreAverage(current, PINT_FIELDS))}</div></Card>
                <Card className="p-4"><div className="text-sm text-slate-500">Pub average</div><div className="mt-1 text-2xl font-semibold">{formatScore(scoreAverage(current, PUB_FIELDS))}</div></Card>
                <Card className="p-4"><div className="text-sm text-slate-500">Overall</div><div className="mt-1 text-2xl font-semibold">{formatScore(totalAverage(current))}</div></Card>
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Plus className="h-4 w-4" /> Add pubs</h3>
                <div className="mt-4 flex gap-2">
                  <input value={newPub} onChange={(e) => setNewPub(e.target.value)} placeholder="Add pub name" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                  <Button onClick={addPub}>Add</Button>
                </div>
                <div className="mt-4 space-y-2">
                  {pubs.map((pub) => (
                    <div key={pub} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                      <span>{pub}</span>
                      <button onClick={() => removePub(pub)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Users className="h-4 w-4" /> Add judges</h3>
                <div className="mt-4 flex gap-2">
                  <input value={newJudge} onChange={(e) => setNewJudge(e.target.value)} placeholder="Add judge name" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                  <Button onClick={addJudge}>Add</Button>
                </div>
                <div className="mt-4 space-y-2">
                  {judges.map((judge) => (
                    <div key={judge} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                      <span>{judge}</span>
                      <button onClick={() => removeJudge(judge)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold"><Trophy className="h-5 w-5" /> Leaderboard</h2>
              <p className="mt-1 text-sm text-slate-600">Ranked by overall average across all judges and categories.</p>
              <div className="mt-4 space-y-3">
                {leaderboard.map((item, index) => (
                  <motion.div key={item.pub} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl p-4 ${cardClass(item.pub)}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs">#{index + 1}</span>
                          <div className="text-lg font-semibold tracking-[0.12em]">{item.pub}</div>
                        </div>
                        <div className="mt-2 text-sm text-white/70">{item.entries} scorecard{item.entries === 1 ? '' : 's'} submitted</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{formatScore(item.overall)}</div>
                        <div className="text-xs text-white/70">overall</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-3"><div className="text-xs text-white/70">The Pint</div><div className="mt-1 text-lg font-semibold">{formatScore(item.pint)}</div></div>
                      <div className="rounded-2xl bg-white/10 p-3"><div className="text-xs text-white/70">The Pub</div><div className="mt-1 text-lg font-semibold">{formatScore(item.pubScore)}</div></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold">Judge progress</h2>
              <div className="mt-4 space-y-3">
                {judgeProgress.map((item) => (
                  <div key={item.judge} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div>
                      <div className="font-medium">{item.judge}</div>
                      <div className="text-sm text-slate-500">{item.completed} of {pubs.length} pubs scored</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatScore(item.avg)}</div>
                      <div className="text-xs text-slate-500">avg given</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" onClick={resetScores}>Reset scores</Button>
                <Button variant="outline" onClick={exportResults}>Export results</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
