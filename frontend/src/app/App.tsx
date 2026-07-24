import { useState, useRef } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import kspLogo from "../imports/image-12.png";
import {
  ChevronRight, Database, Globe, MapPin, FileText, Bot, Map,
  LayoutDashboard, Settings, Plus, Clock, Mic, MicOff,
  X, Download, Menu, Search, Users, Shield, AlertTriangle, Paperclip,
} from "lucide-react";

/* ─── Design tokens ─────────────────────────────────────── */
const F   = "'Noto Sans', 'Noto Sans Kannada', system-ui, sans-serif";
const NAV = "#1a3a5c";   // deep navy — header, sidebar, panel headers
const AMB = "#f4a100";   // saffron amber — accents, borders
const BG  = "#f5f7f9";   // page background
const WH  = "#ffffff";
const BD  = "#c8d0da";   // default border
const TX  = "#1a1a2e";   // primary text
const MU  = "#5a6474";   // muted text
const GR  = "#15803d";   // success green
const RD  = "#b91c1c";   // danger red
const AD  = "#92610a";   // amber-dark (text on amber bg)

/* ─── Static data ────────────────────────────────────────── */
type AppView = "landing" | "chatbot" | "dashboards" | "settings" | "feedback";

const NAV_LINKS = ["Home", "About", "FIR Search", "Contact"];

/* ─── Translations ───────────────────────────────────────── */
const T = {
  en: {
    deptName:       "Karnataka State Police",
    deptSub:        "Intelligence Command Center · ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಗುಪ್ತಚರ ಕೇಂದ್ರ",
    deptGov:        "Government of Karnataka · Department of Home Affairs",
    login:          "Login",
    signOut:        "Sign Out",
    feedback:       "Feedback",
    nav:            ["Home", "About", "FIR Search", "Contact"],
    updates:        "Updates",
    breadcrumb:     "Intelligence Command Center",
    breadHome:      "Home",
    systemOp:       "System Operational",
    lastUpdated:    "Last updated: Today, 10:42 IST",
    policeDesk:     "Police Desk",
    crimeDesk:      "Crime Analysis Desk",
    signInPrompt:   "Sign in",
    signInSuffix:   "to access the intelligence tools below.",
    accessGranted:  "Access granted — Insp. K. Rajesh (Level 3)",
    notices:        "Official Notices",
    viewAll:        "View all notices →",
    footer1:        "© 2025 Karnataka State Police · Government of Karnataka · All rights reserved",
    footer2:        "Designed & Hosted by NIC Karnataka · Version 2.4.1",
    desk: [
      { label: "Legal Guidelines",        badge: "OPEN" },
      { label: "FIR Search",              badge: null },
      { label: "Seva Sindhu",             badge: null },
      { label: "Officers Centric Portal", badge: null },
      { label: "KSP e-Lost Reports",      badge: null },
      { label: "Tenders & Procurement",   badge: null },
      { label: "RTI Requests",            badge: null },
      { label: "Important Links",         badge: null },
      { label: "Police Station Locator",  badge: null },
    ],
    tools: [
      { label: "AI Crime Analysis Cases",    sub: "Natural language queries on crime data & suspects",       meta: "23 queries · Avg response 1.4s · Model: KSP-APT v2.1" },
      { label: "Criminal Records Search",    sub: "FIR lookup, history & suspect profiles",                  meta: "4,283 records indexed today · Latency: 32ms · Sources: 6" },
      { label: "District Intelligence Map",  sub: "Real-time district-level alert monitoring",               meta: "3 HIGH · 12 MEDIUM · 14 NORMAL · Last sync: 8 min ago" },
    ],
  },
  kn: {
    deptName:       "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    deptSub:        "ಗುಪ್ತಚರ ಕಮಾಂಡ್ ಕೇಂದ್ರ · Karnataka State Police Intelligence Command Center",
    deptGov:        "ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಗೃಹ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ",
    login:          "ಲಾಗಿನ್",
    signOut:        "ಸೈನ್ ಔಟ್",
    feedback:       "ಪ್ರತಿಕ್ರಿಯೆ",
    nav:            ["ಮುಖಪುಟ", "ನಮ್ಮ ಬಗ್ಗೆ", "ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ", "ಸಂಪರ್ಕ"],
    updates:        "ಅಪ್‌ಡೇಟ್‌ಗಳು",
    breadcrumb:     "ಗುಪ್ತಚರ ಕಮಾಂಡ್ ಕೇಂದ್ರ",
    breadHome:      "ಮುಖಪುಟ",
    systemOp:       "ವ್ಯವಸ್ಥೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ",
    lastUpdated:    "ಕೊನೆಯ ಅಪ್‌ಡೇಟ್: ಇಂದು, 10:42 IST",
    policeDesk:     "ಪೊಲೀಸ್ ಡೆಸ್ಕ್",
    crimeDesk:      "ಅಪರಾಧ ವಿಶ್ಲೇಷಣಾ ಕೇಂದ್ರ",
    signInPrompt:   "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    signInSuffix:   "ಗುಪ್ತಚರ ಉಪಕರಣಗಳನ್ನು ಬಳಸಲು.",
    accessGranted:  "ಪ್ರವೇಶ ಮಂಜೂರು — ಇನ್ಸ್ಪೆ. ಕೆ. ರಾಜೇಶ್ (ಮಟ್ಟ 3)",
    notices:        "ಅಧಿಕೃತ ಸೂಚನೆಗಳು",
    viewAll:        "ಎಲ್ಲಾ ಸೂಚನೆಗಳನ್ನು ನೋಡಿ →",
    footer1:        "© 2025 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",
    footer2:        "NIC ಕರ್ನಾಟಕದಿಂದ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ · ಆವೃತ್ತಿ 2.4.1",
    desk: [
      { label: "ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿಗಳು",      badge: "ತೆರೆದಿದೆ" },
      { label: "ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ",           badge: null },
      { label: "ಸೇವಾ ಸಿಂಧು",                 badge: null },
      { label: "ಅಧಿಕಾರಿ ಕೇಂದ್ರಿತ ಪೋರ್ಟಲ್",  badge: null },
      { label: "KSP ಇ-ಕಳೆದ ವರದಿಗಳು",        badge: null },
      { label: "ಟೆಂಡರ್ ಮತ್ತು ಖರೀದಿ",        badge: null },
      { label: "RTI ವಿನಂತಿಗಳು",             badge: null },
      { label: "ಮುಖ್ಯ ಕೊಂಡಿಗಳು",             badge: null },
      { label: "ಪೊಲೀಸ್ ಠಾಣೆ ಸ್ಥಳ",          badge: null },
    ],
    tools: [
      { label: "AI ಅಪರಾಧ ವಿಶ್ಲೇಷಣಾ ಪ್ರಕರಣಗಳು", sub: "ಅಪರಾಧ ಡೇಟಾ ಮತ್ತು ಸಂಶಯಾಸ್ಪದರ ಸರಳ ಭಾಷೆಯ ಪ್ರಶ್ನೆಗಳು",  meta: "23 ಪ್ರಶ್ನೆಗಳು · ಸರಾಸರಿ 1.4s · ಮಾದರಿ: KSP-APT v2.1" },
      { label: "ಅಪರಾಧ ದಾಖಲೆ ಹುಡುಕಾಟ",         sub: "ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ, ಇತಿಹಾಸ ಮತ್ತು ಸಂಶಯಾಸ್ಪದ ಪ್ರೊಫೈಲ್‌ಗಳು", meta: "ಇಂದು 4,283 ದಾಖಲೆಗಳು · ವಿಳಂಬ: 32ms · ಮೂಲಗಳು: 6" },
      { label: "ಜಿಲ್ಲಾ ಗುಪ್ತಚರ ನಕ್ಷೆ",          sub: "ನೈಜ-ಸಮಯ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಎಚ್ಚರಿಕೆ ಮೇಲ್ವಿಚಾರಣೆ",          meta: "3 ಉನ್ನತ · 12 ಮಧ್ಯಮ · 14 ಸಾಮಾನ್ಯ · ಕೊನೆಯ ಸಿಂಕ್: 8 ನಿ" },
    ],
  },
} as const;

