import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Shield, Trophy, Flame, ScrollText, Users, Swords, Castle, Copy } from "lucide-react";

const SUPABASE_URL = "https://zsmjicjsyowpnwbpbyvu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0o1l0knnxpTOg7aHcSKqfQ_6gkb7bck";
const hasSupabaseConfig =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("YOUR_PROJECT") &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const STORAGE_KEY = "guinness-crusade-v4";
const DEFAULT_PUBS = ["Allen's", "Noonan's", "McVeigh's", "P.J. O'Brien"];
const DEFAULT_PLAYERS = ["Edward", "Stuart"];

const setupSql = `create table if not exists public.bar_crawl_settings (
  id int primary key,
  pubs jsonb not null,
  players jsonb not null,
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
alter publication supabase_realtime add table public.bar_crawl_scores;`;

const QUALITATIVE = {
  pour: [
    { label: "Botched Pour", score: 1 },
    { label: "Uneven Pour", score: 2 },
    { label: "Decent Pour", score: 3 },
    { label: "Proper Pour", score: 4 },
    { label: "Royal Pour", score: 5 },
  ],
  head: [
    { label: "Flat Crown", score: 1 },
    { label: "Thin Crown", score: 2 },
    { label: "Fair Head", score: 3 },
    { label: "Stately Head", score: 4 },
    { label: "Cathedral Crown", score: 5 },
  ],
  temp: [
    { label: "Campfire Warm", score: 1 },
    { label: "Off-Temp", score: 2 },
    { label: "Serviceable", score: 3 },
    { label: "Well Kept", score: 4 },
    { label: "Cellar Perfect", score: 5 },
  ],
  taste: [
    { label: "Spoiled Draught", score: 1 },
    { label: "Rough Sip", score: 2 },
    { label: "Sound Pint", score: 3 },
    { label: "Rich Draught", score: 4 },
    { label: "Holy Nectar", score: 5 },
  ],
  vibe: [
    { label: "Bleak Hall", score: 1 },
    { label: "Cold Keep", score: 2 },
    { label: "Lively Hall", score: 3 },
    { label: "Noble Tavern", score: 4 },
    { label: "Legendary Great Hall", score: 5 },
  ],
  irishAuthenticity: [
    { label: "False Banner", score: 1 },
    { label: "Tourist Relic", score: 2 },
    { label: "Somewhat True", score: 3 },
    { label: "Faithful House", score: 4 },
    { label: "Emerald Sanctum", score: 5 },
  ],
  service: [
    { label: "Abandoned Post", score: 1 },
    { label: "Slow Watch", score: 2 },
    { label: "Steady Service", score: 3 },
    { label: "Swift Stewardship", score: 4 },
    { label: "Knightly Service", score: 5 },
  ],
  pagansMoors: [
    { label: "Infidel Stronghold", score: 1 },
    { label: "Heavy Resistance", score: 2 },
    { label: "Scattered Forces", score: 3 },
    { label: "Lone Saracen", score: 4 },
    { label: "Safe Ground", score: 5 },
  ],
};

const CATEGORIES = {
  pint: [
    { key: "pour", title: "Pour", icon: Flame },
    { key: "head", title: "Head", icon: Shield },
    { key: "temp", title: "Temp", icon: Castle },
    { key: "taste", title: "Taste", icon: Trophy },
  ],
  pub: [
    { key: "vibe", title: "Vibe", icon: ScrollText },
    { key: "irishAuthenticity", title: "Irish Authenticity", icon: Shield },
    { key: "service", title: "Service", icon: Users },
    { key: "pagansMoors", title: "Pagans / Moors", icon: Swords },
  ],
};

