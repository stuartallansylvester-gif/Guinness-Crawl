import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  Shield,
  Trophy,
  Flame,
  ScrollText,
  Users,
  Swords,
  Castle,
  Crown,
  Coins,
  Beer,
} from "lucide-react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');

    :root {
      --ink: #26170d;
      --paper-light: #f4e7bf;
      --paper-mid: #ead7a3;
      --paper-dark: #cfae71;

      --red-1: #7a1f1f;
      --red-2: #521414;
      --red-3: #a2312d;

      --gold-1: #ead08b;
      --gold-2: #c59a3d;

      --green-1: #233b2d;
      --green-2: #16261d;

      --wood-1: #4b2e18;
      --wood-2: #2c1a0d;
      --wood-3: #6a4122;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root { min-height: 100%; }

    body {
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% 10%, rgba(255,231,180,0.06), transparent 16%),
        radial-gradient(circle at 82% 14%, rgba(110,32,24,0.10), transparent 16%),
        radial-gradient(circle at 22% 76%, rgba(29,55,39,0.10), transparent 20%),
        linear-gradient(180deg, #2b180d 0%, #160d08 100%);
      color: var(--ink);
    }

    .cinzel      { font-family: 'Cinzel', Georgia, serif; }
    .cinzel-deco { font-family: 'Cinzel Decorative', Georgia, serif; }
    .fell        { font-family: 'IM Fell English', Georgia, serif; }

    .scroll-rod {
      position: relative;
      height: 34px;
      width: calc(100% + 24px);
      margin-left: -12px;
      border-radius: 999px;
      background:
        linear-gradient(180deg, #6d4526 0%, #4e301a 16%, #3a220f 48%, #2a180c 52%, #4a2d17 84%, #6a4122 100%);
      box-shadow:
        0 10px 18px rgba(0,0,0,0.42),
        inset 0 1px 0 rgba(255,219,170,0.12),
        inset 0 -2px 4px rgba(0,0,0,0.28);
      z-index: 4;
    }

    .scroll-rod::before,
    .scroll-rod::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 35% 35%, #7a4a24 0%, #4f2f17 38%, #24140a 75%, #120905 100%);
      border: 1px solid rgba(20,8,2,0.55);
      box-shadow: 0 0 0 2px rgba(255,220,170,0.04);
    }

    .scroll-rod::before { left: 8px; }
    .scroll-rod::after  { right: 8px; }

    .parchment-body {
      position: relative;
      z-index: 2;
      margin-top: -10px;
      margin-bottom: -10px;
      padding: 34px 28px 34px;
      background:
        radial-gradient(circle at 12% 18%, rgba(125,64,22,0.10), transparent 18%),
        radial-gradient(circle at 84% 16%, rgba(99,26,19,0.08), transparent 16%),
        radial-gradient(circle at 18% 82%, rgba(98,72,20,0.10), transparent 18%),
        radial-gradient(circle at 78% 74%, rgba(25,52,34,0.08), transparent 18%),
        repeating-linear-gradient(
          0deg,
          rgba(110,86,34,0.030) 0px,
          rgba(110,86,34,0.030) 1px,
          rgba(255,255,255,0.012) 1px,
          rgba(255,255,255,0.012) 3px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(110,86,34,0.018) 0px,
          rgba(110,86,34,0.018) 2px,
          rgba(255,255,255,0.008) 2px,
          rgba(255,255,255,0.008) 5px
        ),
        linear-gradient(180deg, #d4b474 0%, #ead7a3 10%, #f3e7be 24%, #f5ebc9 50%, #efe0b0 76%, #d0ab68 100%);
      box-shadow:
        inset 22px 0 24px rgba(96,60,20,0.16),
        inset -22px 0 24px rgba(96,60,20,0.16),
        inset 0 12px 16px rgba(75,45,16,0.14),
        inset 0 -12px 16px rgba(75,45,16,0.14),
        0 20px 40px rgba(0,0,0,0.25);
      overflow: hidden;
    }

    .parchment-body::before,
    .parchment-body::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .parchment-body::before {
      background:
        linear-gradient(90deg, rgba(102,60,20,0.22), transparent 3%, transparent 97%, rgba(102,60,20,0.18)),
        linear-gradient(180deg, rgba(102,60,20,0.16), transparent 3%, transparent 97%, rgba(102,60,20,0.14));
      mix-blend-mode: multiply;
    }

    .parchment-body::after {
      background:
        radial-gradient(circle at 2% 20%, rgba(112,70,24,0.22), transparent 10%),
        radial-gradient(circle at 98% 22%, rgba(112,70,24,0.18), transparent 10%),
        radial-gradient(circle at 3% 76%, rgba(112,70,24,0.20), transparent 12%),
        radial-gradient(circle at 97% 80%, rgba(112,70,24,0.16), transparent 12%);
      opacity: 0.8;
    }

    .parchment-frame {
      border: 1px solid rgba(92,56,20,0.45);
      padding: 22px 16px 20px;
      position: relative;
      background: rgba(255,250,236,0.06);
      z-index: 2;
    }

    .parchment-frame::before {
      content: '';
      position: absolute;
      inset: 5px;
      border: 1px solid rgba(92,56,20,0.18);
      pointer-events: none;
    }

    .corner { position: absolute; width: 28px; height: 28px; }
    .corner svg { width: 100%; height: 100%; }
    .corner-tl { top: -1px; left: -1px; }
    .corner-tr { top: -1px; right: -1px; transform: scaleX(-1); }
    .corner-bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
    .corner-br { bottom: -1px; right: -1px; transform: scale(-1); }

    .crusade-logo {
      display: block;
      width: 240px;
      max-width: 86%;
      margin: 0 auto 6px;
      background: transparent;
      mix-blend-mode: multiply;
      filter: drop-shadow(0 2px 5px rgba(60,28,4,0.18));
    }

    .section-card {
      background:
        linear-gradient(180deg, rgba(255,247,226,0.72) 0%, rgba(239,220,176,0.74) 100%);
      border: 1px solid rgba(88,54,20,0.30);
      border-radius: 8px;
      padding: 14px;
      position: relative;
      box-shadow:
        0 5px 14px rgba(50,24,3,0.10),
        inset 0 1px 1px rgba(255,244,210,0.45);
      overflow: hidden;
    }

    .section-card::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(135deg, rgba(122,31,31,0.03), transparent 30%),
        linear-gradient(315deg, rgba(35,59,45,0.03), transparent 34%);
    }

    .parchment-input, .parchment-select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid rgba(70,40,14,0.46);
      background: rgba(255,249,233,0.95);
      color: #180a02;
      font-size: 14px;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 600;
      outline: none;
      border-radius: 6px;
      letter-spacing: 0.04em;
      box-shadow: inset 0 2px 3px rgba(60,28,4,0.06);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .parchment-input:focus, .parchment-select:focus, .parchment-number:focus {
      border-color: rgba(122,31,31,0.62);
      box-shadow:
        inset 0 2px 3px rgba(60,28,4,0.08),
        0 0 0 2px rgba(200,159,68,0.16);
    }

    .parchment-input::placeholder { color: rgba(80,38,8,0.4); font-weight: 400; }
    .parchment-select option { background: #f5dfa0; color: #180a02; }

    .parchment-number {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid rgba(70,40,14,0.46);
      background: rgba(255,249,233,0.95);
      color: #180a02;
      font-size: 28px;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 900;
      outline: none;
      border-radius: 0;
      letter-spacing: 0.04em;
      box-shadow: inset 0 2px 3px rgba(60,28,4,0.06);
      text-align: center;
      -moz-appearance: textfield;
    }

    .parchment-number::-webkit-outer-spin-button,
    .parchment-number::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .crusade-btn,
    .stepper-btn,
    .option-pill {
      position: relative;
      overflow: hidden;
    }

    .crusade-btn {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 11px 16px;
      cursor: pointer;
      transition: transform 0.16s ease, filter 0.16s ease, box-shadow 0.16s ease;
    }

    .crusade-btn::before,
    .stepper-btn::before {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      pointer-events: none;
      box-shadow:
        inset 0 1px 0 rgba(255,244,210,0.30),
        inset 0 -2px 3px rgba(20,8,2,0.16);
    }

    .crusade-btn::after {
      content: '✦';
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.5;
      font-size: 10px;
    }

    .crusade-btn:hover,
    .stepper-btn:hover,
    .option-pill:hover {
      filter: brightness(1.04);
      transform: translateY(-1px);
    }

    .crusade-btn:active,
    .stepper-btn:active,
    .option-pill:active {
      transform: translateY(1px) scale(0.995);
      filter: brightness(0.96);
    }

    .crusade-btn-active {
      background:
        linear-gradient(180deg, #9b2f2d 0%, #6f1d1d 54%, #4f1414 100%);
      border: 2px solid #35100f;
      color: #f7e7be;
      box-shadow:
        0 7px 16px rgba(40,10,10,0.26),
        inset 0 1px 0 rgba(255,219,170,0.24);
    }

    .crusade-btn-inactive {
      background:
        linear-gradient(180deg, #314c3a 0%, #213628 52%, #17251c 100%);
      border: 2px solid #0f1a13;
      color: #f2ddb1;
      box-shadow:
        0 6px 12px rgba(20,30,22,0.18),
        inset 0 1px 0 rgba(255,244,210,0.10);
    }

    .option-pill {
      width: 100%;
      padding: 10px 12px;
      text-align: left;
      font-family: 'IM Fell English', Georgia, serif;
      font-size: 13px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .option-pill-active {
      background:
        linear-gradient(90deg, rgba(122,31,31,0.96) 0%, rgba(162,49,45,0.96) 100%);
      border: 1.5px solid #4a1716;
      color: #f8e8c0;
      box-shadow: 0 4px 12px rgba(40,10,10,0.18);
    }

    .option-pill-inactive {
      background: rgba(247,236,202,0.82);
      border: 1px solid rgba(80,54,20,0.24);
      color: #1e0e04;
    }

    .option-pill-inactive:hover {
      background: rgba(238,224,184,0.95);
    }

    .lb-row {
      border: 1px solid rgba(88,54,20,0.24);
      background: rgba(248,236,205,0.68);
      border-radius: 8px;
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

    .stepper-btn {
      width: 100%;
      padding: 8px 0;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      background:
        linear-gradient(180deg, #d3ab55 0%, #b6852d 52%, #7a571e 100%);
      border: 2px solid #4a3311;
      color: #2a1607;
      box-shadow: 0 4px 12px rgba(45,22,6,0.18);
    }

    .chronicle-entry {
      padding: 8px 10px;
      border-left: 3px solid rgba(122,31,31,0.62);
      background: rgba(248,236,205,0.48);
      border-radius: 0 6px 6px 0;
    }

    .battle-cry-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      background: rgba(15,5,1,0.28);
    }

    .battle-cry-text {
      padding: 18px 36px;
      background: linear-gradient(180deg, #8b2a27 0%, #5d1716 100%);
      border: 3px solid #33100f;
      color: #f8e8c0;
      font-family: 'Cinzel Decorative', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.06em;
      border-radius: 8px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.72);
      text-align: center;
    }

    .victory-banner-shell {
      position: fixed;
      top: 26px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      pointer-events: none;
      width: min(92vw, 520px);
    }

    .victory-banner {
      position: relative;
      padding: 18px 24px;
      text-align: center;
      color: #f9ebc8;
      background:
        linear-gradient(180deg, #8a1f1f 0%, #671919 55%, #4d1212 100%);
      border: 3px solid #f0cf84;
      box-shadow:
        0 16px 36px rgba(0,0,0,0.30),
        inset 0 1px 0 rgba(255,230,180,0.18);
      clip-path: polygon(0 0, 100% 0, 96% 100%, 4% 100%);
    }

    .victory-banner::before,
    .victory-banner::after {
      content: '';
      position: absolute;
      top: 12px;
      width: 22px;
      height: calc(100% - 24px);
      background: linear-gradient(180deg, #d6b162 0%, #a67a28 100%);
      border: 2px solid #5e4315;
      z-index: -1;
    }

    .victory-banner::before { left: -10px; }
    .victory-banner::after  { right: -10px; }

    .victory-banner-title {
      font-family: 'Cinzel Decorative', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }

    .victory-banner-sub {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .chronicle-scroll {
      max-height: 420px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(122,31,31,0.4) rgba(248,228,168,0.3);
    }
    .chronicle-scroll::-webkit-scrollbar { width: 6px; }
    .chronicle-scroll::-webkit-scrollbar-track { background: rgba(248,228,168,0.3); border-radius: 3px; }
    .chronicle-scroll::-webkit-scrollbar-thumb { background: rgba(122,31,31,0.4); border-radius: 3px; }
  `}</style>
);

const CornerOrnament = () => (
  <svg viewBox="0 0 28 28" fill="none">
    <path d="M2 2 L14 2 L14 5 L5 5 L5 14 L2 14 Z" fill="rgba(85,45,8,0.55)" />
    <path d="M2 2 L8 2 L8 4 L4 4 L4 8 L2 8 Z" fill="rgba(85,45,8,0.4)" />
    <circle cx="14" cy="14" r="3.5" stroke="rgba(85,45,8,0.5)" strokeWidth="1.2" fill="none" />
    <path d="M14 10.5 L14 6" stroke="rgba(85,45,8,0.45)" strokeWidth="1" />
    <path d="M10.5 14 L6 14" stroke="rgba(85,45,8,0.45)" strokeWidth="1" />
    <path d="M11.5 11.5 L8 8" stroke="rgba(85,45,8,0.35)" strokeWidth="0.8" />
  </svg>
);

/* ── Supabase ─────────────────────────────────────────────────────────────── */
const SUPABASE_URL      = "https://zsmjicjsyowpnwbpbyvu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0o1l0knnxpTOg7aHcSKqfQ_6gkb7bck";
const hasSupabaseConfig = SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("YOUR_PROJECT");
const supabase          = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const STORAGE_KEY       = "guinness-crusade-v12";
const GUINNESS_PUB_KEY  = "__guinness__";
const CHRONICLE_PUB_KEY = "__chronicle__";

const DEFAULT_PUBS = ["Allen's", "Noonan's", "McVeigh's", "P.J. O'Brien", "The Queen & Beaver"];

const MAP_LABELS = {
  "Allen's":            "Allen's",
  "Noonan's":           "Noonan's",
  "McVeigh's":          "McVeigh's",
  "P.J. O'Brien":       "P.J. O'Brien",
  "The Queen & Beaver": "Q & Beaver",
};

/* ── Crusader Titles ──────────────────────────────────────────────────────── */
const CRUSADER_TITLES = [
  "The Merciless",
  "Scourge of Sobriety",
  "Hammer of Heretics",
  "The Pint Slayer",
  "Bane of Barkeeps",
  "The Unquenchable",
  "Destroyer of Draughts",
  "The Black Stout Knight",
  "Wrath of the Tankard",
  "Drinker of Darkness",
  "The Holy Devourer",
  "Conqueror of Kegs",
  "The Foam Reaper",
  "Pillager of Pubs",
  "Sword of the Session",
  "The Relentless",
  "Scourge of the Sober",
  "The Zealot",
  "Iron Liver of Antioch",
  "The Excommunicator",
  "Vanquisher of Lager",
  "First of His Rounds",
  "The Bloodthirsty",
  "Siege-Breaker",
  "The Stout Inquisitor",
];

const hashName = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const getCrusaderTitle = (name) => {
  if (!name) return "";
  return CRUSADER_TITLES[hashName(name) % CRUSADER_TITLES.length];
};

/* ── Scoring data ─────────────────────────────────────────────────────────── */
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
    {key:"pour",  title:"Pour",        icon:Flame,      desc:"The sacred two-stage ritual separates the worthy tavern from the wretched. A true pour demands patience — settle, then crown. Haste is heresy."},
    {key:"head",  title:"Head",        icon:Crown,      desc:"The creamy crown atop thy pint is the mark of a righteous house. Too thin and the keep has failed thee. A cathedral dome of foam is the highest honour."},
    {key:"temp",  title:"Temperature", icon:Castle,     desc:"A pint served warm is an affront to the Crusade. The noble cellar keeps its charge cool and true. Test the chill — thy palate shall know justice."},
    {key:"taste", title:"Taste",       icon:Trophy,     desc:"The dark nectar must sing of roasted grain and Irish earth. A rich, smooth draught is the reward of the righteous. A foul sip is cause for immediate retreat."},
  ],
  pub: [
    {key:"vibe",              title:"Vibe",               icon:ScrollText, desc:"Does this hall stir the blood of a Crusader? The air, the noise, the fellowship — a great tavern feels like a campaign won. A bleak hall is a campaign lost."},
    {key:"irishAuthenticity", title:"Irish Authenticity", icon:Shield,     desc:"Beware the false banner. Many a pub drapes itself in green yet harbours no true Irish soul. Seek the worn wood, the craic, the weight of history in its walls."},
    {key:"service",           title:"Service",            icon:Users,      desc:"A Crusader left waiting at the bar is a Crusader dishonoured. The steward's duty is swift, cheerful, and sure. Knightly service turns a good pint into a legendary one."},
    {key:"price",             title:"Price",              icon:Coins,      desc:"Even the holiest nectar must be fairly priced. A king's ransom for a pint is a declaration of war. Judge the tribute asked against the quality rendered."},
    {key:"pagansMoors",       title:"Pagans / Moors",     icon:Swords,     desc:"Survey the hall and count those who do not drink Guinness. A great Irish house shall be free of infidel influence. Many non-believers is cause for grave concern."},
  ],
};

const PUB_BRANDING = {
  "Allen's":            {wordmark:"ALLEN'S"},
  "Noonan's":           {wordmark:"NOONAN'S"},
  "McVeigh's":          {wordmark:"McVEIGH'S"},
  "P.J. O'Brien":       {wordmark:"P.J. O'BRIEN"},
  "The Queen & Beaver": {wordmark:"THE QUEEN & BEAVER"},
};

const ALL_KEYS = [...CATEGORIES.pint, ...CATEGORIES.pub].map(i => i.key);

const RANKS = [
  {min:0, max:0,        label:"Peasant",       bg:"rgba(140,110,60,0.2)",  color:"#6a4a1a"},
  {min:1, max:2,        label:"Squire",        bg:"rgba(130,90,20,0.28)",  color:"#7a4a10"},
  {min:3, max:4,        label:"Knight",        bg:"rgba(50,75,120,0.28)",  color:"#2a4a7a"},
  {min:5, max:6,        label:"Templar",       bg:"rgba(160,130,10,0.28)", color:"#8a7010"},
  {min:7, max:Infinity, label:"Grand Marshal", bg:"rgba(140,20,10,0.28)",  color:"#8a1a0a"},
];

const getRank = count => RANKS.find(r => count >= r.min && count <= r.max) || RANKS[0];

const rankIndex = count => {
  const label = getRank(count).label;
  return RANKS.findIndex(r => r.label === label);
};

const BATTLE_CRIES = [
  "Deus Vult!",
  "For Jerusalem!",
  "The pint is secured!",
  "God wills it!",
  "Onward, Crusader!",
  "The infidels are vanquished!",
  "Hail the dark nectar!",
  "Victory for the Order!",
  "The siege is won!",
  "Advance the banner!",
  "No quarter for the sober!",
  "Blood and stout!",
  "By the Holy Tap!",
  "The heathen lagers tremble!",
];

/* ── Chronicle message templates ──────────────────────────────────────────── */
const SIEGE_MESSAGES = [
  (name, pub) => `${name} storms the gates of ${pub}! The garrison trembles.`,
  (name, pub) => `${name} has laid siege to ${pub}. May God have mercy on their kegs.`,
  (name, pub) => `The banner of ${name} is raised before ${pub}. The assault begins.`,
  (name, pub) => `${name} breaches the walls of ${pub}! The bartender reaches for a glass.`,
];

const CONQUEST_MESSAGES = [
  (name, pub) => `${name} has conquered ${pub}! The bodies of empty glasses lie in ruin.`,
  (name, pub) => `${pub} has fallen to ${name}! Let the conquered weep into their lagers.`,
  (name, pub) => `VICTORY! ${name} plants the cross atop the smouldering ruins of ${pub}.`,
  (name, pub) => `${pub} is sacked. ${name} stands alone amid the carnage of drained pints.`,
];

const PINT_MESSAGES = [
  (name, count, pub) => `${name} claims pint #${count} at ${pub}. The crusade deepens.`,
  (name, count, pub) => `Pint #${count} falls to ${name}. ${pub}'s cellar grows lighter.`,
  (name, count, pub) => `${name} pillages draught #${count} from the stores of ${pub}.`,
  (name, count, pub) => `The dark nectar flows — ${name} seizes pint #${count} at ${pub}.`,
  (name, count, pub) => `${name} buries pint #${count}. The crusade spares no barrel at ${pub}.`,
];

const RANK_UP_MESSAGES = [
  (name, rank) => `${name} has been elevated to ${rank}! Bow before them, ye wretched.`,
  (name, rank) => `The Order recognises ${name} as ${rank}. Lesser men avert their gaze.`,
  (name, rank) => `${name} ascends to ${rank}! The weak tremble at their approach.`,
];

const SLOW_DRINKER_MESSAGES = [
  (name) => `${name} nurses their pint like a wounded peasant. Pathetic display.`,
  (name) => `Is ${name} drinking or just holding that glass for warmth? Disgraceful.`,
  (name) => `${name} has been spotted staring at a full pint. Cowardice in its purest form.`,
  (name) => `The Order questions ${name}'s commitment. That pint isn't going to drink itself.`,
  (name) => `${name} falls behind the column. The slowest drinker shames the entire crusade.`,
  (name) => `${name} drinks with the urgency of a dying snail. The Holy Land weeps.`,
  (name) => `While others conquer, ${name} contemplates. Pick up the pace or be left behind.`,
  (name) => `${name} might as well be drinking water at this rate. Actually, water might go faster.`,
];

const LOW_SCORE_MESSAGES = [
  (name, pub, score) => `${name} damns ${pub} with a score of ${score}. A den of heresy.`,
  (name, pub, score) => `${pub} earns ${score} from ${name}. The Grand Council is displeased.`,
  (name, pub, score) => `${name} brands ${pub} with a wretched ${score}. Burn it to the ground.`,
];

const HIGH_SCORE_MESSAGES = [
  (name, pub) => `${name} declares ${pub} a holy site! Pilgrims shall flock here for generations.`,
  (name, pub) => `${pub} is blessed by ${name}. The stout here flows like the rivers of paradise.`,
  (name, pub) => `${name} kneels before ${pub}'s altar. A sacred house of the dark nectar.`,
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const avg    = arr => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : 0;
const fmt    = v   => v ? v.toFixed(2) : "—";
const eAvg   = (e,keys) => avg(keys.map(k=>Number(e?.[k])).filter(Boolean));
const gAvg   = (e,gk)   => eAvg(e, CATEGORIES[gk].map(i=>i.key));
const sLabel = (f,s)    => QUALITATIVE[f].find(i=>i.score===s)?.label || "Unrated";

/* ── Campaign Map ─────────────────────────────────────────────────────────── */
const CampaignMap = ({ pubs, selectedPub, scoreMap }) => {
  const W = 420;
  const H = 128;
  const pad = 44;
  const xOf = i => pad + (i * (W - pad * 2)) / Math.max(pubs.length - 1, 1);
  const cy = 68;
  const isConquered = pub => Object.keys(scoreMap).some(k => k.startsWith(`${pub}__`));
  const pathD = pubs.map((_, i) => `${i===0?'M':'L'}${xOf(i)},${cy}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",borderRadius:"6px",display:"block"}}>
      <rect width={W} height={H} fill="rgba(238,212,148,0.35)" rx="6"/>
      <path d={pathD} stroke="rgba(90,48,10,0.32)" strokeWidth="2.5" strokeDasharray="6,5" fill="none"/>

      {pubs.map((pub, i) => {
        const cx = xOf(i);
        const active = pub === selectedPub;
        const conq = isConquered(pub);
        const fc = active ? "#8a1f1f" : conq ? "#233b2d" : "#b89050";
        const sc = "rgba(45,18,3,0.72)";
        const drk = "rgba(18,6,1,0.78)";
        const label = MAP_LABELS[pub] || pub;
        let castle;

        if (i === 0) {
          castle = (
            <>
              {active && <text x={cx} y={cy-40} textAnchor="middle" fontSize="13" fill="#9a1a08">⚔</text>}
              <rect x={cx-6} y={cy-13} width={12} height={13} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx-9} y={cy-22} width={18} height={11} rx="9" fill={fc} stroke={sc} strokeWidth="0.8"/>
              <polygon points={`${cx},${cy-34} ${cx-9},${cy-22} ${cx+9},${cy-22}`} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <path d={`M${cx-3},${cy} Q${cx},${cy-5} ${cx+3},${cy}`} fill={drk} stroke="none"/>
              <ellipse cx={cx} cy={cy-25} rx="2" ry="3" fill={drk}/>
              {conq && !active && (
                <>
                  <line x1={cx+10} y1={cy-22} x2={cx+10} y2={cy-32} stroke={sc} strokeWidth="0.8"/>
                  <polygon points={`${cx+10},${cy-32} ${cx+17},${cy-28} ${cx+10},${cy-24}`} fill="#8a1a0a" opacity="0.85"/>
                </>
              )}
            </>
          );
        } else if (i === 1) {
          castle = (
            <>
              {active && <text x={cx} y={cy-37} textAnchor="middle" fontSize="13" fill="#9a1a08">⚔</text>}
              <rect x={cx-13} y={cy-23} width={8} height={23} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx+5}  y={cy-23} width={8} height={23} fill={fc} stroke={sc} strokeWidth="0.8"/>
              {[-12,-9,-6].map((dx,j)=><rect key={j} x={cx+dx} y={cy-28} width={2.5} height={6} fill={fc} stroke={sc} strokeWidth="0.5"/>)}
              {[6,9,12].map((dx,j)=><rect key={j} x={cx+dx} y={cy-28} width={2.5} height={6} fill={fc} stroke={sc} strokeWidth="0.5"/>)}
              <rect x={cx-5} y={cy-14} width={10} height={14} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <path d={`M${cx-3},${cy} Q${cx},${cy-7} ${cx+3},${cy}`} fill={drk} stroke="none"/>
              <rect x={cx-11} y={cy-18} width={3} height={5} fill={drk}/>
              <rect x={cx+8}  y={cy-18} width={3} height={5} fill={drk}/>
              {conq && !active && (
                <>
                  <line x1={cx+14} y1={cy-23} x2={cx+14} y2={cy-33} stroke={sc} strokeWidth="0.8"/>
                  <polygon points={`${cx+14},${cy-33} ${cx+21},${cy-29} ${cx+14},${cy-25}`} fill="#8a1a0a" opacity="0.85"/>
                </>
              )}
            </>
          );
        } else if (i === 2) {
          castle = (
            <>
              {active && <text x={cx} y={cy-44} textAnchor="middle" fontSize="13" fill="#9a1a08">⚔</text>}
              <rect x={cx-5} y={cy-30} width={10} height={30} fill={fc} stroke={sc} strokeWidth="0.8"/>
              {[-4,-1,2].map((dx,j)=><rect key={j} x={cx+dx} y={cy-36} width={2.5} height={7} fill={fc} stroke={sc} strokeWidth="0.5"/>)}
              <rect x={cx-1.5} y={cy-24} width={3} height={7} fill={drk}/>
              <rect x={cx-1.5} y={cy-12} width={3} height={6} fill={drk}/>
              <path d={`M${cx-2.5},${cy} L${cx-2.5},${cy-6} Q${cx},${cy-9} ${cx+2.5},${cy-6} L${cx+2.5},${cy}`} fill={drk} stroke="none"/>
              {conq && !active && (
                <>
                  <line x1={cx+6} y1={cy-30} x2={cx+6} y2={cy-40} stroke={sc} strokeWidth="0.8"/>
                  <polygon points={`${cx+6},${cy-40} ${cx+13},${cy-36} ${cx+6},${cy-32}`} fill="#8a1a0a" opacity="0.85"/>
                </>
              )}
            </>
          );
        } else if (i === 3) {
          castle = (
            <>
              {active && <text x={cx} y={cy-42} textAnchor="middle" fontSize="13" fill="#9a1a08">⚔</text>}
              <rect x={cx-14} y={cy-10} width={28} height={10} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx-14} y={cy-20} width={7}  height={20} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx+7}  y={cy-20} width={7}  height={20} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx-4}  y={cy-28} width={8}  height={28} fill={fc} stroke={sc} strokeWidth="0.8"/>
              {[-3,0,3].map((dx,j)=><rect key={j} x={cx+dx} y={cy-34} width={2.5} height={7} fill={fc} stroke={sc} strokeWidth="0.5"/>)}
              {[-13,-10].map((dx,j)=><rect key={j} x={cx+dx} y={cy-26} width={2.5} height={7} fill={fc} stroke={sc} strokeWidth="0.5"/>)}
              {[8,11].map((dx,j)=><rect key={j} x={cx+dx} y={cy-26} width={2.5} height={7} fill={fc} stroke={sc} strokeWidth="0.5"/>)}
              <path d={`M${cx-3},${cy} Q${cx},${cy-6} ${cx+3},${cy}`} fill={drk} stroke="none"/>
              <rect x={cx-12} y={cy-15} width={3} height={4} fill={drk}/>
              <rect x={cx+9}  y={cy-15} width={3} height={4} fill={drk}/>
              {conq && !active && (
                <>
                  <line x1={cx+15} y1={cy-20} x2={cx+15} y2={cy-30} stroke={sc} strokeWidth="0.8"/>
                  <polygon points={`${cx+15},${cy-30} ${cx+22},${cy-26} ${cx+15},${cy-22}`} fill="#8a1a0a" opacity="0.85"/>
                </>
              )}
            </>
          );
        } else {
          castle = (
            <>
              {active && <text x={cx} y={cy-54} textAnchor="middle" fontSize="13" fill="#9a1a08">⚔</text>}
              <rect x={cx-15} y={cy-8} width={30} height={8} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx-15} y={cy-24} width={8} height={24} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <polygon points={`${cx-11},${cy-33} ${cx-15},${cy-24} ${cx-7},${cy-24}`} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx+7}  y={cy-24} width={8} height={24} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <polygon points={`${cx+11},${cy-33} ${cx+7},${cy-24} ${cx+15},${cy-24}`} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <rect x={cx-5}  y={cy-36} width={10} height={36} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <polygon points={`${cx},${cy-46} ${cx-5},${cy-36} ${cx+5},${cy-36}`} fill={fc} stroke={sc} strokeWidth="0.8"/>
              <circle cx={cx} cy={cy-22} r="2.5" stroke={drk} strokeWidth="0.8" fill={drk} fillOpacity="0.4"/>
              <path d={`M${cx-3},${cy} Q${cx},${cy-7} ${cx+3},${cy}`} fill={drk} stroke="none"/>
              <line x1={cx} y1={cy-46} x2={cx} y2={cy-50} stroke={sc} strokeWidth="0.9"/>
              <polygon points={`${cx},${cy-50} ${cx+7},${cy-47} ${cx},${cy-44}`} fill={conq ? "#8a1a0a" : fc} opacity="0.9"/>
            </>
          );
        }

        return (
          <g key={pub}>
            {castle}
            <text
              x={cx}
              y={cy+15}
              textAnchor="middle"
              fontSize="6.5"
              fontFamily="'Cinzel',Georgia,serif"
              fontWeight="700"
              fill={active ? "#8a1a0a" : "#4a2008"}
              letterSpacing="0.02em"
            >
              {label.length > 12 ? `${label.slice(0,11)}…` : label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ── Small components ─────────────────────────────────────────────────────── */
const Btn = ({active, onClick, children}) => (
  <button
    onClick={() => onClick?.()}
    className={`crusade-btn ${active ? "crusade-btn-active" : "crusade-btn-inactive"}`}
  >
    {children}
  </button>
);

const Pill = ({active, onClick, children}) => (
  <button
    onClick={() => onClick?.()}
    className={`option-pill ${active ? "option-pill-active" : "option-pill-inactive"}`}
  >
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
        <div
          style={{
            padding:"5px",
            border:"1px solid rgba(90,48,10,0.38)",
            background:"rgba(248,228,168,0.75)",
            borderRadius:"6px",
            color:"#522808"
          }}
        >
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

const RankBadge = ({count}) => {
  const rank = getRank(count);
  return (
    <span
      className="cinzel"
      style={{
        fontSize:"8px",
        letterSpacing:"0.1em",
        textTransform:"uppercase",
        fontWeight:700,
        padding:"2px 7px",
        borderRadius:"999px",
        background:rank.bg,
        color:rank.color,
        border:`1px solid ${rank.color}44`
      }}
    >
      {rank.label}
    </span>
  );
};

const CrusaderNameDisplay = ({ name, count }) => {
  if (!name) return null;
  const title = getCrusaderTitle(name);
  return (
    <div style={{marginTop:"6px",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
      <RankBadge count={count}/>
      <span className="fell" style={{fontSize:"12px",color:"#5a2e08",fontStyle:"italic"}}>{name}</span>
      <span className="cinzel" style={{fontSize:"9px",color:"#8a1a0a",letterSpacing:"0.06em",fontWeight:700}}>"{title}"</span>
    </div>
  );
};

/* ── Main App ─────────────────────────────────────────────────────────────── */
export default function GuinnessCrusadeApp() {
  const [pubs, setPubs]                     = useState(DEFAULT_PUBS);
  const [selectedPub, setSelectedPub]       = useState(DEFAULT_PUBS[0]);
  const [crusaderName, setCrusaderName]     = useState("");
  const [selectedGroup, setSelectedGroup]   = useState("pint");
  const [scores, setScores]                 = useState({});
  const [guinnessCounts, setGuinnessCounts] = useState({});
  const [chronicle, setChronicle]           = useState([]);
  const [syncStatus, setSyncStatus]         = useState(hasSupabaseConfig ? "Connecting…" : "Local only");
  const [hydrated, setHydrated]             = useState(false);
  const [battleCry, setBattleCry]           = useState(null);
  const [victoryBanner, setVictoryBanner]   = useState(null);
  const audioCtxRef                         = useRef(null);
  const lastSlowCheckRef                    = useRef(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { setHydrated(true); return; }
    try {
      const p = JSON.parse(raw);
      if (p.pubs?.length)   setPubs(p.pubs);
      if (p.selectedPub)    setSelectedPub(p.selectedPub);
      if (p.crusaderName)   setCrusaderName(p.crusaderName);
      if (p.scores)         setScores(p.scores);
      if (p.guinnessCounts) setGuinnessCounts(p.guinnessCounts);
      if (p.chronicle)      setChronicle(p.chronicle);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pubs, selectedPub, crusaderName, scores, guinnessCounts, chronicle })
    );
  }, [hydrated, pubs, selectedPub, crusaderName, scores, guinnessCounts, chronicle]);

  useEffect(() => {
    if (!supabase || !hydrated) return;
    let ch;

    (async () => {
      setSyncStatus("Loading campaign…");
      const {data, error} = await supabase.from("bar_crawl_scores").select("pub,judge,scores");

      if (error) {
        setSyncStatus("Run setup SQL first");
        return;
      }

      const inc = {};
      const gc = {};
      const cr = [];

      (data || []).forEach(r => {
        if (r.pub === GUINNESS_PUB_KEY) {
          gc[r.judge] = Number(r.scores?.count || 0);
        } else if (r.pub === CHRONICLE_PUB_KEY) {
          if (r.scores?.text && r.scores?.ts) cr.push({ text: r.scores.text, ts: r.scores.ts });
        } else {
          inc[`${r.pub}__${r.judge}`] = r.scores || {};
        }
      });

      setScores(inc);
      setGuinnessCounts(gc);
      setChronicle(cr.sort((a,b)=>b.ts-a.ts).slice(0,50));
      setSyncStatus("Live");

      ch = supabase
        .channel("gc-main")
        .on("postgres_changes", {event:"*",schema:"public",table:"bar_crawl_scores"}, ({new:r}) => {
          if (!r?.pub || !r?.judge) return;
          if (r.pub === GUINNESS_PUB_KEY) {
            setGuinnessCounts(prev => ({ ...prev, [r.judge]: Number(r.scores?.count || 0) }));
          } else if (r.pub === CHRONICLE_PUB_KEY) {
            if (r.scores?.text && r.scores?.ts) {
              setChronicle(prev => [{ text:r.scores.text, ts:r.scores.ts }, ...prev].slice(0,50));
            }
          } else {
            setScores(prev => ({ ...prev, [`${r.pub}__${r.judge}`]: r.scores || {} }));
          }
        })
        .subscribe();
    })();

    return () => {
      if (ch) supabase.removeChannel(ch);
    };
  }, [hydrated]);

  const safeJudge    = crusaderName.trim();
  const currentKey   = `${selectedPub}__${safeJudge}`;
  const currentEntry = scores[currentKey] || {};
  const activeCats   = CATEGORIES[selectedGroup];

  const myGuinnessCount    = safeJudge ? (guinnessCounts[safeJudge] || 0) : 0;
  const groupGuinnessTotal = Object.values(guinnessCounts).reduce((s,v)=>s+Number(v),0);

  const allPlayerStats = useMemo(() => {
    const map = {};
    Object.entries(scores).forEach(([key, entry]) => {
      const parts = key.split("__");
      const player = parts[parts.length - 1];
      if (!player) return;
      if (!map[player]) map[player] = [];
      map[player].push(entry);
    });

    return Object.entries(map)
      .map(([player, entries]) => ({
        player,
        avgScore: avg(entries.map(e => eAvg(e,ALL_KEYS)).filter(Boolean)),
        avgMoors: avg(entries.map(e => Number(e?.pagansMoors)).filter(Boolean)),
        guinness: guinnessCounts[player] || 0,
      }))
      .filter(p => p.avgScore > 0);
  }, [scores, guinnessCounts]);

  const mostValiant  = [...allPlayerStats].sort((a,b)=>b.avgScore-a.avgScore)[0];
  const bigotOfNight = [...allPlayerStats].filter(p=>p.avgMoors>0).sort((a,b)=>a.avgMoors-b.avgMoors)[0];

  const leaderboard = useMemo(() => pubs.map(pub => {
    const entries = Object.entries(scores)
      .filter(([k]) => k.startsWith(`${pub}__`))
      .map(([,e]) => e)
      .filter(Boolean);

    return {
      pub,
      entries: entries.length,
      pint: avg(entries.map(e => gAvg(e,"pint")).filter(Boolean)),
      pubScore: avg(entries.map(e => gAvg(e,"pub")).filter(Boolean)),
      overall: avg(entries.map(e => eAvg(e,ALL_KEYS)).filter(Boolean)),
    };
  }).sort((a,b)=>b.overall-a.overall), [pubs, scores]);

  const playMetalClink = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;

      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const highpass = ctx.createBiquadFilter();

      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(1100, now);
      osc1.frequency.exponentialRampToValueAtTime(560, now + 0.08);
      osc2.frequency.setValueAtTime(1800, now);
      osc2.frequency.exponentialRampToValueAtTime(700, now + 0.06);

      highpass.type = "highpass";
      highpass.frequency.value = 500;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc1.connect(highpass);
      osc2.connect(highpass);
      highpass.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.16);
    } catch (e) {}
  };

  const addChronicleEvent = async (text) => {
    const ts = Date.now();
    setChronicle(prev => [{text, ts}, ...prev].slice(0,50));
    if (supabase) {
      await supabase.from("bar_crawl_scores").upsert({
        pub: CHRONICLE_PUB_KEY,
        judge: `${ts}`,
        scores: { text, ts }
      });
    }
  };

  const triggerBattleCry = () => {
    setBattleCry(BATTLE_CRIES[Math.floor(Math.random() * BATTLE_CRIES.length)]);
    setTimeout(() => setBattleCry(null), 2200);
  };

  const triggerVictoryBanner = (pub) => {
    setVictoryBanner(pub);
    setTimeout(() => setVictoryBanner(null), 2200);
  };

  /* ── Slow drinker detection ─────────────────────────────────────────────── */
  const checkSlowDrinker = (updatedCounts) => {
    const now = Date.now();
    // Only check every 60 seconds to avoid spam
    if (now - lastSlowCheckRef.current < 60000) return;

    const entries = Object.entries(updatedCounts).filter(([,v]) => v > 0);
    if (entries.length < 2) return;

    const avgCount = avg(entries.map(([,v]) => Number(v)));
    const slowest = entries.reduce((min, cur) => cur[1] < min[1] ? cur : min);

    // If someone is drinking at less than half the group average and group average is at least 2
    if (avgCount >= 2 && slowest[1] < avgCount * 0.5) {
      lastSlowCheckRef.current = now;
      addChronicleEvent(pickRandom(SLOW_DRINKER_MESSAGES)(slowest[0]));
    }
  };

  const updateGuinnessCount = async (val) => {
    if (!safeJudge) return;

    playMetalClink();

    const prevCount = guinnessCounts[safeJudge] || 0;
    const count = Math.max(0, Number(val) || 0);

    const updatedCounts = { ...guinnessCounts, [safeJudge]: count };
    setGuinnessCounts(updatedCounts);

    if (count > prevCount) {
      addChronicleEvent(pickRandom(PINT_MESSAGES)(safeJudge, count, selectedPub));

      // Check for slow drinkers after someone else advances
      setTimeout(() => checkSlowDrinker(updatedCounts), 500);
    }

    const prevRankIdx = rankIndex(prevCount);
    const nextRankIdx = rankIndex(count);

    if (nextRankIdx > prevRankIdx) {
      const newRank = getRank(count).label;
      addChronicleEvent(pickRandom(RANK_UP_MESSAGES)(safeJudge, newRank));
    }

    if (supabase) {
      await supabase.from("bar_crawl_scores").upsert({
        pub: GUINNESS_PUB_KEY,
        judge: safeJudge,
        scores: { count }
      });
    }
  };

  const updateScore = async (field, score) => {
    if (!safeJudge) return;

    playMetalClink();

    const next = { ...currentEntry, [field]: score };
    setScores(prev => ({ ...prev, [currentKey]: next }));
    triggerBattleCry();

    if (Object.keys(currentEntry).length === 0) {
      addChronicleEvent(pickRandom(SIEGE_MESSAGES)(safeJudge, selectedPub));
    }

    const wasComplete = ALL_KEYS.every(k => currentEntry[k]);
    const isComplete  = ALL_KEYS.every(k => next[k]);

    if (!wasComplete && isComplete) {
      const overallScore = eAvg(next, ALL_KEYS);
      if (overallScore >= 4) {
        addChronicleEvent(pickRandom(HIGH_SCORE_MESSAGES)(safeJudge, selectedPub));
      } else if (overallScore <= 2) {
        addChronicleEvent(pickRandom(LOW_SCORE_MESSAGES)(safeJudge, selectedPub, overallScore.toFixed(1)));
      } else {
        addChronicleEvent(pickRandom(CONQUEST_MESSAGES)(safeJudge, selectedPub));
      }
      triggerVictoryBanner(selectedPub);
    }

    if (supabase) {
      await supabase.from("bar_crawl_scores").upsert({
        pub: selectedPub,
        judge: safeJudge,
        scores: next
      });
    }
  };

  const brand = PUB_BRANDING[selectedPub] || { wordmark: selectedPub.toUpperCase() };

  return (
    <>
      <GlobalStyles />

      <AnimatePresence>
        {battleCry && (
          <motion.div
            className="battle-cry-overlay"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.25}}
          >
            <motion.div
              className="battle-cry-text"
              initial={{scale:0.7,y:20}}
              animate={{scale:1,y:0}}
              exit={{scale:0.8,opacity:0}}
              transition={{type:"spring",stiffness:280,damping:18}}
            >
              {battleCry}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {victoryBanner && (
          <motion.div
            className="victory-banner-shell"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              className="victory-banner"
              initial={{ scaleX: 0.2, scaleY: 0.8 }}
              animate={{ scaleX: 1, scaleY: 1 }}
              exit={{ scaleX: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="victory-banner-title">Banner Unfurled</div>
              <div className="victory-banner-sub">{victoryBanner} Conquered</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 20% 10%, rgba(255,220,150,0.08), transparent 18%), radial-gradient(circle at 78% 20%, rgba(122,31,31,0.10), transparent 15%), radial-gradient(circle at 25% 80%, rgba(35,59,45,0.12), transparent 18%), linear-gradient(180deg, #2f1a0f 0%, #160c07 100%)",
          padding: "32px 16px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div style={{width:"100%",maxWidth:"460px"}}>
          <div className="scroll-rod" />

          <div className="parchment-body">
            <div className="parchment-frame">
              <div className="corner corner-tl"><CornerOrnament /></div>
              <div className="corner corner-tr"><CornerOrnament /></div>
              <div className="corner corner-bl"><CornerOrnament /></div>
              <div className="corner corner-br"><CornerOrnament /></div>

              <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>

                <div style={{textAlign:"center",padding:"8px 0 4px"}}>
                  <div
                    style={{
                      display:"block",
                      width:"240px",
                      maxWidth:"86%",
                      margin:"0 auto 6px",
                      position:"relative",
                      overflow:"hidden",
                      borderRadius:"4px"
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt="The Guinness Crusade"
                      style={{
                        width:"100%",
                        display:"block",
                        mixBlendMode:"multiply",
                        filter:"drop-shadow(0 2px 5px rgba(60,28,4,0.18)) contrast(1.05)",
                        background:"transparent"
                      }}
                    />
                  </div>
                  <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.5em",color:"#6a3a10",textTransform:"uppercase",marginTop:"6px"}}>
                    Toronto · Anno Domini 2026
                  </div>
                  <div
                    style={{
                      display:"inline-block",
                      marginTop:"10px",
                      padding:"4px 16px",
                      border:"1px solid rgba(80,40,8,0.45)",
                      background:"rgba(248,228,168,0.65)",
                      borderRadius:"999px",
                      fontFamily:"'Cinzel',serif",
                      fontSize:"9px",
                      letterSpacing:"0.22em",
                      color:"#4a2008",
                      textTransform:"uppercase",
                      fontWeight:700
                    }}
                  >
                    {syncStatus}
                  </div>
                </div>

                <div className="ornament">⚔ ✦ ⚔</div>

                <div className="section-card">
                  <SectionHead icon={Shield}>Muster the Crusade</SectionHead>

                  <div style={{display:"grid",gap:"12px"}}>
                    <div>
                      <FieldLabel>Crusader Name</FieldLabel>
                      <input
                        value={crusaderName}
                        onChange={e=>setCrusaderName(e.target.value)}
                        placeholder="Enter your name"
                        className="parchment-input"
                      />
                      <CrusaderNameDisplay name={safeJudge} count={myGuinnessCount} />
                    </div>

                    <div>
                      <FieldLabel>Tavern</FieldLabel>
                      <select value={selectedPub} onChange={e=>setSelectedPub(e.target.value)} className="parchment-select">
                        {pubs.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop:"14px",
                      padding:"14px 12px",
                      border:"1.5px solid rgba(80,45,8,0.40)",
                      background:"linear-gradient(180deg,rgba(255,238,188,0.65),rgba(235,200,130,0.55))",
                      borderRadius:"8px",
                      textAlign:"center",
                      boxShadow:"inset 0 1px 3px rgba(255,230,160,0.28)"
                    }}
                  >
                    <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.4em",color:"#6a3a10",textTransform:"uppercase",fontWeight:700}}>
                      Current Pillaging
                    </div>
                    <div className="cinzel-deco" style={{marginTop:"7px",fontSize:"22px",fontWeight:900,color:"#1e0e04",letterSpacing:"0.04em"}}>
                      {brand.wordmark}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop:"14px",
                      padding:"14px 12px",
                      border:"1.5px solid rgba(80,45,8,0.40)",
                      background:"linear-gradient(180deg,rgba(248,228,168,0.55),rgba(230,195,120,0.48))",
                      borderRadius:"8px"
                    }}
                  >
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
                      <div
                        style={{
                          padding:"5px",
                          border:"1px solid rgba(90,48,10,0.38)",
                          background:"rgba(248,228,168,0.75)",
                          borderRadius:"6px",
                          color:"#522808"
                        }}
                      >
                        <Beer size={13}/>
                      </div>
                      <span className="cinzel" style={{fontSize:"12px",fontWeight:700,letterSpacing:"0.12em",color:"#2a1006",textTransform:"uppercase"}}>
                        Sacked Guinness
                      </span>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",alignItems:"start"}}>
                      <div style={{display:"flex",flexDirection:"column"}}>
                        <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.2em",textTransform:"uppercase",color:"#5a2e08",fontWeight:700,marginBottom:"6px",textAlign:"center"}}>
                          Draughts Pillaged
                        </div>

                        <button
                          className="stepper-btn"
                          onClick={() => updateGuinnessCount(myGuinnessCount + 1)}
                          disabled={!safeJudge}
                          style={{borderRadius:"8px 8px 0 0",opacity:safeJudge?1:0.45}}
                        >
                          ＋
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={myGuinnessCount}
                          onChange={e=>updateGuinnessCount(e.target.value)}
                          className="parchment-number"
                          disabled={!safeJudge}
                          style={{borderTop:"none",borderBottom:"none",opacity:safeJudge?1:0.45}}
                        />

                        <button
                          className="stepper-btn"
                          onClick={() => updateGuinnessCount(myGuinnessCount - 1)}
                          disabled={!safeJudge}
                          style={{borderRadius:"0 0 8px 8px",opacity:safeJudge?1:0.45}}
                        >
                          －
                        </button>
                      </div>

                      <div style={{display:"flex",flexDirection:"column"}}>
                        <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.2em",textTransform:"uppercase",color:"#5a2e08",fontWeight:700,marginBottom:"6px",textAlign:"center"}}>
                          Total Slain Infidels
                        </div>
                        <div
                          style={{
                            flex:1,
                            padding:"10px",
                            background:"rgba(110,58,16,0.14)",
                            border:"1.5px solid rgba(90,48,10,0.28)",
                            borderRadius:"8px",
                            textAlign:"center",
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            minHeight:"101px"
                          }}
                        >
                          <div className="cinzel" style={{fontSize:"48px",fontWeight:900,color:"#1e0e04",lineHeight:1}}>
                            {groupGuinnessTotal}
                          </div>
                        </div>
                      </div>
                    </div>

                    {Object.keys(guinnessCounts).length > 0 && (
                      <div style={{marginTop:"10px",display:"flex",flexDirection:"column",gap:"6px"}}>
                        {Object.entries(guinnessCounts)
                          .filter(([,v])=>v>0)
                          .sort((a,b)=>b[1]-a[1])
                          .map(([judge,count]) => (
                            <div
                              key={judge}
                              style={{
                                padding:"6px 10px",
                                background:"rgba(248,228,168,0.7)",
                                border:"1px solid rgba(90,48,10,0.26)",
                                borderRadius:"8px",
                                display:"flex",
                                alignItems:"center",
                                gap:"8px",
                                flexWrap:"wrap"
                              }}
                            >
                              <span className="fell" style={{fontSize:"12px",color:"#3a1a06",fontStyle:"italic"}}>{judge}</span>
                              <span className="cinzel" style={{fontSize:"9px",color:"#8a1a0a",letterSpacing:"0.04em",fontWeight:700}}>"{getCrusaderTitle(judge)}"</span>
                              <span className="cinzel" style={{fontSize:"11px",fontWeight:700,color:"#1e0e04",marginLeft:"auto"}}>{count}</span>
                              <RankBadge count={Number(count)}/>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="section-card">
                  <SectionHead icon={ScrollText}>Score the Siege</SectionHead>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
                    <Btn active={selectedGroup==="pint"} onClick={()=>setSelectedGroup("pint")}>The Pint</Btn>
                    <Btn active={selectedGroup==="pub"}  onClick={()=>setSelectedGroup("pub")}>The Pub</Btn>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                    {activeCats.map(cat => {
                      const Icon = cat.icon;
                      const cur  = Number(currentEntry?.[cat.key] || 0);

                      return (
                        <motion.div
                          key={cat.key}
                          initial={{opacity:0,y:6}}
                          animate={{opacity:1,y:0}}
                          style={{
                            border:"1px solid rgba(90,50,10,0.24)",
                            background:"linear-gradient(180deg,rgba(255,242,200,0.82),rgba(238,210,152,0.76))",
                            borderRadius:"8px",
                            padding:"13px",
                            boxShadow:"0 3px 10px rgba(40,18,2,0.08)"
                          }}
                        >
                          <div style={{display:"flex",alignItems:"flex-start",gap:"9px",marginBottom:"10px"}}>
                            <div
                              style={{
                                padding:"6px",
                                border:"1px solid rgba(90,50,10,0.28)",
                                background:"rgba(248,225,155,0.8)",
                                borderRadius:"6px",
                                color:"#5a2e08",
                                flexShrink:0,
                                marginTop:"2px"
                              }}
                            >
                              <Icon size={13}/>
                            </div>

                            <div>
                              <div
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  marginBottom: "6px"
                                }}
                              >
                                <div
                                  className="cinzel"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    color: "#f8e8c0",
                                    textShadow: "0 1px 0 #000",
                                    padding: "4px 14px",
                                    background: "linear-gradient(180deg, #8a1f1f 0%, #5d1716 100%)",
                                    border: "2px solid #3a0f0f",
                                    boxShadow:
                                      "0 4px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,220,160,0.2)",
                                    clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)"
                                  }}
                                >
                                  {cat.title}
                                </div>

                                <div
                                  style={{
                                    position: "absolute",
                                    left: "-8px",
                                    top: "6px",
                                    width: "0",
                                    height: "0",
                                    borderTop: "6px solid transparent",
                                    borderBottom: "6px solid transparent",
                                    borderRight: "8px solid #5d1716"
                                  }}
                                />

                                <div
                                  style={{
                                    position: "absolute",
                                    right: "-8px",
                                    top: "6px",
                                    width: "0",
                                    height: "0",
                                    borderTop: "6px solid transparent",
                                    borderBottom: "6px solid transparent",
                                    borderLeft: "8px solid #5d1716"
                                  }}
                                />
                              </div>

                              <div className="fell" style={{fontSize:"12px",color:"#5a2e08",fontStyle:"italic",lineHeight:1.5,marginTop:"3px"}}>
                                {cat.desc}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              marginBottom:"8px",
                              padding:"5px 10px",
                              background:"rgba(200,160,80,0.14)",
                              borderRadius:"6px",
                              border:"1px solid rgba(90,50,10,0.14)"
                            }}
                          >
                            <span className="cinzel" style={{fontSize:"9px",letterSpacing:"0.2em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>
                              Verdict:
                            </span>{" "}
                            <span className="fell" style={{fontSize:"12px",color:"#3a1a06",fontStyle:"italic"}}>
                              {sLabel(cat.key,cur)}
                            </span>
                          </div>

                          <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                            {QUALITATIVE[cat.key].map(opt => (
                              <Pill key={opt.score} active={cur===opt.score} onClick={()=>updateScore(cat.key,opt.score)}>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                  <span>{opt.label}</span>
                                  <span
                                    className="cinzel"
                                    style={{
                                      fontSize:"10px",
                                      padding:"1px 6px",
                                      border:"1px solid currentColor",
                                      borderRadius:"999px",
                                      opacity:0.7,
                                      letterSpacing:"0.04em"
                                    }}
                                  >
                                    {opt.score}/5
                                  </span>
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
                    {label:"Overall", value:fmt(eAvg(currentEntry,ALL_KEYS))},
                  ].map(item => (
                    <div key={item.label} className="section-card" style={{padding:"12px 6px",textAlign:"center"}}>
                      <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.3em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>
                        {item.label}
                      </div>
                      <div className="cinzel" style={{marginTop:"6px",fontSize:"24px",fontWeight:900,color:"#1e0e04"}}>
                        {item.value}
                      </div>
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
                              <span
                                className="cinzel"
                                style={{
                                  padding:"2px 8px",
                                  background:"#6a3810",
                                  color:"#f5e0b0",
                                  fontSize:"10px",
                                  fontWeight:700,
                                  borderRadius:"999px",
                                  letterSpacing:"0.05em"
                                }}
                              >
                                #{i+1}
                              </span>
                              <span className="cinzel" style={{fontWeight:700,fontSize:"13px",color:"#1e0e04"}}>
                                {item.pub}
                              </span>
                            </div>
                            <div className="fell" style={{marginTop:"4px",fontSize:"12px",color:"#5a2e08",fontStyle:"italic"}}>
                              {item.entries} {item.entries===1?"conquest":"conquests"}
                            </div>
                          </div>

                          <div style={{textAlign:"right"}}>
                            <div className="cinzel" style={{fontSize:"26px",fontWeight:900,color:"#1e0e04",lineHeight:1}}>
                              {fmt(item.overall)}
                            </div>
                            <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.22em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>
                              overall
                            </div>
                          </div>
                        </div>

                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"10px"}}>
                          {[{label:"Pint",v:fmt(item.pint)},{label:"Pub",v:fmt(item.pubScore)}].map(s=>(
                            <div key={s.label} style={{padding:"7px 10px",background:"rgba(240,212,158,0.56)",borderRadius:"8px"}}>
                              <span className="cinzel" style={{fontSize:"9px",letterSpacing:"0.1em",textTransform:"uppercase",color:"#5a2e08",fontWeight:700}}>
                                {s.label}:
                              </span>{" "}
                              <span className="cinzel" style={{fontWeight:700,color:"#1e0e04",fontSize:"13px"}}>
                                {s.v}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {(mostValiant || bigotOfNight) && (
                  <div className="section-card">
                    <SectionHead icon={Crown}>Honours of the Campaign</SectionHead>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                      {mostValiant && (
                        <div
                          style={{
                            padding:"12px 10px",
                            border:"1.5px solid rgba(160,130,10,0.28)",
                            background:"rgba(248,228,120,0.20)",
                            borderRadius:"8px",
                            textAlign:"center"
                          }}
                        >
                          <Crown size={16} style={{color:"#8a7010",marginBottom:"6px"}}/>
                          <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.18em",textTransform:"uppercase",color:"#7a6010",fontWeight:700,marginBottom:"6px"}}>
                            Most Valiant
                          </div>
                          <div className="cinzel" style={{fontSize:"13px",fontWeight:700,color:"#1e0e04",marginBottom:"2px"}}>
                            {mostValiant.player}
                          </div>
                          <div className="cinzel" style={{fontSize:"8px",color:"#8a1a0a",fontWeight:700,marginBottom:"4px"}}>
                            "{getCrusaderTitle(mostValiant.player)}"
                          </div>
                          <div className="fell" style={{fontSize:"11px",color:"#5a2e08",fontStyle:"italic"}}>
                            avg {mostValiant.avgScore.toFixed(2)}
                          </div>
                          <div style={{marginTop:"6px"}}><RankBadge count={mostValiant.guinness}/></div>
                        </div>
                      )}

                      {bigotOfNight && (
                        <div
                          style={{
                            padding:"12px 10px",
                            border:"1.5px solid rgba(140,20,10,0.26)",
                            background:"rgba(200,50,20,0.08)",
                            borderRadius:"8px",
                            textAlign:"center"
                          }}
                        >
                          <Swords size={16} style={{color:"#8a1a0a",marginBottom:"6px"}}/>
                          <div className="cinzel" style={{fontSize:"8px",letterSpacing:"0.18em",textTransform:"uppercase",color:"#8a1a0a",fontWeight:700,marginBottom:"6px"}}>
                            Bigot of the Night
                          </div>
                          <div className="cinzel" style={{fontSize:"13px",fontWeight:700,color:"#1e0e04",marginBottom:"2px"}}>
                            {bigotOfNight.player}
                          </div>
                          <div className="cinzel" style={{fontSize:"8px",color:"#8a1a0a",fontWeight:700,marginBottom:"4px"}}>
                            "{getCrusaderTitle(bigotOfNight.player)}"
                          </div>
                          <div className="fell" style={{fontSize:"11px",color:"#5a2e08",fontStyle:"italic"}}>
                            most infidels spotted
                          </div>
                          <div style={{marginTop:"6px"}}><RankBadge count={bigotOfNight.guinness}/></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="section-card">
                  <SectionHead icon={ScrollText}>Campaign Chronicle</SectionHead>

                  {chronicle.length === 0 ? (
                    <div className="fell" style={{fontSize:"13px",color:"#5a2e08",fontStyle:"italic",textAlign:"center",padding:"8px 0"}}>
                      The chronicle awaits its first entry…
                    </div>
                  ) : (
                    <div className="chronicle-scroll" style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                      <AnimatePresence initial={false}>
                        {chronicle.map(event => (
                          <motion.div
                            key={event.ts}
                            initial={{opacity:0,x:-8}}
                            animate={{opacity:1,x:0}}
                            exit={{opacity:0}}
                            className="chronicle-entry"
                          >
                            <span className="cinzel" style={{fontSize:"9px",color:"rgba(90,48,10,0.6)",marginRight:"8px",letterSpacing:"0.05em"}}>
                              {new Date(event.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                            </span>
                            <span className="fell" style={{fontSize:"12px",color:"#3a1a06",fontStyle:"italic"}}>
                              {event.text}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="ornament">✦ ⚔ ✦</div>

                <div className="section-card" style={{padding:"12px"}}>
                  <div className="cinzel" style={{fontSize:"9px",letterSpacing:"0.32em",color:"#4e2408",textTransform:"uppercase",fontWeight:700,marginBottom:"10px",textAlign:"center"}}>
                    The Campaign Route
                  </div>

                  <CampaignMap pubs={pubs} selectedPub={selectedPub} scoreMap={scores} />

                  <div style={{marginTop:"8px",display:"flex",justifyContent:"center",gap:"16px",flexWrap:"wrap"}}>
                    {[{fc:"#b89050",label:"Unconquered"},{fc:"#233b2d",label:"Conquered"},{fc:"#8a1f1f",label:"Current Siege"}].map(({fc,label})=>(
                      <div key={label} style={{display:"flex",alignItems:"center",gap:"5px"}}>
                        <div style={{width:"10px",height:"10px",background:fc,border:"1px solid rgba(50,22,4,0.5)",borderRadius:"2px"}}/>
                        <span className="cinzel" style={{fontSize:"7px",letterSpacing:"0.08em",color:"#5a2e08",textTransform:"uppercase",fontWeight:700}}>
                          {label}
                        </span>
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