const TICKER_ITEMS = [
  "Data sync completed across 4 districts — 1,204 records updated",
  "AI Chatbot: 23 queries processed in last 15 min",
  "District Intelligence Map refreshed — Bengaluru Urban flagged HIGH",
  "Crime Analytics report Q2 2025 ready for review",
  "FIR processing latency: 32ms average — all systems normal",
];

const POLICE_DESK = [
  { label: "Legal Guidelines",        badge: "OPEN" },
  { label: "FIR Search",              badge: null },
  { label: "Seva Sindhu",             badge: null },
  { label: "Officers Centric Portal", badge: null },
  { label: "KSP e-Lost Reports",      badge: null },
  { label: "Tenders & Procurement",   badge: null },
  { label: "RTI Requests",            badge: null },
  { label: "Important Links",         badge: null },
  { label: "Police Station Locator",  badge: null },
];

const DESK_TOOLS = [
  {
    id: "chatbot",
    label: "AI Crime Analysis Cases",
    sub: "Natural language queries on crime data & suspects",
    icon: Bot,
    meta: "23 queries · Avg response 1.4s · Model: KSP-APT v2.1",
    accent: NAV,
  },
  {
    id: "records",
    label: "Criminal Records Search",
    sub: "FIR lookup, history & suspect profiles",
    icon: Database,
    meta: "4,283 records indexed today · Latency: 32ms · Sources: 6",
    accent: AMB,
  },
  {
    id: "district",
    label: "District Intelligence Map",
    sub: "Real-time district-level alert monitoring",
    icon: Map,
    meta: "3 HIGH · 12 MEDIUM · 14 NORMAL · Last sync: 8 min ago",
    accent: AMB,
  },
];

const WHATS_NEW = [
  { tag: "NEW", priority: "Medium", title: "Legal Bulletin (Fourth Edition)",      id: "LB-2024-441",      date: "Jun 2025" },
  { tag: "NEW", priority: "Medium", title: "Legal Bulletin (Third Edition)",       id: "LB-2023-883",      date: "Apr 2025" },
  { tag: "NEW", priority: "Review", title: "Legal Bulletin (Second Edition)",      id: "LB-2023-114",      date: "Apr 2025" },
  { tag: "NEW", priority: "High",   title: "Crime Statistics Annual Report 2024", id: "ID-WR1-2024-9787", date: "Mar 2025" },
  { tag: "NEW", priority: "High",   title: "Cyber Crime Advisory — Q1 2025",      id: "ID-ADV-2024-43",   date: "Jan 2025" },
  { tag: "UPD", priority: "Normal", title: "District Command Circular #14",       id: "ID-DCC-2024-14",   date: "Dec 2024" },
];