const PUB_BRANDING = {
  "Allen's": { wordmark: "ALLEN'S", note: "Classic frontage", palette: "from-stone-950 via-neutral-900 to-amber-950" },
  "Noonan's": { wordmark: "NOONAN'S", note: "141 Irish Pub feel", palette: "from-zinc-950 via-black to-red-950" },
  "McVeigh's": { wordmark: "McVEIGH'S", note: "Flag-and-crest spirit", palette: "from-neutral-950 via-slate-900 to-emerald-950" },
  "P.J. O'Brien": { wordmark: "P.J. O'BRIEN", note: "Blue-and-gold house", palette: "from-slate-950 via-blue-950 to-amber-950" },
};

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatScore(value) {
  return value ? value.toFixed(2) : "—";
}

function entryAverage(entry, keys) {
  const values = keys.map((key) => Number(entry?.[key])).filter(Boolean);
  return average(values);
}

function groupAverage(entry, groupKey) {
  return entryAverage(entry, CATEGORIES[groupKey].map((item) => item.key));
}

function scoreLabel(field, score) {
  return QUALITATIVE[field].find((item) => item.score === score)?.label || "Unrated";
}

function CrusadeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active ? "border-amber-300 bg-amber-300 text-black shadow-lg shadow-amber-400/20" : "border-white/10 bg-white/5 text-stone-200"}`}
    >
      {children}
    </button>
  );
}

function OptionPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-3 text-left text-sm leading-tight transition ${active ? "border-amber-300 bg-amber-200 text-black shadow-lg shadow-amber-500/20" : "border-white/10 bg-black/20 text-stone-100"}`}
    >
      {children}
    </button>
  );
}

function SelectBox({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-stone-100 outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-stone-950 text-stone-100">
          {option}
        </option>
      ))}
    </select>
  );
}

