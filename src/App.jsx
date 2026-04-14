import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  Shield,
  Trophy,
  Flame,
  ScrollText,
  Users,
  Swords,
  Castle,
  Copy,
  Crown,
  Coins,
} from "lucide-react";

const SUPABASE_URL = "https://zsmjicjsyowpnwbpbyvu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0o1l0knnxpTOg7aHcSKqfQ_6gkb7bck";
const hasSupabaseConfig =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("YOUR_PROJECT") &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const STORAGE_KEY = "guinness-crusade-v6";
const DEFAULT_PUBS = ["Allen's", "Noonan's", "McVeigh's", "P.J. O'Brien"];

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
  price: [
    { label: "King's Ransom", score: 1 },
    { label: "Heavy Tribute", score: 2 },
    { label: "Fair Levy", score: 3 },
    { label: "Worthy Coin", score: 4 },
    { label: "Crusader's Bargain", score: 5 },
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
    { key: "head", title: "Head", icon: Crown },
    { key: "temp", title: "Temp", icon: Castle },
    { key: "taste", title: "Taste", icon: Trophy },
  ],
  pub: [
    { key: "vibe", title: "Vibe", icon: ScrollText },
    { key: "irishAuthenticity", title: "Irish Authenticity", icon: Shield },
    { key: "service", title: "Service", icon: Users },
    { key: "price", title: "Price", icon: Coins },
    { key: "pagansMoors", title: "Pagans / Moors", icon: Swords },
  ],
};

const PUB_BRANDING = {
  "Allen's": { wordmark: "ALLEN'S" },
  "Noonan's": { wordmark: "NOONAN'S" },
  "McVeigh's": { wordmark: "McVEIGH'S" },
  "P.J. O'Brien": { wordmark: "P.J. O'BRIEN" },
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
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-[#8f5b26] bg-[#8f5b26] text-[#f6e1bb]"
          : "border-[#8f5b26]/40 bg-[#f2dfba]/70 text-[#5c3412]"
      }`}
    >
      {children}
    </button>
  );
}

function OptionPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-3 text-left text-sm leading-tight transition ${
        active
          ? "border-[#8f5b26] bg-[#8f5b26] text-[#f8e8c8] shadow-lg"
          : "border-[#9a6b3c]/30 bg-[#f7e7c9]/75 text-[#4e2b12]"
      }`}
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
      className="w-full rounded-2xl border border-[#9a6b3c]/35 bg-[#f8e6c5]/80 px-4 py-3 text-base text-[#4c2b14] outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function ScrollSection({ children, className = "" }) {
  return (
    <section className={`rounded-[24px] border border-[#9a6b3c]/35 bg-[linear-gradient(180deg,rgba(248,228,193,0.92),rgba(235,201,148,0.88))] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.18)] ${className}`}>
      {children}
    </section>
  );
}