const SUGGESTIONS = [
  "Crime trends in Bengaluru North — last 30 days",
  "Repeat offenders with 3+ FIRs in 2024",
  "High-alert zones: Mysuru district Q2 2025",
];

const RECENT_CHATS = [
  { id: 1, title: "Robbery trends Whitefield",    time: "2h ago"    },
  { id: 2, title: "District 14 suspect analysis", time: "Yesterday" },
  { id: 3, title: "Vehicle theft patterns 2025",  time: "2 days ago"},
  { id: 4, title: "Missing persons Hubballi",     time: "3 days ago"},
  { id: 5, title: "Cybercrime case clustering",   time: "1 week ago"},
];

/* ─── Root ────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState<AppView>("landing");
  const [loggedIn, setLoggedIn] = useState(false);

  if (view === "feedback") return <FeedbackPage onBack={() => setView("landing")} />;

  if (view === "landing") {
    return (
      <LandingPage
        onEnterTool={setView}
        loggedIn={loggedIn}
        onLogin={() => setLoggedIn(true)}
        onLogout={() => setLoggedIn(false)}
      />
    );
  }
  return <IntelligencePlatform view={view} setView={setView} />;
}

/* ─── Government emblem ──────────────────────────────────── */
function GovEmblem({ size = 58 }: { size?: number }) {
  return (
    <ImageWithFallback
      src={kspLogo}
      alt="Karnataka State Emblem"
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

/* ─── Landing page ────────────────────────────────────────── */
function LandingPage({
  onEnterTool,
  loggedIn,
  onLogin,
  onLogout,
}: {
  onEnterTool: (v: AppView) => void;
  loggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const [activeLang, setActiveLang] = useState<"en" | "kn">("en");
  const [activeNav, setActiveNav] = useState("Home");
  const [authError, setAuthError] = useState<string | null>(null);

  function handleTool(id: string) {
    if (!loggedIn) {
      setAuthError("Access denied. Please sign in to use the intelligence tools.");
      setTimeout(() => setAuthError(null), 3500);
      return;
    }
    setAuthError(null);
    if (id === "chatbot") onEnterTool("chatbot");
    else if (id === "district") onEnterTool("dashboards");
  }

  const btn = (label: string, onClick: () => void, extra?: React.CSSProperties) => (
    <button
      onClick={onClick}
      style={{
        padding: "5px 18px",
        border: "1px solid rgba(255,255,255,0.45)",
        background: "transparent",
        color: WH,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: F,
        borderRadius: 0,
        ...extra,
      }}
    >{label}</button>
  );

  const t = T[activeLang];

  const NAV_URLS = [
    null,
    "https://ksp.karnataka.gov.in/page/About+Us/Vision+Statement/en",
    "https://ksp.karnataka.gov.in/firsearch/en",
    "https://ksp.karnataka.gov.in/ksp_contact/en",
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: F, background: BG, color: TX, fontSize: 14, lineHeight: 1.5 }}>

      {/* ══ HEADER ══ */}
      <header style={{ background: NAV, padding: "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <GovEmblem />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: WH, lineHeight: 1.2 }}>{t.deptName}</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{t.deptSub}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{t.deptGov}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
              {(["en", "kn"] as const).map((lang, i) => (
                <span key={lang} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {i > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>|</span>}
                  <button onClick={() => setActiveLang(lang)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 13, color: activeLang === lang ? WH : "rgba(255,255,255,0.4)", fontWeight: activeLang === lang ? 600 : 400, padding: 0 }}>
                    {lang === "en" ? "EN" : "ಕನ್ನಡ"}
                  </button>
                </span>
              ))}
            </div>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <button onClick={() => onEnterTool("feedback")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = WH}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
            >{t.feedback}</button>
            {loggedIn ? btn(t.signOut, onLogout) : btn(t.login, onLogin)}
          </div>
        </div>
      </header>

      {/* ══ NAV ══ */}
      <nav style={{ background: WH, borderBottom: `1px solid ${BD}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex" }}>
          {t.nav.map((label, idx) => (
            <button key={label}
              onClick={() => {
                const url = NAV_URLS[idx];
                if (url) { window.open(url, "_blank", "noopener"); return; }
                setActiveNav(label);
              }}
              style={{ padding: "11px 18px", border: "none", borderBottom: activeNav === label || (idx === 0 && activeNav === "Home") ? `2px solid ${AMB}` : "2px solid transparent", background: "transparent", color: (activeNav === label || (idx === 0 && activeNav === "Home")) ? NAV : MU, fontSize: 13, fontWeight: (activeNav === label || (idx === 0 && activeNav === "Home")) ? 600 : 400, cursor: "pointer", fontFamily: F, marginBottom: -1 }}
              onMouseEnter={e => e.currentTarget.style.color = NAV}
              onMouseLeave={e => { if (activeNav !== label && !(idx === 0 && activeNav === "Home")) e.currentTarget.style.color = MU; }}
            >{label}</button>
          ))}
        </div>
      </nav>

      {/* ══ TICKER ══ */}
      <div style={{ borderLeft: `4px solid ${AMB}`, background: "#fefbf0", borderBottom: `1px solid #e2d5a8`, overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: AD, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.updates}</span>
          <span style={{ color: BD, fontSize: 12 }}>|</span>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ display: "flex", animation: "ticker 32s linear infinite", whiteSpace: "nowrap" }}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} style={{ fontSize: 12, color: MU, paddingRight: 56 }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ BREADCRUMB ══ */}
      <div style={{ background: WH, borderBottom: `1px solid ${BD}`, padding: "6px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: MU }}>
            <span style={{ fontWeight: 600, color: NAV }}>{t.breadcrumb}</span>
            <span>›</span>
            <span>{t.breadHome}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: GR, display: "inline-block" }} />
            <span style={{ color: GR, fontWeight: 600 }}>{t.systemOp}</span>
            <span style={{ color: BD }}>|</span>
            <span style={{ color: MU }}>{t.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <main style={{ flex: 1, padding: "20px 0 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 250px", gap: 20, alignItems: "start" }}>

          {/* Crime Analysis Desk */}
          <section>
            <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${BD}` }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: TX, margin: "0 0 5px" }}>{t.crimeDesk}</h2>
              {!loggedIn ? (
                <p style={{ fontSize: 12, color: MU, margin: 0 }}>
                  <button onClick={onLogin} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, color: NAV, fontWeight: 600, fontSize: 12, padding: 0, textDecoration: "underline" }}>{t.signInPrompt}</button>
                  {" "}{t.signInSuffix}
                </p>
              ) : (
                <p style={{ fontSize: 12, color: GR, margin: 0, fontWeight: 500 }}>● {t.accessGranted}</p>
              )}
            </div>

            {authError && (
              <div style={{ padding: "8px 12px", background: "#fef2f2", border: `1px solid #fca5a5`, borderLeft: `4px solid ${RD}`, marginBottom: 14, fontSize: 12, color: RD, lineHeight: 1.5 }}>
                {authError}
              </div>
            )}

            <div>
              {DESK_TOOLS.map(({ id, icon: Icon, accent }, i) => {
                const tool = t.tools[i];
                return (
                  <button key={id} onClick={() => handleTool(id)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", width: "100%", background: WH, border: `1px solid ${BD}`, borderTop: i > 0 ? "none" : `1px solid ${BD}`, borderLeft: `4px solid ${accent}`, cursor: "pointer", textAlign: "left", fontFamily: F }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f3f7fc"}
                    onMouseLeave={e => e.currentTarget.style.background = WH}
                  >
                    <div style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#edf2f9", border: `1px solid #d0daea`, marginTop: 1 }}>
                      <Icon size={16} color={NAV} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: TX, lineHeight: 1.3, marginBottom: 3 }}>{tool.label}</div>
                      <div style={{ fontSize: 12, color: MU, marginBottom: 8 }}>{tool.sub}</div>
                      <div style={{ fontSize: 11, color: "#8a9ab0", paddingTop: 8, borderTop: `1px solid #eef1f6` }}>{tool.meta}</div>
                    </div>
                    <ChevronRight size={14} color="#8a9ab0" style={{ marginTop: 10, flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Official Notices */}
          <aside>
            <PanelHead label={t.notices} />
            <div style={{ background: WH, border: `1px solid ${BD}`, borderTop: "none" }}>
              {WHATS_NEW.map(({ tag, priority, title, id, date }, i, arr) => (
                <div key={id}
                  style={{ padding: "9px 12px", borderBottom: i < arr.length - 1 ? "1px solid #edf0f4" : "none", cursor: "pointer" }}
                  onClick={() => window.open("https://ksp.karnataka.gov.in/english", "_blank", "noopener")}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f7fafc"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = WH}
                >
                  <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: tag === "NEW" ? "#1a5276" : "#5b2c6f", letterSpacing: "0.04em", flexShrink: 0, marginTop: 2 }}>[{tag}]</span>
                    <span style={{ fontSize: 12, color: TX, fontWeight: 500, lineHeight: 1.4 }}>{title}</span>
                  </div>
                  <div style={{ fontSize: 10, color: MU, paddingLeft: 27 }}>Ref: {id} · {date}</div>
                  <div style={{ fontSize: 10, paddingLeft: 27, marginTop: 2, fontWeight: 600, color: priority === "High" ? RD : priority === "Medium" ? "#b45309" : MU }}>
                    {priority === "High" && "▲ "}{priority} Priority
                  </div>
                </div>
              ))}
              <div style={{ padding: "8px 12px", borderTop: `1px solid ${BD}` }}>
                <button onClick={() => window.open("https://ksp.karnataka.gov.in/english", "_blank", "noopener")} style={{ background: "none", border: "none", cursor: "pointer", color: NAV, fontSize: 12, fontWeight: 600, fontFamily: F, padding: 0, textDecoration: "underline" }}>
                  {t.viewAll}
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: NAV, borderTop: `3px solid ${AMB}`, padding: "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{t.footer1}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{t.footer2}</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Feedback page ──────────────────────────────────────── */
function FeedbackPage({ onBack }: { onBack: () => void }) {
  const members = [
    { name: "Joel Alfred Israel",  contact: "+91 98407 53301" },
    { name: "Aravind G",           contact: null },
    { name: "Punit Kumar Pothuraju", contact: null },
    { name: "Adhitya",             contact: null },
    { name: "Shreyas",             contact: null },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: F, background: BG, color: TX }}>
      {/* Header */}
      <header style={{ background: NAV, padding: "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <GovEmblem />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: WH, lineHeight: 1.2 }}>Karnataka State Police</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
              Intelligence Command Center &nbsp;·&nbsp; ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಗುಪ್ತಚರ ಕೇಂದ್ರ
            </div>
          </div>
          <button onClick={onBack}
            style={{ padding: "7px 18px", border: "none", background: AMB, color: "#1a1a2e", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F }}
            onMouseEnter={e => { e.currentTarget.style.background = RD; e.currentTarget.style.color = WH; }}
            onMouseLeave={e => { e.currentTarget.style.background = AMB; e.currentTarget.style.color = "#1a1a2e"; }}>
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ background: WH, borderBottom: `1px solid ${BD}`, padding: "6px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: MU }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: NAV, fontWeight: 600, fontSize: 12, fontFamily: F, padding: 0 }}>Home</button>
          <span>›</span>
          <span>Feedback &amp; Contact</span>
        </div>
      </div>

      {/* Content */}
      <main style={{ flex: 1, padding: "40px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Page title */}
          <div style={{ borderLeft: `4px solid ${AMB}`, paddingLeft: 16, marginBottom: 32 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: NAV, margin: "0 0 6px" }}>Feedback &amp; Support</h1>
            <p style={{ fontSize: 13, color: MU, margin: 0, lineHeight: 1.6 }}>
              We value your feedback on the KSP Intelligence Command Center. For queries, suggestions, or technical support, please reach out to a member of our project team below.
            </p>
          </div>

          {/* Contact notice */}
          <div style={{ padding: "12px 16px", background: "#fffbeb", border: `1px solid #e2c97a`, borderLeft: `4px solid ${AMB}`, marginBottom: 28, fontSize: 13, color: AD, lineHeight: 1.6 }}>
            To share feedback or report an issue, contact any of the team members listed below directly via phone or raise it through your department's internal channel.
          </div>

          {/* Team table */}
          <div style={{ marginBottom: 8 }}>
            <PanelHead label="Project Team" />
            <div style={{ background: WH, border: `1px solid ${BD}`, borderTop: "none" }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", padding: "8px 16px", background: "#f0f4f9", borderBottom: `1px solid ${BD}` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: MU, textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: MU, textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact</span>
              </div>
              {members.map(({ name, contact }, i) => (
                <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr 180px", padding: "12px 16px", borderBottom: i < members.length - 1 ? `1px solid #edf0f4` : "none", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: TX, fontWeight: 500 }}>{name}</span>
                  {contact
                    ? <a href={`tel:${contact.replace(/\s/g, "")}`} style={{ fontSize: 13, color: NAV, fontWeight: 600, textDecoration: "none", fontFamily: F }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = "underline"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = "none"}
                      >{contact}</a>
                    : <span style={{ fontSize: 12, color: MU }}>—</span>
                  }
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 11, color: MU, marginTop: 20, lineHeight: 1.6 }}>
            Office hours: Monday – Friday, 09:00 – 18:00 IST &nbsp;·&nbsp; Government of Karnataka
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: NAV, borderTop: `3px solid ${AMB}`, padding: "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            © 2025 Karnataka State Police · Government of Karnataka · All rights reserved
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Panel section header ───────────────────────────────── */
function PanelHead({ label }: { label: string }) {
  return (
    <div style={{ background: NAV, color: WH, padding: "9px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: `2px solid ${AMB}` }}>
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTELLIGENCE PLATFORM (internal views)
════════════════════════════════════════════════════════════ */
function IntelligencePlatform({ view, setView }: { view: AppView; setView: (v: AppView) => void }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentQueries, setRecentQueries] = useState<{ id: number; title: string; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(q: string) {
    if (!q.trim() || isLoading) return;

    // Immediately show user message and a loading placeholder
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setRecentQueries(prev => {
      const entry = { id: Date.now(), title: q.trim(), time: "Just now" };
      return [entry, ...prev.filter(r => r.title !== q.trim())].slice(0, 8);
    });
    setView("chatbot");
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("https://app1-50043993858.development.catalystappsail.in/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          system_prompt:
            "You are the KSP Intelligence Engine, an AI assistant for Karnataka State Police officers. Answer questions about crime trends, FIR data, suspect analysis, and district intelligence clearly and factually.",
        }),
      });
      const data = await res.json();
      const aiText = data.response
        ? data.response.trim()
        : data.error
        ? `⚠ Backend error: ${data.error}`
        : "⚠ No response from the intelligence engine.";
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "⚠ Could not reach the backend." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", fontFamily: F, background: BG, overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: sidebarOpen ? 236 : 0, minWidth: sidebarOpen ? 236 : 0, background: NAV, display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.18s ease, min-width 0.18s ease", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Brand */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <GovEmblem size={38} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: WH, whiteSpace: "nowrap" }}>KSP Intelligence Platform</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2, letterSpacing: "0.07em", textTransform: "uppercase" }}>Secure · Classified</div>
          </div>
        </div>

        {/* New query */}
        <div style={{ padding: "12px 16px 6px" }}>
          <button onClick={() => { setMessages([]); setView("chatbot"); }}
            style={{ width: "100%", padding: "8px 12px", border: `1px solid ${AMB}`, background: "transparent", color: AMB, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={13} /> New Query
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: "6px 16px", display: "flex", flexDirection: "column" }}>
          {([
            { id: "chatbot",    label: "AI Chatbot"  },
            { id: "dashboards", label: "Dashboards"  },
            { id: "settings",   label: "Settings"    },
          ] as { id: AppView; label: string }[]).map(({ id, label }) => (
            <button key={id} onClick={() => setView(id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", borderLeft: view === id ? `3px solid ${AMB}` : "3px solid transparent", background: view === id ? "rgba(255,255,255,0.07)" : "transparent", color: view === id ? WH : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 13, fontWeight: view === id ? 600 : 400, textAlign: "left", fontFamily: F, width: "100%" }}>
              {label}
            </button>
          ))}
        </nav>

        {/* Recent */}
        <div style={{ padding: "10px 16px 4px", flex: 1, overflow: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 8 }}>Recent Queries</div>
          {recentQueries.length === 0
            ? <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>No queries yet.</p>
            : recentQueries.map(c => (
              <button key={c.id} onClick={() => setView("chatbot")}
                style={{ display: "flex", gap: 8, padding: "6px 0", border: "none", background: "transparent", color: "rgba(255,255,255,0.38)", cursor: "pointer", fontSize: 11, textAlign: "left", width: "100%", fontFamily: F, overflow: "hidden" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.title}</span>
                <span style={{ fontSize: 10, opacity: 0.5, flexShrink: 0 }}>{c.time}</span>
              </button>
            ))
          }
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => setView("landing" as AppView)}
            style={{ background: AMB, border: "none", cursor: "pointer", color: "#1a1a2e", fontSize: 12, fontFamily: F, fontWeight: 700, padding: "8px 14px", marginBottom: 12, display: "block", width: "100%", textAlign: "left", letterSpacing: "0.01em" }}
            onMouseEnter={e => { e.currentTarget.style.background = RD; e.currentTarget.style.color = WH; }}
            onMouseLeave={e => { e.currentTarget.style.background = AMB; e.currentTarget.style.color = "#1a1a2e"; }}>
            ← Back to Home
          </button>
          <div style={{ fontSize: 12, color: WH, fontWeight: 600 }}>Insp. K. Rajesh</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>Bengaluru North · Level 3</div>
        </div>
      </aside>

      {/* ── Main panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <header style={{ height: 48, background: WH, borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ border: "none", background: "transparent", cursor: "pointer", color: MU, padding: 4, display: "flex" }}>
            <Menu size={18} />
          </button>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: NAV }}>KSP Intelligence Platform</div>
          <div style={{ padding: "3px 10px", border: `1px solid #e2c97a`, background: "#fffbeb", color: AD, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
            CLASSIFIED · LEVEL 3
          </div>
        </header>

        <main style={{ flex: 1, overflow: "auto" }}>
          {view === "chatbot"    && <ChatbotView query={query} setQuery={setQuery} onSearch={handleSearch} messages={messages} recentQueries={recentQueries} isLoading={isLoading} />}
          {view === "dashboards" && <DashboardsView />}
          {view === "settings"   && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

/* ─── Query input (top-level to prevent remount on each keystroke) ── */
function QueryInput({ query, setQuery, onSearch, listening, toggleVoice, fileRef, compact }: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: (q: string) => void;
  listening: boolean;
  toggleVoice: () => void;
  fileRef: React.RefObject<HTMLInputElement>;
  compact?: boolean;
}) {
  return (
    <div style={{ display: "flex", width: "100%", maxWidth: compact ? 680 : 700, border: `1px solid ${listening ? RD : BD}`, background: BG, alignItems: "flex-end" }}>
      <input ref={fileRef} type="file" style={{ display: "none" }} multiple accept=".pdf,.doc,.docx,.csv,.txt,.jpg,.png" />
      <button onClick={() => fileRef.current?.click()} title="Attach file"
        style={{ border: "none", borderRight: `1px solid ${BD}`, background: "transparent", color: MU, cursor: "pointer", padding: "0 11px", alignSelf: "stretch", display: "flex", alignItems: "center" }}>
        <Paperclip size={14} />
      </button>
      <textarea
        value={query}
        onChange={e => { setQuery(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSearch(query); } }}
        placeholder={listening ? "Listening…" : "Ask about crime trends, suspects, or district data..."}
        rows={1}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: compact ? "9px 12px" : "11px 14px", fontSize: compact ? 13 : 14, color: TX, fontFamily: F, resize: "none", lineHeight: 1.5, maxHeight: 120, overflow: "auto" }}
      />
      {query && !listening && (
        <button onClick={() => setQuery("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: MU, padding: "0 8px", alignSelf: "flex-end", paddingBottom: 10 }}>
          <X size={12} />
        </button>
      )}
      <button onClick={toggleVoice}
        style={{ border: "none", borderLeft: `1px solid ${BD}`, background: listening ? RD : "transparent", color: listening ? WH : MU, cursor: "pointer", padding: "0 12px", alignSelf: "stretch" }}>
        {listening ? <MicOff size={14} /> : <Mic size={14} />}
      </button>
      <button onClick={() => onSearch(query)} disabled={!query.trim()}
        style={{ border: "none", borderLeft: `1px solid ${BD}`, background: query.trim() ? NAV : "#edf0f5", color: query.trim() ? WH : MU, cursor: query.trim() ? "pointer" : "not-allowed", padding: "0 20px", fontSize: 12, fontWeight: 600, fontFamily: F, alignSelf: "stretch" }}>
        Submit
      </button>
    </div>
  );
}

/* ─── Chatbot view ────────────────────────────────────────── */
function ChatbotView({ query, setQuery, onSearch, messages, recentQueries, isLoading }: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: (q: string) => void;
  messages: { role: "user" | "ai"; text: string }[];
  recentQueries: { id: number; title: string; time: string }[];
  isLoading?: boolean;
}) {
  const isEmpty = messages.length === 0;
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  function toggleVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.onresult = (e: any) => setQuery(Array.from(e.results).map((r: any) => r[0].transcript).join(""));
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  function exportPDF() {
    const date = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
    const rows = messages.map(m =>
      `<div class="${m.role}"><span class="label">${m.role === "user" ? "Officer" : "KSP Intelligence Engine"}</span><p>${m.text.replace(/\n/g, "<br/>")}</p></div>`
    ).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>KSP Intelligence Export</title>
      <style>body{font-family:system-ui;margin:40px;color:#1a1a2e;font-size:14px}h1{font-size:18px}.meta{font-size:11px;color:#5a6474;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #e5e7eb}.user,.ai{margin-bottom:16px;padding:12px 16px;max-width:80%}.user{background:#1a3a5c;color:#fff;margin-left:auto}.ai{background:#f3f4f6;border:1px solid #e5e7eb;border-left:3px solid #f4a100}.label{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.6;display:block;margin-bottom:4px}p{margin:0;line-height:1.6}</style>
      </head><body><h1>KSP Intelligence Command Center</h1><div class="meta">Export · ${date} · CONFIDENTIAL — AUTHORISED USE ONLY</div>${rows}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {isEmpty ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: GR, display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: GR, display: "inline-block" }} />
            Secure session · Live data
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: NAV, margin: "0 0 8px", textAlign: "center" }}>AI Crime Analysis Cases</h1>
          <p style={{ fontSize: 13, color: MU, maxWidth: 500, textAlign: "center", lineHeight: 1.6, marginBottom: 32 }}>
            Query crime trends, suspect profiles, FIR records, and district intelligence using plain English.
          </p>

          <QueryInput query={query} setQuery={setQuery} onSearch={onSearch} listening={listening} toggleVoice={toggleVoice} fileRef={fileRef} />

          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 20, width: "100%", maxWidth: 700 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MU, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Suggested queries:</div>
            {SUGGESTIONS.map((label, i) => (
              <button key={label} onClick={() => onSearch(label)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", border: `1px solid ${BD}`, borderTop: i > 0 ? "none" : `1px solid ${BD}`, background: WH, color: NAV, fontSize: 12, cursor: "pointer", fontFamily: F, textAlign: "left" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f3f7fc"}
                onMouseLeave={e => e.currentTarget.style.background = WH}
              >
                {label}
                <ChevronRight size={12} color={MU} style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", maxWidth: 860, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, background: msg.role === "user" ? NAV : "#eef2f8", border: `1px solid ${msg.role === "user" ? NAV : BD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: msg.role === "user" ? WH : NAV, fontSize: 9, fontWeight: 700 }}>{msg.role === "user" ? "KR" : "AI"}</span>
                </div>
                <div style={{ maxWidth: "75%", padding: "10px 14px", background: msg.role === "user" ? NAV : WH, border: `1px solid ${msg.role === "user" ? NAV : BD}`, borderLeft: msg.role === "ai" ? `3px solid ${AMB}` : undefined, color: msg.role === "user" ? WH : TX, fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-line", fontFamily: F }}>
                  {msg.role === "ai" && (
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: AD, marginBottom: 6 }}>
                      KSP Intelligence Engine v2.4
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, background: "#eef2f8", border: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: NAV, fontSize: 9, fontWeight: 700 }}>AI</span>
                </div>
                <div style={{ padding: "10px 14px", background: WH, border: `1px solid ${BD}`, borderLeft: `3px solid ${AMB}`, fontSize: 13, color: MU, fontFamily: F }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: AD, marginBottom: 6 }}>KSP Intelligence Engine v2.4</div>
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    <span style={{ animation: "dot-blink 1.2s 0s infinite" }}>●</span>
                    <span style={{ animation: "dot-blink 1.2s 0.4s infinite" }}>●</span>
                    <span style={{ animation: "dot-blink 1.2s 0.8s infinite" }}>●</span>
                  </span>
                </div>
              </div>
            )}
            {!isLoading && messages.length > 0 && (
              <div style={{ paddingTop: 10, borderTop: `1px solid ${BD}` }}>
                <span style={{ fontSize: 11, color: MU }}>Analysis complete · 3 data sources consulted</span>
              </div>
            )}
          </div>

          <div style={{ padding: "12px 24px", background: BG, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <QueryInput compact query={query} setQuery={setQuery} onSearch={onSearch} listening={listening} toggleVoice={toggleVoice} fileRef={fileRef} />
            <button onClick={exportPDF}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: `1px solid ${BD}`, background: BG, color: TX, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: F, flexShrink: 0, height: 38 }}>
              <Download size={12} /> Export PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Dashboards view ─────────────────────────────────────── */
function DashboardsView() {
  const districts = [
    { name: "Bengaluru North",    cases: 421, sev: "high"   },
    { name: "Bengaluru South",    cases: 318, sev: "medium" },
    { name: "Mysuru",             cases: 207, sev: "medium" },
    { name: "Mangaluru",          cases: 165, sev: "low"    },
    { name: "Hubballi-Dharwad",   cases: 193, sev: "medium" },
    { name: "Belagavi",           cases: 142, sev: "low"    },
  ];
  const categories = [
    { type: "Theft & Burglary", count: 1842, pct: 38 },
    { type: "Vehicle Crime",    count: 967,  pct: 20 },
    { type: "Assault",          count: 724,  pct: 15 },
    { type: "Cybercrime",       count: 628,  pct: 13 },
    { type: "Missing Persons",  count: 436,  pct: 9  },
    { type: "Other",            count: 224,  pct: 5  },
  ];

  const sevColor = (s: string) => s === "high" ? RD : s === "medium" ? "#b45309" : GR;
  const sevMark  = (s: string) => s === "high" ? "▲" : s === "medium" ? "●" : "▼";

  return (
    <div style={{ padding: "28px 32px", maxWidth: 980, margin: "0 auto", fontFamily: F }}>
      <div style={{ marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${BD}` }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: NAV, margin: "0 0 4px" }}>District Intelligence Overview</h2>
        <p style={{ fontSize: 12, color: MU, margin: 0 }}>Real-time case distribution · Last updated 14 min ago</p>
      </div>

      <div style={{ padding: "8px 12px", background: "#fffbeb", border: `1px solid #e2c97a`, borderLeft: `4px solid ${AMB}`, marginBottom: 20, fontSize: 12, color: AD }}>
        ▲ High alert: Bengaluru North reports 12% spike in vehicle theft — last 72 hours.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: WH, border: `1px solid ${BD}`, borderTop: `3px solid ${NAV}` }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BD}`, fontSize: 11, fontWeight: 700, color: TX, textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Cases by District</div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {districts.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: sevColor(d.sev), fontWeight: 700, width: 10, flexShrink: 0 }}>{sevMark(d.sev)}</span>
                <span style={{ flex: 1, fontSize: 12, color: TX }}>{d.name}</span>
                <div style={{ flex: 2, height: 4, background: "#eef0f5" }}>
                  <div style={{ height: "100%", width: `${(d.cases / 421) * 100}%`, background: sevColor(d.sev) }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: TX, minWidth: 32, textAlign: "right" }}>{d.cases}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: WH, border: `1px solid ${BD}`, borderTop: `3px solid ${AMB}` }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BD}`, fontSize: 11, fontWeight: 700, color: TX, textTransform: "uppercase", letterSpacing: "0.06em" }}>Crime Category Breakdown</div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map(c => (
              <div key={c.type}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: TX }}>{c.type}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>{c.count.toLocaleString()} <span style={{ color: MU, fontWeight: 400 }}>({c.pct}%)</span></span>
                </div>
                <div style={{ height: 4, background: "#eef0f5" }}>
                  <div style={{ height: "100%", width: `${c.pct}%`, background: NAV }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Settings view ───────────────────────────────────────── */
function SettingsView() {
  const sections = [
    { section: "Profile",     items: [{ label: "Display Name", value: "Inspector K. Rajesh" }, { label: "Badge Number", value: "KSP-2847" }, { label: "Division", value: "Bengaluru North" }] },
    { section: "Security",    items: [{ label: "Two-Factor Authentication", value: "Enabled" }, { label: "Session Timeout", value: "30 minutes" }, { label: "Audit Log", value: "All actions logged" }] },
    { section: "Preferences", items: [{ label: "Language", value: "English" }, { label: "Data Region", value: "Karnataka" }, { label: "Notifications", value: "High Priority Only" }] },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 640, margin: "0 auto", fontFamily: F }}>
      <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${BD}` }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: NAV, margin: "0 0 4px" }}>Account Settings</h2>
        <p style={{ fontSize: 12, color: MU, margin: 0 }}>Account preferences and security configuration.</p>
      </div>

      {sections.map(({ section, items }) => (
        <div key={section} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: MU, marginBottom: 8 }}>{section}</div>
          <div style={{ background: WH, border: `1px solid ${BD}`, borderTop: `2px solid ${NAV}` }}>
            {items.map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: i < items.length - 1 ? "1px solid #edf0f4" : "none" }}>
                <span style={{ flex: 1, fontSize: 13, color: TX }}>{item.label}</span>
                <span style={{ fontSize: 13, color: MU }}>{item.value}</span>
                <ChevronRight size={12} color={MU} style={{ marginLeft: 8 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
