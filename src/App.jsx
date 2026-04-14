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

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');
    * { font-family: 'IM Fell English', Georgia, serif; }
    h1, h2, .cinzel { font-family: 'Cinzel', Georgia, serif; }
    .cinzel-deco { font-family: 'Cinzel Decorative', Georgia, serif; }

    .scroll-btn {
      font-family: 'Cinzel', Georgia, serif;
      letter-spacing: 0.06em;
      transition: all 0.2s ease;
    }
    .scroll-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

    .parchment-section {
      background: linear-gradient(180deg, rgba(245,225,180,0.82) 0%, rgba(228,198,145,0.78) 100%);
      border: 1.5px solid rgba(139,90,43,0.45);
      border-radius: 6px;
      box-shadow: inset 0 1px 3px rgba(255,240,200,0.6), 0 4px 14px rgba(80,40,10,0.18);
    }

    .pill-option {
      font-family: 'IM Fell English', Georgia, serif;
      transition: all 0.18s ease;
      border-radius: 4px;
    }
    .pill-option:hover { filter: brightness(1.06); }

    .score-badge {
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 700;
    }

    .parchment-section::after {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      border-radius: inherit;
    }
  `}</style>
);

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
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
function formatScore(value) {
  return value ? value.toFixed(2) : "—";
}
function entryAverage(entry, keys) {
  const values = keys.map((k) => Number(entry?.[k])).filter(Boolean);
  return average(values);
}
function groupAverage(entry, groupKey) {
  return entryAverage(entry, CATEGORIES[groupKey].map((i) => i.key));
}
function scoreLabel(field, score) {
  return QUALITATIVE[field].find((i) => i.score === score)?.label || "Unrated";
}

function ScrollToggle({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="scroll-btn"
      style={{
        padding: "8px 18px",
        fontSize: "11px",
        fontWeight: active ? 700 : 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        border: active ? "2px solid #6b3d14" : "1.5px solid rgba(107,61,20,0.4)",
        background: active
          ? "linear-gradient(180deg,#8f5b26 0%,#6b3d14 100%)"
          : "linear-gradient(180deg,rgba(245,225,180,0.9) 0%,rgba(220,190,130,0.85) 100%)",
        color: active ? "#f8e8c8" : "#5c3412",
        borderRadius: "3px",
        boxShadow: active
          ? "0 4px 12px rgba(80,40,10,0.35), inset 0 1px 0 rgba(255,230,160,0.25)"
          : "0 2px 6px rgba(80,40,10,0.15)",
      }}
    >
      {children}
    </button>
  );
}

function OptionPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="pill-option"
      style={{
        width: "100%",
        padding: "10px 14px",
        textAlign: "left",
        fontSize: "13px",
        border: active ? "1.5px solid #6b3d14" : "1px solid rgba(139,90,43,0.35)",
        background: active
          ? "linear-gradient(90deg,#7a4720 0%,#9a5e2c 100%)"
          : "rgba(245,225,175,0.6)",
        color: active ? "#f8e8c8" : "#3e1f08",
        boxShadow: active ? "0 3px 10px rgba(80,40,10,0.3)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function ParchmentSection({ children, style = {} }) {
  return (
    <div
      className="parchment-section"
      style={{ position: "relative", padding: "16px", ...style }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, children, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {Icon && (
          <div style={{
            padding: "5px",
            border: "1px solid rgba(139,90,43,0.4)",
            background: "rgba(245,215,160,0.7)",
            borderRadius: "3px",
            color: "#5c3412",
          }}>
            <Icon size={14} />
          </div>
        )}
        <span className="cinzel" style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#4a2610", textTransform: "uppercase" }}>
          {children}
        </span>
      </div>
      {right && <div>{right}</div>}
    </div>
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
    if (!raw) { setHydrated(true); return; }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.pubs?.length) setPubs(parsed.pubs);
      if (parsed.selectedPub) setSelectedPub(parsed.selectedPub);
      if (parsed.crusaderName) setCrusaderName(parsed.crusaderName);
      if (parsed.scores) setScores(parsed.scores);
    } finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pubs, selectedPub, crusaderName, scores }));
  }, [hydrated, pubs, selectedPub, crusaderName, scores]);

  useEffect(() => {
    if (!supabase || !hydrated || backendMode !== "supabase") return;
    let scoreChannel;
    const init = async () => {
      setSyncStatus("Loading campaign…");
      const { data: scoreRows, error } = await supabase.from("bar_crawl_scores").select("pub, judge, scores");
      if (error) { setSyncStatus("Run setup SQL first"); return; }
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
    return () => { if (scoreChannel) supabase.removeChannel(scoreChannel); };
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
          pint: average(entries.map((e) => groupAverage(e, "pint")).filter(Boolean)),
          pubScore: average(entries.map((e) => groupAverage(e, "pub")).filter(Boolean)),
          overall: average(
            entries.map((e) => entryAverage(e, [...CATEGORIES.pint, ...CATEGORIES.pub].map((i) => i.key))).filter(Boolean)
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
    <>
      <FontImport />
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#1a0e05 0%,#0f0803 100%)",
        padding: "0 0 48px",
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", position: "relative" }}>
          <div style={{
            position: "relative",
            backgroundImage: "url('/scroll.jpg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            paddingTop: "13%",
            paddingBottom: "13%",
            paddingLeft: "10%",
            paddingRight: "10%",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>

              {/* Logo + Title */}
              <div style={{ textAlign: "center", paddingBottom: "4px" }}>
                <img
                  src="/logo.png"
                  alt="The Guinness Crusade"
                  style={{
                    width: "180px",
                    maxWidth: "100%",
                    margin: "0 auto 4px",
                    display: "block",
                    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.45))",
                  }}
                />
                <div className="cinzel" style={{ fontSize: "9px", letterSpacing: "0.42em", color: "#7c4a22", textTransform: "uppercase", marginTop: "6px" }}>
                  Toronto · Anno Domini 2025
                </div>
                <div style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "4px 14px",
                  border: "1px solid rgba(139,90,43,0.5)",
                  background: "rgba(245,220,170,0.7)",
                  borderRadius: "2px",
                  fontSize: "10px",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.18em",
                  color: "#5c3412",
                  textTransform: "uppercase",
                }}>
                  {backendMode === "supabase" ? syncStatus : "Local Keep"}
                </div>
              </div>

              <div style={{ textAlign: "center", color: "#9a6b3c", fontSize: "16px", letterSpacing: "6px", opacity: 0.7 }}>
                ⚔ ✦ ⚔
              </div>

              {/* Muster */}
              <ParchmentSection>
                <SectionHeader icon={Shield}>Muster the Crusade</SectionHeader>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label className="cinzel" style={{ display: "block", fontSize: "9px", letterSpacing: "0.3em", color: "#8a5a2a", textTransform: "uppercase", marginBottom: "6px" }}>
                      Crusader Name
                    </label>
                    <input
                      value={crusaderName}
                      onChange={(e) => setCrusaderName(e.target.value)}
                      placeholder="Enter your name"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid rgba(139,90,43,0.4)",
                        background: "rgba(252,238,205,0.8)",
                        color: "#3e1f08",
                        fontSize: "14px",
                        fontFamily: "'Cinzel', Georgia, serif",
                        outline: "none",
                        borderRadius: "3px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label className="cinzel" style={{ display: "block", fontSize: "9px", letterSpacing: "0.3em", color: "#8a5a2a", textTransform: "uppercase", marginBottom: "6px" }}>
                      Tavern
                    </label>
                    <select
                      value={selectedPub}
                      onChange={(e) => setSelectedPub(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid rgba(139,90,43,0.4)",
                        background: "rgba(252,238,205,0.8)",
                        color: "#3e1f08",
                        fontSize: "14px",
                        fontFamily: "'Cinzel', Georgia, serif",
                        outline: "none",
                        borderRadius: "3px",
                        appearance: "none",
                      }}
                    >
                      {pubs.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Current Pillaging */}
                <div style={{
                  marginTop: "14px",
                  padding: "14px",
                  border: "1.5px solid rgba(139,90,43,0.5)",
                  background: "linear-gradient(180deg,rgba(252,230,180,0.7) 0%,rgba(230,195,130,0.65) 100%)",
                  borderRadius: "3px",
                  textAlign: "center",
                  boxShadow: "inset 0 1px 3px rgba(255,240,200,0.5)",
                }}>
                  <div className="cinzel" style={{ fontSize: "9px", letterSpacing: "0.35em", color: "#8d6032", textTransform: "uppercase" }}>
                    Current Pillaging
                  </div>
                  <div className="cinzel-deco" style={{ marginTop: "6px", fontSize: "20px", fontWeight: 700, color: "#3f210d", letterSpacing: "0.06em" }}>
                    {heroBrand.wordmark}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                  <ScrollToggle active={backendMode === "local"} onClick={() => setBackendMode("local")}>Local Keep</ScrollToggle>
                  <ScrollToggle active={backendMode === "supabase"} onClick={() => setBackendMode("supabase")}>Live Crusade</ScrollToggle>
                </div>
              </ParchmentSection>

              {/* Score */}
              <ParchmentSection>
                <SectionHeader
                  icon={ScrollText}
                  right={
                    <span className="cinzel" style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#8a6038", textTransform: "uppercase", padding: "4px 10px", border: "1px solid rgba(154,107,60,0.3)", background: "rgba(247,228,193,0.7)", borderRadius: "2px" }}>
                      Illuminated Scroll
                    </span>
                  }
                >
                  Score the Siege
                </SectionHeader>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <ScrollToggle active={selectedGroup === "pint"} onClick={() => setSelectedGroup("pint")}>The Pint</ScrollToggle>
                  <ScrollToggle active={selectedGroup === "pub"} onClick={() => setSelectedGroup("pub")}>The Pub</ScrollToggle>
                </div>

                {!safeJudge && (
                  <div style={{
                    marginBottom: "14px",
                    padding: "12px 14px",
                    border: "1px dashed rgba(154,107,60,0.45)",
                    background: "rgba(247,228,193,0.55)",
                    fontSize: "13px",
                    color: "#7a5130",
                    borderRadius: "3px",
                    fontStyle: "italic",
                  }}>
                    Enter thy crusader name above to begin the reckoning.
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {activeCategories.map((category) => {
                    const Icon = category.icon;
                    const currentScore = Number(currentEntry?.[category.key] || 0);
                    return (
                      <motion.div
                        key={category.key}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          border: "1px solid rgba(139,90,43,0.35)",
                          background: "linear-gradient(180deg,rgba(250,232,195,0.88) 0%,rgba(235,205,150,0.8) 100%)",
                          borderRadius: "4px",
                          padding: "14px",
                          boxShadow: "0 4px 12px rgba(80,40,10,0.1)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                          <div style={{
                            padding: "6px",
                            border: "1px solid rgba(139,90,43,0.35)",
                            background: "rgba(245,215,155,0.8)",
                            borderRadius: "3px",
                            color: "#6a3d18",
                          }}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <div className="cinzel" style={{ fontSize: "12px", fontWeight: 700, color: "#3f1f08", letterSpacing: "0.08em" }}>{category.title}</div>
                            <div style={{ fontSize: "12px", color: "#7a5130", fontStyle: "italic" }}>{scoreLabel(category.key, currentScore)}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {QUALITATIVE[category.key].map((option) => (
                            <OptionPill key={option.score} active={currentScore === option.score} onClick={() => updateScore(category.key, option.score)}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                <span>{option.label}</span>
                                <span className="score-badge" style={{
                                  fontSize: "10px",
                                  padding: "2px 7px",
                                  border: "1px solid currentColor",
                                  borderRadius: "2px",
                                  opacity: 0.75,
                                  letterSpacing: "0.05em",
                                }}>
                                  {option.score}/5
                                </span>
                              </div>
                            </OptionPill>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ParchmentSection>

              {/* Score summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Pint", value: formatScore(groupAverage(currentEntry, "pint")) },
                  { label: "Pub", value: formatScore(groupAverage(currentEntry, "pub")) },
                  { label: "Overall", value: formatScore(entryAverage(currentEntry, [...CATEGORIES.pint, ...CATEGORIES.pub].map((i) => i.key))) },
                ].map((item) => (
                  <ParchmentSection key={item.label} style={{ padding: "12px 8px", textAlign: "center" }}>
                    <div className="cinzel" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#8a6038", textTransform: "uppercase" }}>{item.label}</div>
                    <div className="cinzel" style={{ marginTop: "6px", fontSize: "22px", fontWeight: 900, color: "#3f1f08" }}>{item.value}</div>
                  </ParchmentSection>
                ))}
              </div>

              {/* Leaderboard */}
              <ParchmentSection>
                <SectionHeader
                  icon={Trophy}
                  right={
                    <button
                      onClick={copySetupSql}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "5px 10px",
                        border: "1px solid rgba(154,107,60,0.4)",
                        background: "rgba(247,228,193,0.8)",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontFamily: "'Cinzel', serif",
                        color: "#6f4321",
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <Copy size={11} /> SQL
                    </button>
                  }
                >
                  The Order of Merit
                </SectionHeader>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {leaderboard.map((item, index) => (
                    <div key={item.pub} style={{
                      border: "1px solid rgba(139,90,43,0.35)",
                      background: "rgba(247,228,185,0.65)",
                      borderRadius: "4px",
                      padding: "12px",
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="cinzel" style={{
                              padding: "2px 8px",
                              background: "#7a4a20",
                              color: "#f7e4c1",
                              fontSize: "11px",
                              fontWeight: 700,
                              borderRadius: "2px",
                              letterSpacing: "0.05em",
                            }}>#{index + 1}</span>
                            <span className="cinzel" style={{ fontWeight: 700, fontSize: "13px", color: "#3f1f08" }}>{item.pub}</span>
                          </div>
                          <div style={{ marginTop: "4px", fontSize: "12px", color: "#7a5130", fontStyle: "italic" }}>
                            {item.entries} {item.entries === 1 ? "scorecard" : "scorecards"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="cinzel" style={{ fontSize: "24px", fontWeight: 900, color: "#3f1f08", lineHeight: 1 }}>{formatScore(item.overall)}</div>
                          <div className="cinzel" style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#8a6038", textTransform: "uppercase" }}>overall</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                        {[
                          { label: "Pint", value: formatScore(item.pint) },
                          { label: "Pub", value: formatScore(item.pubScore) },
                        ].map((s) => (
                          <div key={s.label} style={{
                            padding: "8px 10px",
                            background: "rgba(239,215,171,0.7)",
                            borderRadius: "3px",
                            fontSize: "13px",
                            color: "#6a4020",
                          }}>
                            <span className="cinzel" style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}: </span>
                            <span className="cinzel" style={{ fontWeight: 700, color: "#3f1f08" }}>{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ParchmentSection>

              <div style={{ textAlign: "center", color: "#9a6b3c", fontSize: "14px", letterSpacing: "8px", opacity: 0.6, paddingBottom: "4px" }}>
                ✦ ⚔ ✦
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