export default function GuinnessCrusadeApp() {
  const [pubs, setPubs] = useState(DEFAULT_PUBS);
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [selectedPub, setSelectedPub] = useState(DEFAULT_PUBS[0]);
  const [selectedPlayer, setSelectedPlayer] = useState(DEFAULT_PLAYERS[0]);
  const [selectedGroup, setSelectedGroup] = useState("pint");
  const [scores, setScores] = useState({});
  const [backendMode, setBackendMode] = useState(hasSupabaseConfig ? "supabase" : "local");
  const [syncStatus, setSyncStatus] = useState(hasSupabaseConfig ? "Connecting…" : "Local only");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHydrated(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.pubs?.length) setPubs(parsed.pubs);
      if (parsed.players?.length) setPlayers(parsed.players);
      if (parsed.selectedPub) setSelectedPub(parsed.selectedPub);
      if (parsed.selectedPlayer) setSelectedPlayer(parsed.selectedPlayer);
      if (parsed.scores) setScores(parsed.scores);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pubs, players, selectedPub, selectedPlayer, scores })
    );
  }, [hydrated, pubs, players, selectedPub, selectedPlayer, scores]);

  useEffect(() => {
    if (!supabase || !hydrated || backendMode !== "supabase") return;
    let scoreChannel;
    let settingsChannel;

    const init = async () => {
      setSyncStatus("Loading shared data…");
      const { data: settingsRow, error: settingsError } = await supabase
        .from("bar_crawl_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (settingsError) {
        setSyncStatus("Run setup SQL first");
        return;
      }

      if (!settingsRow) {
        await supabase.from("bar_crawl_settings").upsert({ id: 1, pubs: DEFAULT_PUBS, players: DEFAULT_PLAYERS });
      } else {
        if (Array.isArray(settingsRow.pubs) && settingsRow.pubs.length) setPubs(settingsRow.pubs);
        if (Array.isArray(settingsRow.players) && settingsRow.players.length) setPlayers(settingsRow.players);
      }

      const { data: scoreRows } = await supabase.from("bar_crawl_scores").select("pub, judge, scores");
      const incoming = {};
      (scoreRows || []).forEach((row) => {
        incoming[`${row.pub}__${row.judge}`] = row.scores || {};
      });
      setScores(incoming);
      setSyncStatus("Live");

      scoreChannel = supabase
        .channel("gc-scores")
        .on("postgres_changes", { event: "*", schema: "public", table: "bar_crawl_scores" }, (payload) => {
          const row = payload.new;
          if (!row?.pub || !row?.judge) return;
          setScores((prev) => ({ ...prev, [`${row.pub}__${row.judge}`]: row.scores || {} }));
        })
        .subscribe();

      settingsChannel = supabase
        .channel("gc-settings")
        .on("postgres_changes", { event: "*", schema: "public", table: "bar_crawl_settings" }, (payload) => {
          const row = payload.new;
          if (!row) return;
          if (Array.isArray(row.pubs) && row.pubs.length) setPubs(row.pubs);
          if (Array.isArray(row.players) && row.players.length) setPlayers(row.players);
        })
        .subscribe();
    };

    init();
    return () => {
      if (scoreChannel) supabase.removeChannel(scoreChannel);
      if (settingsChannel) supabase.removeChannel(settingsChannel);
    };
  }, [backendMode, hydrated]);

  useEffect(() => {
    if (!supabase || !hydrated || backendMode !== "supabase") return;
    supabase.from("bar_crawl_settings").upsert({ id: 1, pubs, players });
  }, [backendMode, hydrated, pubs, players]);

  const currentKey = `${selectedPub}__${selectedPlayer}`;
  const currentEntry = scores[currentKey] || {};
  const activeCategories = CATEGORIES[selectedGroup];

  const leaderboard = useMemo(() => {
    return pubs
      .map((pub) => {
        const entries = players.map((player) => scores[`${pub}__${player}`]).filter(Boolean);
        return {
          pub,
          entries: entries.length,
          pint: average(entries.map((entry) => groupAverage(entry, "pint")).filter(Boolean)),
          pubScore: average(entries.map((entry) => groupAverage(entry, "pub")).filter(Boolean)),
          overall: average(entries.map((entry) => entryAverage(entry, [...CATEGORIES.pint, ...CATEGORIES.pub].map((item) => item.key))).filter(Boolean)),
        };
      })
      .sort((a, b) => b.overall - a.overall);
  }, [pubs, players, scores]);

  const updateScore = async (field, score) => {
    const nextEntry = { ...currentEntry, [field]: score };
    setScores((prev) => ({ ...prev, [currentKey]: nextEntry }));
    if (supabase && backendMode === "supabase") {
      await supabase.from("bar_crawl_scores").upsert({ pub: selectedPub, judge: selectedPlayer, scores: nextEntry });
    }
  };

  const copySetupSql = async () => {
    await navigator.clipboard.writeText(setupSql);
    setSyncStatus("SQL copied");
    setTimeout(() => setSyncStatus(backendMode === "supabase" ? "Live" : "Local only"), 1200);
  };

  const heroBrand = PUB_BRANDING[selectedPub] || { wordmark: selectedPub.toUpperCase(), note: "Chosen stop", palette: "from-neutral-950 via-stone-900 to-amber-950" };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2),_transparent_30%),linear-gradient(180deg,#120f0a_0%,#090909_45%,#130e08_100%)] text-stone-100">
      <div className="mx-auto max-w-md px-4 pb-10 pt-5">
        <div className="overflow-hidden rounded-[28px] border border-amber-300/15 bg-black/30 shadow-2xl shadow-black/40 backdrop-blur">
          <div className={`bg-gradient-to-br ${heroBrand.palette} px-5 pb-6 pt-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.35em] text-amber-200/80">Toronto Crusade</div>
                <h1 className="mt-2 text-3xl font-black leading-none text-amber-100">The Guinness Crusade</h1>
                <p className="mt-2 text-sm text-stone-300">Mobile scorecard for noble pints and worthy halls.</p>
              </div>
              <div className="rounded-full border border-amber-200/25 bg-black/25 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                {backendMode === "supabase" ? syncStatus : "Local"}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <img src="/logo.png" alt="The Guinness Crusade logo" className="w-40 drop-shadow-2xl" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <CrusadeButton active={backendMode === "local"} onClick={() => setBackendMode("local")}>Local Keep</CrusadeButton>
              <CrusadeButton active={backendMode === "supabase"} onClick={() => setBackendMode("supabase")}>Live Crusade</CrusadeButton>
            </div>
          </div>

          <div className="space-y-5 px-4 py-5">
            <section className="rounded-3xl border border-white/8 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-100">
                <Shield className="h-4 w-4" /> Select your campaign
              </div>
              <div className="grid gap-3">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">Pub</label>
                  <SelectBox value={selectedPub} onChange={setSelectedPub} options={pubs} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">Crusader</label>
                  <SelectBox value={selectedPlayer} onChange={setSelectedPlayer} options={players} />
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-amber-200/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70">Current target</div>
                <div className="mt-2 text-2xl font-black text-amber-100">{heroBrand.wordmark}</div>
                <div className="text-sm text-stone-400">{heroBrand.note}</div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/8 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <ScrollText className="h-4 w-4" /> Score the siege
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-300">
                  {selectedGroup === "pint" ? "The Pint" : "The Pub"}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <CrusadeButton active={selectedGroup === "pint"} onClick={() => setSelectedGroup("pint")}>The Pint</CrusadeButton>
                <CrusadeButton active={selectedGroup === "pub"} onClick={() => setSelectedGroup("pub")}>The Pub</CrusadeButton>
              </div>

              <div className="space-y-4">
                {activeCategories.map((category) => {
                  const Icon = category.icon;
                  const currentScore = Number(currentEntry?.[category.key] || 0);
                  return (
                    <motion.div key={category.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/8 bg-black/20 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2 text-amber-100"><Icon className="h-4 w-4" /></div>
                        <div>
                          <div className="font-semibold text-stone-100">{category.title}</div>
                          <div className="text-sm text-stone-400">{scoreLabel(category.key, currentScore)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {QUALITATIVE[category.key].map((option) => (
                          <OptionPill key={option.score} active={currentScore === option.score} onClick={() => updateScore(category.key, option.score)}>
                            <div className="flex items-center justify-between gap-3">
                              <span>{option.label}</span>
                              <span className="rounded-full border border-current/20 px-2 py-0.5 text-xs">{option.score}/5</span>
                            </div>
                          </OptionPill>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <section className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/8 bg-white/5 p-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Pint</div>
                <div className="mt-2 text-2xl font-black text-amber-100">{formatScore(groupAverage(currentEntry, "pint"))}</div>
              </div>
              <div className="rounded-3xl border border-white/8 bg-white/5 p-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Pub</div>
                <div className="mt-2 text-2xl font-black text-amber-100">{formatScore(groupAverage(currentEntry, "pub"))}</div>
              </div>
              <div className="rounded-3xl border border-white/8 bg-white/5 p-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Overall</div>
                <div className="mt-2 text-2xl font-black text-amber-100">{formatScore(entryAverage(currentEntry, [...CATEGORIES.pint, ...CATEGORIES.pub].map((item) => item.key)))}</div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/8 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <Trophy className="h-4 w-4" /> Leaderboard
                </div>
                <button onClick={copySetupSql} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-stone-300">
                  <Copy className="mr-1 inline h-3 w-3" /> SQL
                </button>
              </div>
              <div className="space-y-3">
                {leaderboard.map((item, index) => (
                  <div key={item.pub} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-amber-300 px-2 py-1 text-xs font-bold text-black">#{index + 1}</span>
                          <span className="font-semibold text-stone-100">{item.pub}</span>
                        </div>
                        <div className="mt-1 text-sm text-stone-400">{item.entries} scorecard{item.entries === 1 ? "" : "s"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-amber-100">{formatScore(item.overall)}</div>
                        <div className="text-xs text-stone-400">overall</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-xl bg-white/5 px-3 py-2 text-stone-300">Pint: <span className="font-semibold text-amber-100">{formatScore(item.pint)}</span></div>
                      <div className="rounded-xl bg-white/5 px-3 py-2 text-stone-300">Pub: <span className="font-semibold text-amber-100">{formatScore(item.pubScore)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
