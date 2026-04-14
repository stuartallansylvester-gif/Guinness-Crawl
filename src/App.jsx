import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Shield, Trophy, Flame, ScrollText, Users, Swords, Castle, Copy, Crown, Coins } from "lucide-react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: radial-gradient(ellipse at center top, #1e0e05 0%, #0a0401 100%);
      min-height: 100vh;
    }

    .cinzel       { font-family: 'Cinzel', Georgia, serif; }
    .cinzel-deco  { font-family: 'Cinzel Decorative', Georgia, serif; }
    .fell         { font-family: 'IM Fell English', Georgia, serif; }

    .scroll-rod {
      position: relative;
      height: 54px;
      width: calc(100% + 40px);
      margin-left: -20px;
      border-radius: 27px;
      background: linear-gradient(180deg,
        #0e0604 0%,   #2e1408 6%,   #6a3418 15%,
        #b06828 28%,  #d89848 40%,  #f0b858 48%,
        #ffd070 50%,  #f0b858 52%,  #d89848 60%,
        #b06828 72%,  #6a3418 85%,  #2e1408 94%,
        #0e0604 100%
      );
      box-shadow:
        0 10px 32px rgba(0,0,0,0.85),
        0 3px 8px rgba(0,0,0,0.6),
        inset 0 1px 3px rgba(255,220,140,0.25),
        inset 0 -1px 2px rgba(0,0,0,0.4);
      z-index: 4;
    }

    .scroll-rod::before, .scroll-rod::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 26px;
      height: 46px;
      border-radius: 50%;
      background: radial-gradient(ellipse 55% 50% at 38% 45%, #e8b050, #7a3808 80%);
      box-shadow: 3px 0 12px rgba(0,0,0,0.7);
    }
    .scroll-rod::before { left: -10px; }
    .scroll-rod::after  { right: -10px; box-shadow: -3px 0 12px rgba(0,0,0,0.7); }

    .parchment-body {
      position: relative;
      z-index: 2;
      margin-top: -18px;
      margin-bottom: -18px;
      padding: 34px 28px 34px;
      background:
        radial-gradient(ellipse at 8%  12%,  rgba(155, 95, 18, 0.38) 0%, transparent 42%),
        radial-gradient(ellipse at 92% 10%,  rgba(140, 82, 12, 0.28) 0%, transparent 36%),
        radial-gradient(ellipse at 15% 55%,  rgba(120, 72, 10, 0.18) 0%, transparent 30%),
        radial-gradient(ellipse at 88% 60%,  rgba(130, 78, 12, 0.22) 0%, transparent 34%),
        radial-gradient(ellipse at 50% 92%,  rgba(145, 88, 15, 0.32) 0%, transparent 40%),
        radial-gradient(ellipse at 50% 50%,  rgba(255,240,195,0.12) 0%, transparent 60%),
        linear-gradient(180deg,
          #c89838 0%, #ddb048 5%, #edcc78 12%,
          #f5dfa0 22%, #faf0cc 38%, #f8eac4 50%,
          #f5e0a8 62%, #edcc78 78%, #ddb048 90%,
          #c89838 100%
        );
      box-shadow:
        inset 14px 0 28px rgba(70,35,5,0.32),
        inset -14px 0 28px rgba(70,35,5,0.32),
        inset 0 8px 16px rgba(50,25,3,0.22),
        inset 0 -8px 16px rgba(50,25,3,0.22);
    }

    .parchment-body::before, .parchment-body::after {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      width: 18px;
      pointer-events: none;
      z-index: 3;
    }
    .parchment-body::before { left: 0; background: linear-gradient(90deg, rgba(60,28,4,0.35), transparent); }
    .parchment-body::after  { right: 0; background: linear-gradient(270deg, rgba(60,28,4,0.35), transparent); }

    .parchment-frame {
      border: 2px solid rgba(90,50,10,0.55);
      padding: 22px 16px 20px;
      position: relative;
    }
    .parchment-frame::before {
      content: '';
      position: absolute;
      inset: 5px;
      border: 1px solid rgba(90,50,10,0.28);
      pointer-events: none;
    }

    .corner { position: absolute; width: 28px; height: 28px; }
    .corner svg { width: 100%; height: 100%; }
    .corner-tl { top: -1px;    left: -1px;  }
    .corner-tr { top: -1px;    right: -1px; transform: scaleX(-1); }
    .corner-bl { bottom: -1px; left: -1px;  transform: scaleY(-1); }
    .corner-br { bottom: -1px; right: -1px; transform: scale(-1); }

    .crusade-logo {
      display: block;
      width: 200px;
      max-width: 80%;
      margin: 0 auto 6px;
      mix-blend-mode: multiply;
      filter: drop-shadow(0 3px 8px rgba(60,28,4,0.3));
    }

    .section-card {
      background: linear-gradient(180deg, rgba(255,243,205,0.72) 0%, rgba(238,214,158,0.68) 100%);
      border: 1.5px solid rgba(100,58,12,0.42);
      border-radius: 3px;
      padding: 14px;
      position: relative;
      box-shadow: 0 3px 10px rgba(50,24,3,0.14), inset 0 1px 2px rgba(255,235,175,0.5);
    }

    .parchment-input, .parchment-select {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid rgba(80,40,8,0.55);
      background: rgba(255,243,210,0.92);
      color: #180a02;
      font-size: 14px;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 600;
      outline: none;
      border-radius: 2px;
      letter-spacing: 0.04em;
      box-shadow: inset 0 2px 4px rgba(60,28,4,0.12);
      transition: border-color 0.2s;
    }
    .parchment-input:focus, .parchment-select:focus {
      border-color: rgba(80,40,8,0.85);
      box-shadow: inset 0 2px 4px rgba(60,28,4,0.18), 0 0 0 2px rgba(180,120,40,0.18);
    }
    .parchment-input::placeholder { color: rgba(80,38,8,0.4); font-weight: 400; }
    .parchment-select option { background: #f5dfa0; color: #180a02; }

    .crusade-btn {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      border-radius: 2px;
      padding: 9px 14px;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .crusade-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .crusade-btn-active {
      background: linear-gradient(180deg, #8a4e1c 0%, #5c3010 100%);
      border: 2px solid #3e1e08;
      color: #f8e8c0;
      box-shadow: 0 4px 14px rgba(30,12,2,0.45), inset 0 1px 0 rgba(255,210,130,0.2);
    }
    .crusade-btn-inactive {
      background: linear-gradient(180deg, rgba(255,240,195,0.85) 0%, rgba(230,200,140,0.8) 100%);
      border: 1.5px solid rgba(90,48,10,0.45);
      color: #3a1a06;
      box-shadow: 0 2px 6px rgba(30,12,2,0.15);
    }

    .option-pill {
      width: 100%;
      padding: 9px 12px;
      text-align: left;
      font-family: 'IM Fell English', Georgia, serif;
      font-size: 13px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .option-pill-active {
      background: linear-gradient(90deg, #6e3a10 0%, #9a5820 100%);
      border: 1.5px solid #4a2208;
      color: #f8e8c0;
      box-shadow: 0 3px 10px rgba(30,10,2,0.35);
    }
    .option-pill-inactive {
      background: rgba(255,240,195,0.55);
      border: 1px solid rgba(90,48,10,0.32);
      color: #1e0e04;
    }
    .option-pill-inactive:hover { background: rgba(245,225,165,0.75); }

    .lb-row {
      border: 1px solid rgba(100,58,12,0.38);
      background: rgba(248,230,180,0.6);
      border-radius: 3px;
      padding: 12px;
    }

    .ornament {
      text-align: center;
      font-family: 'Cinzel', serif;
      color: rgba(90,50,10,0.6);
      font-size: 13px;
      letter-spacing: 10px;
      padding: 2px 0;
    }
  `}</style>
);

const CornerOrnament = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2 L14 2 L14 5 L5 5 L5 14 L2 14 Z" fill="rgba(85,45,8,0.55)" />
    <path d="M2 2 L8 2 L8 4 L4 4 L4 8 L2 8 Z" fill="rgba(85,45,8,0.4)" />
    <circle cx="14" cy="14" r="3.5" stroke="rgba(85,45,8,0.5)" strokeWidth="1.2" fill="none" />
    <path d="M14 10.5 L14 6" stroke="rgba(85,45,8,0.45)" strokeWidth="1" />
    <path d="M10.5 14 L6 14" stroke="rgba(85,45,8,0.45)" strokeWidth="1" />
    <path d="M11.5 11.5 L8 8" stroke="rgba(85,45,8,0.35)" strokeWidth="0.8" />
  </svg>
);

const SUPABASE_URL = "https://zsmjicjsyowpnwbpbyvu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0o1l0knnxpTOg7aHcSKqfQ_6gkb7bck";
const hasSupabaseConfig =
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("YOUR_PROJECT") && !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const STORAGE_KEY = "guinness-crusade-v7";
const DEFAULT_PUBS = ["Allen's", "Noonan's", "McVeigh's", "P.J. O'Brien"];

const setupSql = `create table if not exists public.bar_crawl_settings (
  id int primary key, pubs jsonb not null, players jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.bar_crawl_scores (
  pub text not null, judge text not null,
  scores jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (pub, judge)
);
alter publication supabase_realtime add table public.bar_crawl_settings;
alter publication supabase_realtime add table public.bar_crawl_scores;`;

const QUALITATIVE = {
  pour:             [{label:"Botched Pour",score:1},{label:"Uneven Pour",score:2},{label:"Decent Pour",score:3},{label:"Proper Pour",score:4},{label:"Royal Pour",score:5}],
  head:             [{label:"Flat Crown",score:1},{label:"Thin Crown",score:2},{label:"Fair Head",score:3},{label:"Stately Head",score:4},{label:"Cathedral Crown",score:5}],
  temp:             [{label:"Campfire Warm",score:1},{label:"Off-Temp",score:2},{label:"Serviceable",score:3},{label:"Well Kept",score:4},{label:"Cellar Perfect",score:5}],
  taste:            [{label:"Spoiled Draught",score:1},{label:"Rough Sip",score:2},{label:"Sound Pint",score:3},{label:"Rich Draught",score:4},{label:"Holy Nectar",score:5}],
  vibe:             [{label:"Bleak Hall",score:1},{label:"Cold Keep",score:2},{label:"Lively Hall",score:3},{label:"Noble Tavern",score:4},{label:"Legendary Great Hall",score:5}],
  irishAuthenticity:[{label:"False Banner",score:1},{label:"Tourist Relic",score:2},{label:"Somewhat True",score:3},{label:"Faithful House",score:4},{label:"Emerald Sanctum",score:5}],
  service:          [{label:"Abandoned Post",score:1},{label:"Slow Watch",score:2},{label:"Steady Service",score:3},{label:"Swift Stewardship",score:4},{label:"Knightly Service",score:5}],
  price:            [{label:"King's Ransom",score:1},{label:"Heavy Tribute",score:2},{label:"Fair Levy",score:3},{label:"Worthy Coin",score:4},{label:"Crusader's Bargain",score:5}],
  pagansMoors:      [{label:"Infidel Stronghold",score:1},{label:"Heavy Resistance",score:2},{label:"Scattered Forces",score:3},{label:"Lone Saracen",score:4},{label:"Safe Ground",score:5}],
};

const CATEGORIES = {
  pint: [
    {
      key:"pour", title:"Pour", icon:Flame,
      desc:"The sacred two-stage ritual separates the worthy tavern from the wretched. A true pour demands patience — settle, then crown. Haste is heresy.",
    },
    {
      key:"head", title:"Head", icon:Crown,
      desc:"The creamy crown atop thy pint is the mark of a righteous house. Too thin and the keep has failed thee. A cathedral dome of foam is the highest honour.",
    },
    {
      key:"temp", title:"Temperature", icon:Castle,
      desc:"A pint served warm is an affront to the Crusade. The noble cellar keeps its charge cool and true. Test the chill — thy palate shall know justice.",
    },
    {
      key:"taste", title:"Taste", icon:Trophy,
      desc:"The dark nectar must sing of roasted grain and Irish earth. A rich, smooth draught is the reward of the righteous. A foul sip is cause for immediate retreat.",
    },
  ],
  pub: [
    {
      key:"vibe", title:"Vibe", icon:ScrollText,
      desc:"Does this hall stir the blood of a Crusader? The air, the noise, the fellowship — a great tavern feels like a campaign won. A bleak hall is a campaign lost.",
    },
    {
      key:"irishAuthenticity", title:"Irish Authenticity", icon:Shield,
      desc:"Beware the false banner. Many a pub drapes itself in green yet harbours no true Irish soul. Seek the worn wood, the craic, the weight of history in its walls.",
    },
    {
      key:"service", title:"Service", icon:Users,
      desc:"A Crusader left waiting at the bar is a Crusader dishonoured. The steward's duty is swift, cheerful, and sure. Knightly service turns a good pint into a legendary one.",
    },
    {
      key:"price", title:"Price", icon:Coins,
      desc:"Even the holiest nectar must be fairly priced. A king's ransom for a pint is a declaration of war. Judge the tribute asked against the quality rendered.",
    },
    {
      key:"pagansMoors", title:"Pagans / Moors", icon:Swords,
      desc:"Survey the hall and take heed of those who stand apart from our familiar creed and custom. Many non-believers is cause for grave concern.",
    },
  ],
};

const PUB_BRANDING = {
  "Allen's":     {wordmark:"ALLEN'S"},
  "Noonan's":    {wordmark:"NOONAN'S"},
  "McVeigh's":   {wordmark:"McVEIGH'S"},
  "P.J. O'Brien":{wordmark:"P.J. O'BRIEN"},
};

const avg    = arr => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : 0;
const fmt    = v   => v ? v.toFixed(2) : "—";
const eAvg   = (e,keys) => avg(keys.map(k=>Number(e?.[k])).filter(Boolean));
const gAvg   = (e,gk)   => eAvg(e, CATEGORIES[gk].map(i=>i.key));
const sLabel = (f,s)    => QUALITATIVE[f].find(i=>i.score===s)?.label || "Unrated";

const Btn = ({active, onClick, children}) => (
  <button onClick={onClick} className={`crusade-btn ${active?"crusade-btn-active":"crusade-btn-inactive"}`}>
    {children}
  </button>
);

const Pill = ({active, onClick, children}) => (
  <button onClick={onClick} className={`option-pill ${active?"option-pill-active":"option-pill-inactive"}`}>
    {children}
  </button>
);

const FieldLabel = ({children}) => (
  <div className="cinzel" style={{fontSize:"9px",letterSpacing:"0.32em",color:"#4e2408",textTransform:"uppercase",fontWeight:700,marginBottom:"7px"}}>
    {children}
  </div>
);

const SectionHead = ({icon:Icon, children, aside}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
      {Icon && (
        <div style={{padding:"5px",border:"1px solid rgba(90,48,10,0.38)",background:"rgba(248,228,168,0.75)",borderRadius:"2px",color:"#522808"}}>
          <Icon size={13}/>
        </div>
      )}
      <span className="cinzel" style={{fontSize:"12px",fontWeight:700,letterSpacing:"0.12em",color:"#2a1006",textTransform:"uppercase"}}>
        {children}
      </span>
    </div>
    {aside}
  </div>
);

export default function GuinnessCrusadeApp() {
  const [pubs, setPubs]                   = useState(DEFAULT_PUBS);
  const [selectedPub, setSelectedPub]     = useState(DEFAULT_PUBS[0]);
  const [crusaderName, setCrusaderName]   = useState("");
  const [selectedGroup, setSelectedGroup] = useState("pint");
  const [scores, setScores]               = useState({});
  const [backendMode, setBackendMode]     = useState(hasSupabaseConfig ? "supabase" : "local");
  const [syncStatus, setSyncStatus]       = useState(hasSupabaseConfig ? "Connecting…" : "Local only");
  const [hydrated, setHydrated]           = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { setHydrated(true); return; }
    try {
      const p = JSON.parse(raw);
      if (p.pubs?.length)  setPubs(p.pubs);
      if (p.selectedPub)   setSelectedPub(p.selectedPub);
      if (p.crusaderName)  setCrusaderName(p.crusaderName);
      if (p.scores)        setScores(p.scores);
    } finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({pubs, selectedPub, crusaderName, scores}));
  }, [hydrated, pubs, selectedPub, crusaderName, scores]);

  useEffect(() => {
    if (!supabase || !hydrated || backendMode !== "supabase") return;
    let ch;
    (async () => {
      setSyncStatus("Loading campaign…");
      const {data, error} = await supabase.from("bar_crawl_scores").select("pub,judge,scores");
      if (error) { setSyncStatus("Run setup SQL first"); return; }
      const inc = {};
      (data||[]).forEach(r => { inc[`${r.pub}__${r.judge}`] = r.scores||{}; });
      setScores(inc);
      setSyncStatus("Live");
      ch = supabase.channel("gc-scores")
        .on("postgres_changes",{event:"*",schema:"public",table:"bar_crawl_scores"},({new:r})=>{
          if (!r?.pub||!r?.judge) return;
          setScores(prev=>({...prev,[`${r.pub}__${r.judge}`]:r.scores||{}}));
        }).subscribe();
    })();
    return () => { if (ch) supabase.removeChannel(ch); };
  }, [backendMode, hydrated]);

  const safeJudge    = crusaderName.trim();
  const currentKey   = `${selectedPub}__${safeJudge}`;
  const currentEntry = scores[currentKey] || {};
  const activeCats   = CATEGORIES[selectedGroup];
  const allKeys      = [...CATEGORIES.pint,...CATEGORIES.pub].map(i=>i.key);

  const leaderboard = useMemo(() => pubs.map(pub => {
    const entries = Object.entries(scores)
      .filter(([k])=>k.startsWith(`${pub}__`)).map(([,e])=>e).filter(Boolean);
    return {
      pub,
      entries: entries.length,
      pint:    avg(entries.map(e=>gAvg(e,"pint")).filter(Boolean)),
      pubScore:avg(entries.map(e=>gAvg(e,"pub")).filter(Boolean)),
      overall: avg(entries.map(e=>eAvg(e,allKeys)).filter(Boolean)),
    };
  }).sort((a,b)=>b.overall-a.overall), [pubs, scores]);

  const updateScore = async (field, score) => {
    if (!safeJudge) return;
    const next = {...currentEntry, [field]:score};
    setScores(prev=>({...prev,[currentKey]:next}));
    if (supabase && backendMode==="supabase")
      await supabase.from("bar_crawl_scores").upsert({pub:selectedPub,judge:safeJudge,scores:next});
  };

  const brand = PUB_BRANDING[selectedPub] || {wordmark: selectedPub.toUpperCase()};

  return (
    <>
      <GlobalStyles />
      <div style={{minHeight:"100vh", background:"radial-gradient(ellipse at center, #1e0e05 0%, #080301 100%)", padding:"32px 16px 64px", display:"flex", flexDirection:"column", alignItems:"center"}}>
        <div style={{width:"100%", maxWidth:"460px"}}>

          <div className="scroll-rod" />

          <div className="parchment-body">
            <div className="parchment-frame">

              <div className="corner corner-tl"><CornerOrnament/></div>
              <div className="corner corner-tr"><CornerOrnament/></div>
              <div className="corner corner-bl"><CornerOrnament/></div>
              <div className="corner corner-br"><CornerOrnament/></div>

              <div style={{display:"flex", flexDirection:"column", gap:"18px"}}>

                <div style={{textAlign:"center", padding:"8px 0 4px"}}>
                  <img src="/logo.png" alt="The Guinness Crusade" className="crusade-logo" />
                  <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.5em",color:"#6a3a10",textTransform:"uppercase",marginTop:"6px"}}>
                    Toronto · Anno Domini 2025
                  </div>
                  <div style={{display:"inline-block",marginTop:"10px",padding:"4px 16px",border:"1px solid rgba(80,40,8,0.45)",background:"rgba(248,228,168,0.65)",borderRadius:"1px",fontFamily:"'Cinzel',serif",fontSize:"9px",letterSpacing:"0.22em",color:"#4a2008",textTransform:"uppercase",fontWeight:700}}>
                    {backendMode==="supabase" ? syncStatus : "Local Keep"}
                  </div>
                </div>

                <div className="ornament">⚔ ✦ ⚔</div>

                <div className="section-card">
                  <SectionHead icon={Shield}>Muster the Crusade</SectionHead>
                  <div style={{display:"grid", gap:"12px"}}>
                    <div>
                      <FieldLabel>Crusader Name</FieldLabel>
                      <input value={crusaderName} onChange={e=>setCrusaderName(e.target.value)} placeholder="Enter your name" className="parchment-input"/>
                    </div>
                    <div>
                      <FieldLabel>Tavern</FieldLabel>
                      <select value={selectedPub} onChange={e=>setSelectedPub(e.target.value)} className="parchment-select">
                        {pubs.map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{marginTop:"14px",padding:"14px 12px",border:"1.5px solid rgba(80,45,8,0.48)",background:"linear-gradient(180deg,rgba(255,238,188,0.65),rgba(235,200,130,0.6))",borderRadius:"2px",textAlign:"center",boxShadow:"inset 0 1px 4px rgba(255,230,160,0.4)"}}>
                    <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.4em",color:"#6a3a10",textTransform:"uppercase",fontWeight:700}}>Current Pillaging</div>
                    <div className="cinzel-deco" style={{marginTop:"7px",fontSize:"22px",fontWeight:900,color:"#1e0e04",letterSpacing:"0.04em"}}>{brand.wordmark}</div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginTop:"14px"}}>
                    <Btn active={backendMode==="local"}    onClick={()=>setBackendMode("local")}>Local Keep</Btn>
                    <Btn active={backendMode==="supabase"} onClick={()=>setBackendMode("supabase")}>Live Crusade</Btn>
                  </div>
                </div>

                <div className="section-card">
                  <SectionHead
                    icon={ScrollText}
                    aside={<span className="cinzel" style={{fontSize:"8px",letterSpacing:"0.2em",color:"#5a2e08",textTransform:"uppercase",padding:"4px 10px",border:"1px solid rgba(90,48,10,0.35)",background:"rgba(248,228,168,0.6)",borderRadius:"2px",fontWeight:700}}>Illuminated Scroll</span>}
                  >
                    Score the Siege
                  </SectionHead>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
                    <Btn active={selectedGroup==="pint"} onClick={()=>setSelectedGroup("pint")}>The Pint</Btn>
                    <Btn active={selectedGroup==="pub"}  onClick={()=>setSelectedGroup("pub")}>The Pub</Btn>
                  </div>

                  {!safeJudge && (
                    <div style={{marginBottom:"14px",padding:"11px 14px",border:"1px dashed rgba(90,48,10,0.4)",background:"rgba(248,228,168,0.45)",fontSize:"13px",color:"#4a2408",borderRadius:"2px",fontFamily:"'IM Fell English',serif",fontStyle:"italic"}}>
                      Enter thy crusader name above to begin the reckoning.
                    </div>
                  )}

                  <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                    {activeCats.map(cat => {
                      const Icon = cat.icon;
                      const cur  = Number(currentEntry?.[cat.key]||0);
                      return (
                        <motion.div key={cat.key} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                          style={{border:"1px solid rgba(90,50,10,0.3)",background:"linear-gradient(180deg,rgba(255,242,200,0.82),rgba(238,210,152,0.76))",borderRadius:"3px",padding:"13px",boxShadow:"0 3px 10px rgba(40,18,2,0.1)"}}>

                          <div style={{display:"flex",alignItems:"flex-start",gap:"9px",marginBottom:"10px"}}>
                            <div style={{padding:"6px",border:"1px solid rgba(90,50,10,0.32)",background:"rgba(248,225,155,0.8)",borderRadius:"2px",color:"#5a2e08",flexShrink:0,marginTop:"2px"}}>
                              <Icon size={13}/>
                            </div>
                            <div>
                              <div className="cinzel" style={{fontSize:"11px",fontWeight:700,color:"#1e0e04",letterSpacing:"0.08em"}}>{cat.title}</div>
                              <div className="fell" style={{fontSize:"12px",color:"#5a2e08",fontStyle:"italic",lineHeight:1.5,marginTop:"3px"}}>{cat.desc}</div>
                            </div>
                          </div>

                          <div style={{marginBottom:"8px",padding:"5px 10px",background:"rgba(200,160,80,0.2)",borderRadius:"2px",border:"1px solid rgba(90,50,10,0.2)"}}>
                            <span className="cinzel" style={{fontSize:"9px",letterSpacing:"0.2em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>Verdict: </span>
                            <span className="fell" style={{fontSize:"12px",color:"#3a1a06",fontStyle:"italic"}}>{sLabel(cat.key,cur)}</span>
                          </div>

                          <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                            {QUALITATIVE[cat.key].map(opt=>(
                              <Pill key={opt.score} active={cur===opt.score} onClick={()=>updateScore(cat.key,opt.score)}>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                  <span>{opt.label}</span>
                                  <span className="cinzel" style={{fontSize:"10px",padding:"1px 6px",border:"1px solid currentColor",borderRadius:"1px",opacity:0.7,letterSpacing:"0.04em"}}>{opt.score}/5</span>
                                </div>
                              </Pill>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
                  {[
                    {label:"Pint",    value:fmt(gAvg(currentEntry,"pint"))},
                    {label:"Pub",     value:fmt(gAvg(currentEntry,"pub"))},
                    {label:"Overall", value:fmt(eAvg(currentEntry,allKeys))},
                  ].map(item=>(
                    <div key={item.label} className="section-card" style={{padding:"12px 6px",textAlign:"center"}}>
                      <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.3em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>{item.label}</div>
                      <div className="cinzel" style={{marginTop:"6px",fontSize:"24px",fontWeight:900,color:"#1e0e04"}}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="section-card">
                  <SectionHead icon={Trophy}>The Order of Merit</SectionHead>

                  <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                    {leaderboard.map((item,i)=>(
                      <div key={item.pub} className="lb-row">
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"10px"}}>
                          <div>
                            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                              <span className="cinzel" style={{padding:"2px 8px",background:"#6a3810",color:"#f5e0b0",fontSize:"10px",fontWeight:700,borderRadius:"2px",letterSpacing:"0.05em"}}>#{i+1}</span>
                              <span className="cinzel" style={{fontWeight:700,fontSize:"13px",color:"#1e0e04"}}>{item.pub}</span>
                            </div>
                            <div className="fell" style={{marginTop:"4px",fontSize:"12px",color:"#5a2e08",fontStyle:"italic"}}>
                              {item.entries} {item.entries===1?"scorecard":"scorecards"}
                            </div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div className="cinzel" style={{fontSize:"26px",fontWeight:900,color:"#1e0e04",lineHeight:1}}>{fmt(item.overall)}</div>
                            <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.22em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>overall</div>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"10px"}}>
                          {[{label:"Pint",v:fmt(item.pint)},{label:"Pub",v:fmt(item.pubScore)}].map(s=>(
                            <div key={s.label} style={{padding:"7px 10px",background:"rgba(240,212,158,0.65)",borderRadius:"2px"}}>
                              <span className="cinzel" style={{fontSize:"9px",letterSpacing:"0.1em",textTransform:"uppercase",color:"#5a2e08",fontWeight:700}}>{s.label}: </span>
                              <span className="cinzel" style={{fontWeight:700,color:"#1e0e04",fontSize:"13px"}}>{s.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ornament" style={{paddingBottom:"4px"}}>✦ ⚔ ✦</div>

              </div>
            </div>
          </div>

          <div className="scroll-rod" />

        </div>
      </div>
    </>
  );
}