export default function GuinnessCrusadeApp() {
  const [pubs, setPubs] = useState(DEFAULT_PUBS);
  const [selectedPub, setSelectedPub] = useState(DEFAULT_PUBS[0]);
  const [crusaderName, setCrusaderName] = useState("");
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
      if (parsed.selectedPub) setSelectedPub(parsed.selectedPub);
      if (parsed.crusaderName) setCrusaderName(parsed.crusaderName);
      if (parsed.scores) setScores(parsed.scores);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pubs, selectedPub, crusaderName, scores })
    );
  }, [hydrated, pubs, selectedPub, crusaderName, scores]);

  useEffect(() => {
    if (!supabase || !hydrated || backendMode !== "supabase") return;
    let scoreChannel;
    const init = async () => {
      setSyncStatus("Loading campaign…");
      const { data: scoreRows, error } = await supabase.from("bar_crawl_scores").select("pub, judge, scores");
      if (error) {
        setSyncStatus("Run setup SQL first");
        return;
      }
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
    };
    init();
    return () => {
      if (scoreChannel) supabase.removeChannel(scoreChannel);
    };
  }, [backendMode, hydrated]);

  const safeJudge = crusaderName.trim();
  const currentKey = `${selectedPub}__${safeJudge}`;
  const currentEntry = scores[currentKey] || {};
  const activeCategories = CATEGORIES[selectedGroup];

  const leaderboard = useMemo(() => {
    return pubs
      .map((pub) => {
        const entries = Object.entries(scores)
          .filter(([key]) => key.startsWith(`${pub}__`))
          .map(([, entry]) => entry)
          .filter(Boolean);
        return {
          pub,
          entries: entries.length,
          pint: average(entries.map((entry) => groupAverage(entry, "pint")).filter(Boolean)),
          pubScore: average(entries.map((entry) => groupAverage(entry, "pub")).filter(Boolean)),
          overall: average(
            entries
              .map((entry) => entryAverage(entry, [...CATEGORIES.pint, ...CATEGORIES.pub].map((item) => item.key)))
              .filter(Boolean)
          ),
        };
      })
      .sort((a, b) => b.overall - a.overall);
  }, [pubs, scores]);

  const updateScore = async (field, score) => {
    if (!safeJudge) return;
    const nextEntry = { ...currentEntry, [field]: score };
    setScores((prev) => ({ ...prev, [currentKey]: nextEntry }));
    if (supabase && backendMode === "supabase") {
      await supabase.from("bar_crawl_scores").upsert({ pub: selectedPub, judge: safeJudge, scores: nextEntry });
    }
  };

  const copySetupSql = async () => {
    await navigator.clipboard.writeText(setupSql);
    setSyncStatus("SQL copied");
    setTimeout(() => setSyncStatus(backendMode === "supabase" ? "Live" : "Local only"), 1200);
  };

  const heroBrand = PUB_BRANDING[selectedPub] || { wordmark: selectedPub.toUpperCase() };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#5a3418_0%,#2c180b_22%,#1a1008_100%)] px-2 py-3 text-[#4d2d15]">
      <div className="mx-auto max-w-md rounded-[34px] bg-[linear-gradient(180deg,#a86a32_0%,#6e431d_10%,#2d170b_16%,#2d170b_100%)] p-2 shadow-2xl shadow-black/40">
        <div className="overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#f0d3a1_0%,#e6c18a_8%,#f5dfb8_20%,#f0d3a1_100%)]">
          <div className="relative px-4 pb-5 pt-3">
            <div className="absolute left-0 right-0 top-0 h-16 bg-[linear-gradient(180deg,#b97b3f_0%,#e7c98f_100%)] shadow-[0_10px_20px_rgba(0,0,0,0.22)]" />
            <div className="absolute left-4 right-4 top-[52px] bottom-4 rounded-[26px] border-[3px] border-[#8b5a2a] bg-[radial-gradient(circle_at_top,#f8e7c5_0%,#efd3a2_55%,#ddb171_100%)]" />
            <div className="absolute left-6 right-6 top-[64px] bottom-6 rounded-[22px] border-4 border-[#9a6b3c]" />
            <div className="absolute left-8 right-8 top-[76px] bottom-8 rounded-[18px] border border-[#8d5f33]/60" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(180deg,#e7c98f_0%,#b97b3f_100%)] shadow-[0_-10px_20px_rgba(0,0,0,0.18)]" />

            <div className="relative z-10 px-2 pt-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.35em] text-[#7c4a22]">Toronto Crusade</div>
                  <h1 className="mt-2 text-3xl font-black leading-none text-[#3f210d]">The Guinness Crusade</h1>
                  <p className="mt-2 text-sm text-[#704322]">An illuminated score scroll for noble pints and worthy halls.</p>
                </div>
                <div className="rounded-full border border-[#8f5b26]/35 bg-[#f7e5c3]/75 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a3f1d]">
                  {backendMode === "supabase" ? syncStatus : "Local"}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <img src="/logo.png" alt="The Guinness Crusade logo" className="w-36 max-w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.25)]" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <CrusadeButton active={backendMode === "local"} onClick={() => setBackendMode("local")}>Local Keep</CrusadeButton>
                <CrusadeButton active={backendMode === "supabase"} onClick={() => setBackendMode("supabase")}>Live Crusade</CrusadeButton>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4 px-4 pb-8 pt-2">
            <ScrollSection>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#6a3d18]">
                <Shield className="h-4 w-4" /> Muster the crusade
              </div>
              <div className="grid gap-3">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#8a6038]">Crusader name</label>
                  <input
                    value={crusaderName}
                    onChange={(e) => setCrusaderName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-[#9a6b3c]/35 bg-[#f8e6c5]/85 px-4 py-3 text-base text-[#4c2b14] outline-none placeholder:text-[#9a7551]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#8a6038]">Pub</label>
                  <SelectBox value={selectedPub} onChange={setSelectedPub} options={pubs} />
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#9a6b3c]/30 bg-[#f7e4c1]/70 p-4 text-center shadow-inner">
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#8d6032]">Current target</div>
                <div className="mt-2 text-2xl font-black text-[#3f210d]">{heroBrand.wordmark}</div>
              </div>
            </ScrollSection>

            <ScrollSection>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6a3d18]">
                  <ScrollText className="h-4 w-4" /> Score the siege
                </div>
                <div className="rounded-full border border-[#9a6b3c]/25 bg-[#f7e4c1]/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#8a6038]">
                  Illuminated Scroll
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <CrusadeButton active={selectedGroup === "pint"} onClick={() => setSelectedGroup("pint")}>The Pint</CrusadeButton>
                <CrusadeButton active={selectedGroup === "pub"} onClick={() => setSelectedGroup("pub")}>The Pub</CrusadeButton>
              </div>

              {!safeJudge && (
                <div className="mb-4 rounded-2xl border border-dashed border-[#9a6b3c]/35 bg-[#f7e4c1]/60 px-4 py-3 text-sm text-[#7a5130]">
                  Enter your crusader name above to begin scoring.
                </div>
              )}

              <div className="space-y-4">
                {activeCategories.map((category) => {
                  const Icon = category.icon;
                  const currentScore = Number(currentEntry?.[category.key] || 0);
                  return (
                    <motion.div
                      key={category.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border border-[#9a6b3c]/30 bg-[linear-gradient(180deg,rgba(248,230,197,0.9),rgba(239,208,158,0.82))] p-4 shadow-[0_10px_20px_rgba(88,49,20,0.12)]"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-2xl border border-[#9a6b3c]/30 bg-[#f7dfb2]/85 p-2 text-[#6a3d18]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#4b2812]">{category.title}</div>
                          <div className="text-sm text-[#7a5130]">{scoreLabel(category.key, currentScore)}</div>
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
            </ScrollSection>

            <div className="grid grid-cols-3 gap-3">
              <ScrollSection className="p-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#8a6038]">Pint</div>
                <div className="mt-2 text-2xl font-black text-[#4b2812]">{formatScore(groupAverage(currentEntry, "pint"))}</div>
              </ScrollSection>
              <ScrollSection className="p-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#8a6038]">Pub</div>
                <div className="mt-2 text-2xl font-black text-[#4b2812]">{formatScore(groupAverage(currentEntry, "pub"))}</div>
              </ScrollSection>
              <ScrollSection className="p-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#8a6038]">Overall</div>
                <div className="mt-2 text-2xl font-black text-[#4b2812]">{formatScore(entryAverage(currentEntry, [...CATEGORIES.pint, ...CATEGORIES.pub].map((item) => item.key)))}</div>
              </ScrollSection>
            </div>

            <ScrollSection>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6a3d18]">
                  <Trophy className="h-4 w-4" /> Leaderboard
                </div>
                <button onClick={copySetupSql} className="rounded-2xl border border-[#9a6b3c]/35 bg-[#f7e4c1]/80 px-3 py-2 text-xs text-[#6f4321]">
                  <Copy className="mr-1 inline h-3 w-3" /> SQL
                </button>
              </div>

              <div className="space-y-3">
                {leaderboard.map((item, index) => (
                  <div key={item.pub} className="rounded-2xl border border-[#9a6b3c]/30 bg-[#f7e4c1]/70 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#8f5b26] px-2 py-1 text-xs font-bold text-[#f7e4c1]">#{index + 1}</span>
                          <span className="font-semibold text-[#4b2812]">{item.pub}</span>
                        </div>
                        <div className="mt-1 text-sm text-[#7a5130]">{item.entries} scorecard{item.entries === 1 ? "" : "s"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#4b2812]">{formatScore(item.overall)}</div>
                        <div className="text-xs text-[#8a6038]">overall</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-xl bg-[#efd7ab]/70 px-3 py-2 text-[#6a4020]">Pint: <span className="font-semibold text-[#4b2812]">{formatScore(item.pint)}</span></div>
                      <div className="rounded-xl bg-[#efd7ab]/70 px-3 py-2 text-[#6a4020]">Pub: <span className="font-semibold text-[#4b2812]">{formatScore(item.pubScore)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollSection>
          </div>
        </div>
      </div>
    </div>
  );
}
