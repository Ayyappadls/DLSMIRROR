import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   DLSMEDIA — BUSINESS MIRROR (MVP)
   "See your business clearly."
   Design tokens: navy / bronze / cream, editorial-ledger feel
   ============================================================ */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`;

const TOKENS = {
  navy950: "#0A1628",
  navy800: "#132542",
  navy700: "#1B3358",
  bronze500: "#B8874C",
  bronze300: "#D9B889",
  bronze100: "#F1E4CE",
  cream50: "#F7F4EC",
  cream100: "#EFE9DA",
  ink700: "#26221C",
  ink500: "#5B564C",
  good: "#5C8A6B",
  warn: "#C08A3E",
  bad: "#B0503F",
};

const LANGS = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
];

const T = {
  en: {
    welcome: "Welcome to DLSMedia",
    tagline: "Understand your business clearly. Make better decisions.",
    chooseLang: "Choose your language",
    continue: "Continue",
    yourName: "Your name",
    bizName: "Business name",
    city: "City",
    bizType: "What kind of business is this?",
    years: "Years in business",
    employees: "Number of employees",
    describeBiz: "Describe your business in your own words",
    describePh: "e.g. I run a small wholesale textile business in Tiruppur.",
    startInterview: "Tell DLS about your business",
    typeInstead: "Type instead",
    speakNow: "Listening… speak now",
    send: "Send",
    loadDemo: "See a demo business instead",
    mirror: "Your Business Mirror",
    completeness: "of your business picture is complete",
    snapshot: "Business Snapshot",
    revenue: "Monthly revenue",
    grossProfit: "Estimated gross profit",
    opProfit: "Estimated operating profit",
    netProfit: "Estimated net profit",
    cashPos: "Monthly cash position",
    debt: "Outstanding debt",
    whatDlsSees: "What DLS Sees",
    decisionSupport: "What should you think about next?",
    healthScore: "DLS Business Health",
    indicative: "This is an indicative assessment based on the information you provided.",
    ownerProvided: "OWNER PROVIDED",
    calculated: "CALCULATED",
    estimated: "ESTIMATED",
    unknown: "UNKNOWN",
    correct: "That's wrong — let me correct it",
    save: "Save",
    cancel: "Cancel",
    journal: "Tell DLS What Happened",
    journalPh: "e.g. Sales were lower this week because...",
    addEntry: "Add entry",
    admin: "Admin view",
    ownerView: "Owner view",
    talkToDls: "Talk to DLS",
    requestHelp: "Request a call, review, or specialist support",
    requestSent: "Request sent. DLS staff will follow up.",
    notEnoughInfo: "We don't have enough information yet.",
    why: "WHY",
    impact: "IMPACT",
    whatNext: "WHAT NEXT",
    problem: "Problem",
    action: "Possible action",
    effect: "Expected effect",
    needed: "Information still needed",
    thinking: "DLS is thinking…",
    restart: "Start over",
    priority: "Priority",
    goals: "What are you trying to do right now?",
    solutions: "Solutions DLS May Recommend",
    solutionsNote: "These are general starting points, not a specific product or provider. Future versions may connect you to verified partners.",
    monthlyReview: "Monthly Business Review",
    saveSnapshot: "Save this month's numbers",
    noSnapshots: "Save a snapshot each month to see how your business is changing.",
    vsLastSaved: "vs. previous saved snapshot",
    privacy: "Your data",
    privacyNote: "Your business information is used only to build your personalized Business Mirror. It is not sold or shared without your consent.",
    exportData: "Export my data",
    deleteData: "Delete all my data",
    deleteConfirm: "This will permanently remove everything saved for this business. Delete anyway?",
    deleted: "Your data has been deleted.",
  },
};
// Fallback: any missing key in another language draws from English.
const tr = (lang, key) => (T[lang] && T[lang][key]) || T.en[key] || key;

const BIZ_TYPES = [
  "Retail", "Restaurant / Food", "Manufacturing", "Trading", "Distribution",
  "Services", "Professional services", "E-commerce", "Agriculture-related",
  "Construction", "Transport", "Other",
];

const DEMO_PROFILE = {
  ownerName: "Rekha Suresh",
  bizName: "Suresh Fashions",
  city: "Coimbatore",
  bizType: "Retail",
  bizDescription: "A small clothing shop selling ready-made garments, mostly walk-in customers with a few regular credit customers.",
  years: 6,
  employees: 3,
};

const DEMO_DATA = {
  revenue_monthly: { value: 600000, source: "owner" },
  purchase_cost_monthly: { value: 360000, source: "owner" },
  rent_monthly: { value: 30000, source: "owner" },
  salaries_monthly: { value: 75000, source: "owner" },
  utilities_monthly: { value: 15000, source: "owner" },
  marketing_monthly: { value: 10000, source: "owner" },
  other_opex_monthly: { value: 20000, source: "owner" },
  loan_repayment_monthly: { value: 40000, source: "owner" },
  debt_outstanding: { value: 500000, source: "owner" },
  receivables: { value: 80000, source: "owner" },
  inventory_value: { value: 250000, source: "owner" },
};

const CORE_FIELDS = [
  "revenue_monthly", "purchase_cost_monthly", "rent_monthly", "salaries_monthly",
  "utilities_monthly", "marketing_monthly", "other_opex_monthly",
  "loan_repayment_monthly", "debt_outstanding", "receivables", "inventory_value",
];

const GOAL_OPTIONS = [
  "Become profitable", "Increase profit", "Increase sales", "Reduce losses",
  "Reduce debt", "Improve cash flow", "Expand", "Open another location",
  "Hire people", "Improve marketing", "Improve operations", "Use technology",
];

// Maps a diagnosis observation "type" to plain-language starting-point solutions (§18).
const SOLUTIONS_MAP = {
  cashflow: ["Improve bookkeeping", "Improve collections", "Review debt"],
  margin: ["Review pricing", "Reduce inventory", "Improve bookkeeping"],
  inventory: ["Reduce inventory", "Improve bookkeeping"],
  customer: ["Improve customer retention", "Digitize operations"],
  founder: ["Seek specialist support", "Digitize operations"],
  debt: ["Review debt", "Improve collections"],
  other: ["Seek specialist support", "Improve bookkeeping"],
};

const SNAPSHOT_LABELS = {
  revenue: "Monthly revenue",
  opProfit: "Operating profit",
  netProfit: "Net profit",
  debtOutstanding: "Outstanding debt",
};

const FIELD_LABELS = {
  revenue_monthly: "Monthly revenue",
  purchase_cost_monthly: "Monthly product/purchase cost",
  rent_monthly: "Monthly rent",
  salaries_monthly: "Monthly salaries",
  utilities_monthly: "Monthly utilities",
  marketing_monthly: "Monthly marketing spend",
  other_opex_monthly: "Other monthly operating expenses",
  loan_repayment_monthly: "Monthly loan repayment",
  debt_outstanding: "Total outstanding debt",
  receivables: "Money owed to you by customers",
  inventory_value: "Current inventory value",
};

async function callClaude(system, userText, opts = {}) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: opts.maxTokens || 1200,
    system,
    messages: [{ role: "user", content: userText }],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return text;
}

function safeParseJSON(text) {
  if (!text) return null;
  let clean = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
  try {
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

const money = (n) =>
  n === null || n === undefined || isNaN(n)
    ? "—"
    : "₹" + Math.round(n).toLocaleString("en-IN");

function ProvenanceBadge({ source }) {
  const map = {
    owner: { label: "OWNER PROVIDED", color: TOKENS.navy700, bg: TOKENS.bronze100 },
    calculated: { label: "CALCULATED", color: TOKENS.good, bg: "#E7EFE9" },
    estimated: { label: "ESTIMATED", color: TOKENS.warn, bg: "#F5EADA" },
    unknown: { label: "UNKNOWN", color: TOKENS.bad, bg: "#F3E2DE" },
  };
  const m = map[source] || map.unknown;
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9.5px",
        letterSpacing: "0.06em",
        color: m.color,
        background: m.bg,
        padding: "2px 6px",
        borderRadius: "3px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {m.label}
    </span>
  );
}

export default function BusinessMirror() {
  const [stage, setStage] = useState("boot"); // boot -> lang -> profile -> interview -> mirror
  const [lang, setLang] = useState("en");
  const [profile, setProfile] = useState({
    ownerName: "", bizName: "", city: "", bizType: "", bizDescription: "", years: "", employees: "",
  });
  const [goals, setGoals] = useState([]);
  const [data, setData] = useState({});
  const [journal, setJournal] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagBusy, setDiagBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [helpSent, setHelpSent] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // ---- persistence ----
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("business-mirror-state", false);
        if (r && r.value) {
          const s = JSON.parse(r.value);
          setProfile(s.profile || profile);
          setGoals(s.goals || []);
          setData(s.data || {});
          setJournal(s.journal || []);
          setSnapshots(s.snapshots || []);
          setChat(s.chat || []);
          setLang(s.lang || "en");
          setStage(s.stage || "lang");
          return;
        }
      } catch (e) {
        /* no saved state */
      }
      setStage("lang");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    (patch) => {
      const next = {
        profile, goals, data, journal, snapshots, chat, lang, stage,
        ...patch,
      };
      window.storage.set("business-mirror-state", JSON.stringify(next), false).catch(() => {});
    },
    [profile, goals, data, journal, snapshots, chat, lang, stage]
  );

  useEffect(() => {
    if (stage !== "boot") persist({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, goals, data, journal, snapshots, chat, lang, stage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ---- derived calculations ----
  const val = (key) => (data[key] ? Number(data[key].value) : null);
  const revenue = val("revenue_monthly");
  const purchase = val("purchase_cost_monthly");
  const rent = val("rent_monthly");
  const salaries = val("salaries_monthly");
  const utilities = val("utilities_monthly");
  const marketing = val("marketing_monthly");
  const otherOpex = val("other_opex_monthly");
  const loanRepay = val("loan_repayment_monthly");
  const debtOutstanding = val("debt_outstanding");
  const receivables = val("receivables");
  const inventoryValue = val("inventory_value");

  const grossProfit = revenue !== null && purchase !== null ? revenue - purchase : null;
  const fixedCosts =
    [rent, salaries, utilities, marketing, otherOpex].every((x) => x !== null)
      ? rent + salaries + utilities + marketing + otherOpex
      : null;
  const opProfit = grossProfit !== null && fixedCosts !== null ? grossProfit - fixedCosts : null;
  const netProfit = opProfit !== null && loanRepay !== null ? opProfit - loanRepay : null;
  const cashPosition = netProfit; // MVP simplification, clearly labeled as estimated

  const filledCore = CORE_FIELDS.filter((k) => data[k]).length;
  const completeness = Math.round((filledCore / CORE_FIELDS.length) * 100);

  // ---- language selection ----
  function chooseLang(code) {
    setLang(code);
    setStage("profile");
  }

  // ---- profile submit ----
  function submitProfile() {
    setStage("interview");
    if (chat.length === 0) {
      const openLine =
        lang === "en"
          ? `Hi ${profile.ownerName || "there"}. Tell me about ${profile.bizName || "your business"} — start wherever feels natural. For example: your monthly sales, what you spend to buy or make what you sell, rent, staff, or any loans.`
          : `Hi ${profile.ownerName || ""}. ${T.en.startInterview} — ${T.en.describePh}`;
      setChat([{ role: "dls", text: openLine }]);
    }
  }

  function loadDemo() {
    setProfile(DEMO_PROFILE);
    setData(DEMO_DATA);
    setLang("en");
    setChat([
      { role: "owner", text: "I have a clothing shop. Monthly sales are around six lakh, product cost about 3.8 lakh, rent 30k, three staff..." },
      { role: "dls", text: "Got it — I've filled in your Business Mirror with what you described. Review it below, and correct anything that isn't quite right." },
    ]);
    setStage("mirror");
  }

  // ---- speech input (Web Speech API, best-effort) ----
  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input isn't supported in this browser. Please type instead.");
      return;
    }
    const rec = new SR();
    const bcp = { en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", ml: "ml-IN" }[lang] || "en-IN";
    rec.lang = bcp;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setChatInput((prev) => (prev ? prev + " " + text : text));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }
  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  // ---- adaptive interview turn ----
  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatBusy) return;
    setChatInput("");
    const newChat = [...chat, { role: "owner", text }];
    setChat(newChat);
    setChatBusy(true);

    const known = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v.value])
    );
    const missing = CORE_FIELDS.filter((k) => !data[k]);

    const system = `You are DLS, an AI business analyst inside DLSMedia's "Business Mirror" tool. You are interviewing a small, often informally-run business owner (${profile.bizType || "unspecified type"}: "${profile.bizDescription || "no description given"}") to build a structured financial picture. Reply ONLY in this language: ${LANGS.find((l) => l.code === lang)?.label || "English"}.

Rules:
- Never invent numbers. Only extract what the owner actually stated.
- Ask ONE short, plain-language follow-up question at a time, adaptive to what they just said (per DLS methodology: broad first, then drill down — e.g. after revenue, ask about cost of goods; if they mention credit sales, ask about receivables).
- No MBA jargon. Explain briefly if a term might be unfamiliar.
- If the owner has now covered enough (roughly ${CORE_FIELDS.length - missing.length}/${CORE_FIELDS.length} core numbers: ${CORE_FIELDS.join(", ")}), you may say they can review their Business Mirror now instead of asking more.

Known so far (JSON): ${JSON.stringify(known)}
Still missing: ${JSON.stringify(missing)}

Return ONLY raw JSON, no markdown fences, no prose outside the JSON, in this exact shape:
{"extracted": {"<field_key>": <number>, ...}, "reply": "<your short reply/question to the owner, in the target language>", "ready_for_mirror": <true|false>}
Only include field keys from this exact set when extracting: ${CORE_FIELDS.join(", ")}. Extract only fields the owner actually just gave a number for (in this message or clearly implied). Do not restate old known values in "extracted".`;

    try {
      const raw = await callClaude(system, text);
      const parsed = safeParseJSON(raw);
      if (parsed) {
        if (parsed.extracted) {
          setData((prev) => {
            const next = { ...prev };
            Object.entries(parsed.extracted).forEach(([k, v]) => {
              if (CORE_FIELDS.includes(k) && typeof v === "number" && !isNaN(v)) {
                next[k] = { value: v, source: "owner" };
              }
            });
            return next;
          });
        }
        const replyText = parsed.reply || "Thanks — tell me more.";
        setChat((c) => [...c, { role: "dls", text: replyText }]);
        if (parsed.ready_for_mirror) {
          setTimeout(() => setStage("mirror"), 400);
        }
      } else {
        setChat((c) => [...c, { role: "dls", text: "Could you say that a bit differently? I want to make sure I capture the right numbers." }]);
      }
    } catch (e) {
      setChat((c) => [...c, { role: "dls", text: "I couldn't reach the analysis service just now. Please try again." }]);
    }
    setChatBusy(false);
  }

  // ---- diagnosis ----
  async function runDiagnosis() {
    setDiagBusy(true);
    setDiagnosis(null);
    const known = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.value]));
    const derived = { grossProfit, fixedCosts, opProfit, netProfit, completeness };
    const system = `You are the DLS Diagnosis Engine, part of DLSMedia's Business Mirror. Analyze this small business's structured financial data using DLS methodology: unit-level thinking, second-order effects (don't stop at "debt is high" — trace WHY it matters and what it causes), and constraint identification. Business: ${profile.bizType}, "${profile.bizDescription}", ${profile.years} years old, ${profile.employees} employees, city: ${profile.city}.

Reply ONLY in this language: ${LANGS.find((l) => l.code === lang)?.label || "English"}.
Never invent numbers not derivable from the data given. If data is missing, say so plainly rather than guessing.
Be direct and specific — reference the owner's actual figures. Do not give generic motivational advice. If risk indicators suggest an action (like expansion or more borrowing) would be unwise given the numbers, say so plainly ("you may not need additional borrowing yet" style) rather than hedging into vagueness.

Owner-provided data (JSON): ${JSON.stringify(known)}
Calculated figures (JSON): ${JSON.stringify(derived)}

Return ONLY raw JSON, no markdown fences, in this exact shape:
{
 "observations": [ {"headline": "...", "detail": "...", "type": "cashflow|margin|inventory|customer|founder|debt|other"} ... up to 5 ...],
 "second_order": [ {"chain": ["Debt", "Interest", "Reduced monthly cash flow", "..."], "explanation": "..."} ... 1-2 ...],
 "priorities": [ {"title":"...", "problem":"...", "why":"...", "action":"...", "effect":"...", "needed":"..."} ... up to 3, ordered by priority ...],
 "health": { "score": <0-100 or null if not enough data>, "dimensions": { "profitability": <0-100|null>, "cash_flow": <0-100|null>, "debt_pressure": <0-100|null>, "cost_control": <0-100|null> }, "note": "short caveat sentence" }
}`;
    try {
      const raw = await callClaude(system, "Generate the diagnosis now.", { maxTokens: 1800 });
      const parsed = safeParseJSON(raw);
      setDiagnosis(parsed || { error: true });
    } catch (e) {
      setDiagnosis({ error: true });
    }
    setDiagBusy(false);
  }

  // ---- correction ----
  function openEdit(key) {
    setEditField(key);
    setEditValue(data[key] ? String(data[key].value) : "");
  }
  function saveEdit() {
    const num = Number(editValue.replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && editValue !== "") {
      setData((prev) => ({ ...prev, [editField]: { value: num, source: "owner" } }));
      setDiagnosis(null); // stale, needs recompute
    }
    setEditField(null);
  }

  function addJournalEntry(text) {
    if (!text.trim()) return;
    setJournal((j) => [{ text, date: new Date().toISOString() }, ...j]);
  }

  function saveSnapshot() {
    setSnapshots((prev) => [
      { date: new Date().toISOString(), revenue, opProfit, netProfit, debtOutstanding, receivables, inventoryValue },
      ...prev,
    ]);
  }

  function exportData() {
    const payload = { profile, goals, data, journal, snapshots, lang, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(profile.bizName || "business").replace(/\s+/g, "_")}_dls_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAllData() {
    if (!window.confirm(tr(lang, "deleteConfirm"))) return;
    try {
      await window.storage.delete("business-mirror-state", false);
    } catch (e) {
      /* nothing stored yet */
    }
    setProfile({ ownerName: "", bizName: "", city: "", bizType: "", bizDescription: "", years: "", employees: "" });
    setGoals([]); setData({}); setJournal([]); setSnapshots([]); setChat([]); setDiagnosis(null);
    setStage("lang");
    alert(tr(lang, "deleted"));
  }

  // ================= RENDER =================
  const wrap = {
    fontFamily: "'Source Sans 3', sans-serif",
    color: TOKENS.ink700,
    minHeight: "100%",
    background: TOKENS.cream50,
    display: "flex",
    flexDirection: "column",
  };
  const serif = { fontFamily: "'Fraunces', serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };

  if (stage === "boot") {
    return (
      <div style={{ ...wrap, alignItems: "center", justifyContent: "center", padding: 40 }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ ...serif, fontSize: 20, color: TOKENS.navy800 }}>DLSMedia</div>
      </div>
    );
  }

  if (stage === "lang") {
    return (
      <div style={{ ...wrap, alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 11, letterSpacing: "0.18em", color: TOKENS.bronze500, marginBottom: 14 }}>
            DLS BUSINESS MIRROR
          </div>
          <div style={{ ...serif, fontSize: 34, fontWeight: 600, color: TOKENS.navy950, lineHeight: 1.15, marginBottom: 10 }}>
            {tr(lang, "welcome")}
          </div>
          <div style={{ color: TOKENS.ink500, fontSize: 15, marginBottom: 34 }}>{tr(lang, "tagline")}</div>
          <div style={{ fontSize: 12.5, color: TOKENS.ink500, marginBottom: 12, ...mono, letterSpacing: "0.06em" }}>
            {tr(lang, "chooseLang").toUpperCase()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => chooseLang(l.code)}
                style={{
                  padding: "14px 10px",
                  borderRadius: 8,
                  border: `1px solid ${TOKENS.bronze300}`,
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                  color: TOKENS.navy950,
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.bronze100)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <div style={{ fontWeight: 600 }}>{l.native}</div>
                <div style={{ fontSize: 11, color: TOKENS.ink500 }}>{l.label}</div>
              </button>
            ))}
          </div>
          <button
            onClick={loadDemo}
            style={{
              marginTop: 28,
              background: "none",
              border: "none",
              color: TOKENS.navy700,
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {tr(lang, "loadDemo")}
          </button>
        </div>
      </div>
    );
  }

  if (stage === "profile") {
    const inputStyle = {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 7,
      border: `1px solid ${TOKENS.cream100}`,
      background: "#fff",
      fontSize: 14.5,
      marginBottom: 14,
      boxSizing: "border-box",
      fontFamily: "inherit",
    };
    return (
      <div style={{ ...wrap, padding: "36px 22px", alignItems: "center" }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ ...serif, fontSize: 24, fontWeight: 600, color: TOKENS.navy950, marginBottom: 22 }}>
            {tr(lang, "welcome")}
          </div>
          <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "yourName")}</label>
          <input style={inputStyle} value={profile.ownerName} onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })} />
          <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "bizName")}</label>
          <input style={inputStyle} value={profile.bizName} onChange={(e) => setProfile({ ...profile, bizName: e.target.value })} />
          <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "city")}</label>
          <input style={inputStyle} value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
          <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "bizType")}</label>
          <select style={inputStyle} value={profile.bizType} onChange={(e) => setProfile({ ...profile, bizType: e.target.value })}>
            <option value="">—</option>
            {BIZ_TYPES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "years")}</label>
              <input type="number" style={inputStyle} value={profile.years} onChange={(e) => setProfile({ ...profile, years: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "employees")}</label>
              <input type="number" style={inputStyle} value={profile.employees} onChange={(e) => setProfile({ ...profile, employees: e.target.value })} />
            </div>
          </div>
          <label style={{ fontSize: 12, color: TOKENS.ink500 }}>{tr(lang, "describeBiz")}</label>
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            placeholder={tr(lang, "describePh")}
            value={profile.bizDescription}
            onChange={(e) => setProfile({ ...profile, bizDescription: e.target.value })}
          />
          <label style={{ fontSize: 12, color: TOKENS.ink500, display: "block", marginBottom: 8 }}>{tr(lang, "goals")}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
            {GOAL_OPTIONS.map((g) => {
              const active = goals.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => setGoals((prev) => (active ? prev.filter((x) => x !== g) : [...prev, g]))}
                  style={{
                    padding: "6px 11px", borderRadius: 16, fontSize: 12,
                    border: `1px solid ${active ? TOKENS.navy950 : TOKENS.cream100}`,
                    background: active ? TOKENS.navy950 : "#fff",
                    color: active ? "#fff" : TOKENS.ink700, cursor: "pointer",
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
          <button
            onClick={submitProfile}
            disabled={!profile.ownerName || !profile.bizName}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 8,
              border: "none",
              background: !profile.ownerName || !profile.bizName ? TOKENS.bronze300 : TOKENS.navy950,
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: !profile.ownerName || !profile.bizName ? "not-allowed" : "pointer",
              marginTop: 6,
            }}
          >
            {tr(lang, "continue")}
          </button>
        </div>
      </div>
    );
  }

  if (stage === "interview") {
    return (
      <div style={{ ...wrap, height: "100%" }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${TOKENS.cream100}`, background: TOKENS.navy950, color: "#fff" }}>
          <div style={{ ...mono, fontSize: 10, letterSpacing: "0.14em", color: TOKENS.bronze300 }}>DLS BUSINESS MIRROR</div>
          <div style={{ ...serif, fontSize: 17, marginTop: 2 }}>{tr(lang, "startInterview")}</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 260, maxHeight: 420 }}>
          {chat.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "owner" ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 13px",
                  borderRadius: 12,
                  fontSize: 14,
                  lineHeight: 1.45,
                  background: m.role === "owner" ? TOKENS.navy800 : "#fff",
                  color: m.role === "owner" ? "#fff" : TOKENS.ink700,
                  border: m.role === "dls" ? `1px solid ${TOKENS.cream100}` : "none",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {chatBusy && (
            <div style={{ fontSize: 12.5, color: TOKENS.ink500, fontStyle: "italic" }}>{tr(lang, "thinking")}</div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div style={{ padding: 14, borderTop: `1px solid ${TOKENS.cream100}`, background: "#fff" }}>
          {completeness > 0 && (
            <div style={{ marginBottom: 10 }}>
              <button
                onClick={() => setStage("mirror")}
                style={{ fontSize: 12.5, color: TOKENS.navy700, background: "none", border: "none", textDecoration: "underline", cursor: "pointer", padding: 0 }}
              >
                {tr(lang, "mirror")} → ({completeness}%)
              </button>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={listening ? stopListening : startListening}
              style={{
                width: 44, height: 44, borderRadius: "50%", border: "none",
                background: listening ? TOKENS.bad : TOKENS.bronze500, color: "#fff",
                fontSize: 18, flexShrink: 0, cursor: "pointer",
              }}
              title={listening ? tr(lang, "speakNow") : tr(lang, "typeInstead")}
            >
              🎙
            </button>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder={listening ? tr(lang, "speakNow") : tr(lang, "describePh")}
              style={{
                flex: 1, padding: "0 14px", borderRadius: 22, border: `1px solid ${TOKENS.cream100}`,
                fontSize: 14.5, fontFamily: "inherit",
              }}
            />
            <button
              onClick={sendChat}
              disabled={chatBusy || !chatInput.trim()}
              style={{
                padding: "0 18px", borderRadius: 22, border: "none",
                background: TOKENS.navy950, color: "#fff", fontWeight: 600, cursor: "pointer",
                opacity: chatBusy || !chatInput.trim() ? 0.5 : 1,
              }}
            >
              {tr(lang, "send")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- MIRROR (dashboard) ----
  const Row = ({ fieldKey, label }) => {
    const d = data[fieldKey];
    const isEditing = editField === fieldKey;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${TOKENS.cream100}` }}>
        <div style={{ fontSize: 13.5, color: TOKENS.ink700 }}>{label}</div>
        {isEditing ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              style={{ width: 100, padding: "4px 8px", borderRadius: 5, border: `1px solid ${TOKENS.bronze300}`, fontSize: 13 }}
            />
            <button onClick={saveEdit} style={{ fontSize: 11, background: TOKENS.navy950, color: "#fff", border: "none", borderRadius: 4, padding: "5px 8px", cursor: "pointer" }}>{tr(lang, "save")}</button>
            <button onClick={() => setEditField(null)} style={{ fontSize: 11, background: "none", border: "none", color: TOKENS.ink500, cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }} onClick={() => openEdit(fieldKey)} role="button">
            <span style={{ fontSize: 14, ...mono, cursor: "pointer" }}>{d ? money(d.value) : tr(lang, "unknown")}</span>
            <ProvenanceBadge source={d ? d.source : "unknown"} />
          </div>
        )}
      </div>
    );
  };

  const SnapCard = ({ label, value, source }) => (
    <div style={{ background: "#fff", border: `1px solid ${TOKENS.cream100}`, borderRadius: 10, padding: "14px 16px", flex: "1 1 150px" }}>
      <div style={{ fontSize: 11.5, color: TOKENS.ink500, marginBottom: 6 }}>{label}</div>
      <div style={{ ...serif, fontSize: 21, fontWeight: 600, color: TOKENS.navy950 }}>{value === null ? tr(lang, "notEnoughInfo") : money(value)}</div>
      {value !== null && <div style={{ marginTop: 6 }}><ProvenanceBadge source={source} /></div>}
    </div>
  );

  return (
    <div style={{ ...wrap }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ padding: "18px 20px", background: TOKENS.navy950, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...mono, fontSize: 10, letterSpacing: "0.14em", color: TOKENS.bronze300 }}>DLSMEDIA</div>
          <div style={{ ...serif, fontSize: 22, marginTop: 2 }}>{tr(lang, "mirror")}</div>
          <div style={{ fontSize: 12.5, color: TOKENS.bronze100, marginTop: 4 }}>{profile.bizName} · {profile.city}</div>
        </div>
        <button
          onClick={() => setAdminMode((a) => !a)}
          style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", color: "#fff", border: `1px solid rgba(255,255,255,0.25)`, borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
        >
          {adminMode ? tr(lang, "ownerView") : tr(lang, "admin")}
        </button>
      </div>

      {/* completeness bar */}
      <div style={{ padding: "12px 20px", background: TOKENS.cream100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: TOKENS.ink500, marginBottom: 6 }}>
          <span>{completeness}% {tr(lang, "completeness")}</span>
        </div>
        <div style={{ height: 6, background: "#fff", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completeness}%`, background: TOKENS.bronze500, transition: "width .3s" }} />
        </div>
      </div>

      {adminMode ? (
        <div style={{ padding: 20 }}>
          <div style={{ ...serif, fontSize: 18, marginBottom: 12, color: TOKENS.navy950 }}>Admin — registered businesses</div>
          <div style={{ background: "#fff", border: `1px solid ${TOKENS.cream100}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 1fr", padding: "10px 14px", background: TOKENS.cream100, fontSize: 11.5, fontWeight: 600, color: TOKENS.ink500 }}>
              <div>Business</div><div>Type</div><div>Lang</div><div>Complete</div><div>Key issue</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 1fr", padding: "12px 14px", fontSize: 13, alignItems: "center", borderTop: `1px solid ${TOKENS.cream100}` }}>
              <div>{profile.bizName || "—"}</div>
              <div>{profile.bizType || "—"}</div>
              <div>{lang.toUpperCase()}</div>
              <div>{completeness}%</div>
              <div style={{ fontSize: 12 }}>{diagnosis?.observations?.[0]?.headline || "Run diagnosis"}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: TOKENS.ink500, marginTop: 14 }}>
            MVP stub — a real admin view would list all registered businesses across the org, filterable by health status and staff follow-up flags.
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: "18px 18px 6px" }}>
            <div style={{ ...serif, fontSize: 16, marginBottom: 10, color: TOKENS.navy950 }}>{tr(lang, "snapshot")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <SnapCard label={tr(lang, "revenue")} value={revenue} source="owner" />
              <SnapCard label={tr(lang, "grossProfit")} value={grossProfit} source="calculated" />
              <SnapCard label={tr(lang, "opProfit")} value={opProfit} source="calculated" />
              <SnapCard label={tr(lang, "netProfit")} value={netProfit} source="calculated" />
              <SnapCard label={tr(lang, "debt")} value={debtOutstanding} source="owner" />
            </div>
          </div>

          <div style={{ padding: "16px 18px" }}>
            <div style={{ ...serif, fontSize: 15, marginBottom: 4, color: TOKENS.navy950 }}>Your numbers</div>
            <div style={{ fontSize: 11.5, color: TOKENS.ink500, marginBottom: 8 }}>{tr(lang, "correct")} — tap any value.</div>
            <div style={{ background: "#fff", border: `1px solid ${TOKENS.cream100}`, borderRadius: 10, padding: "4px 14px" }}>
              {CORE_FIELDS.map((k) => <Row key={k} fieldKey={k} label={FIELD_LABELS[k]} />)}
            </div>
          </div>

          <div style={{ padding: "6px 18px 18px" }}>
            {!diagnosis && !diagBusy && (
              <button
                onClick={runDiagnosis}
                disabled={completeness < 30}
                style={{
                  width: "100%", padding: 14, borderRadius: 9, border: "none",
                  background: completeness < 30 ? TOKENS.bronze300 : TOKENS.navy950, color: "#fff",
                  fontWeight: 600, fontSize: 14.5, cursor: completeness < 30 ? "not-allowed" : "pointer",
                }}
              >
                {tr(lang, "whatDlsSees")} →
              </button>
            )}
            {diagBusy && <div style={{ textAlign: "center", padding: 20, color: TOKENS.ink500, fontSize: 13.5 }}>{tr(lang, "thinking")}</div>}

            {diagnosis && !diagnosis.error && (
              <div>
                <div style={{ ...serif, fontSize: 17, margin: "10px 0 10px", color: TOKENS.navy950 }}>{tr(lang, "whatDlsSees")}</div>
                {(diagnosis.observations || []).map((o, i) => (
                  <div key={i} style={{ background: "#fff", border: `1px solid ${TOKENS.cream100}`, borderLeft: `4px solid ${TOKENS.bronze500}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: TOKENS.navy950, marginBottom: 4 }}>{o.headline}</div>
                    <div style={{ fontSize: 13, color: TOKENS.ink700, lineHeight: 1.5 }}>{o.detail}</div>
                  </div>
                ))}

                {diagnosis.second_order && diagnosis.second_order.length > 0 && (
                  <>
                    <div style={{ ...serif, fontSize: 16, margin: "18px 0 10px", color: TOKENS.navy950 }}>Why it matters</div>
                    {diagnosis.second_order.map((s, i) => (
                      <div key={i} style={{ background: TOKENS.navy950, color: "#fff", borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 12.5, marginBottom: 8, color: TOKENS.bronze300 }}>
                          {s.chain.map((c, ci) => (
                            <React.Fragment key={ci}>
                              <span>{c}</span>
                              {ci < s.chain.length - 1 && <span>→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: TOKENS.cream100 }}>{s.explanation}</div>
                      </div>
                    ))}
                  </>
                )}

                <div style={{ ...serif, fontSize: 17, margin: "18px 0 10px", color: TOKENS.navy950 }}>{tr(lang, "decisionSupport")}</div>
                {(diagnosis.priorities || []).map((p, i) => (
                  <div key={i} style={{ background: "#fff", border: `1px solid ${TOKENS.cream100}`, borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ ...mono, fontSize: 10.5, color: TOKENS.bronze500, letterSpacing: "0.06em", marginBottom: 4 }}>{tr(lang, "priority")} {i + 1}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: TOKENS.navy950 }}>{p.title}</div>
                    <div style={{ fontSize: 12.5, color: TOKENS.ink700, marginBottom: 4 }}><b>{tr(lang, "problem")}:</b> {p.problem}</div>
                    <div style={{ fontSize: 12.5, color: TOKENS.ink700, marginBottom: 4 }}><b>{tr(lang, "why")}:</b> {p.why}</div>
                    <div style={{ fontSize: 12.5, color: TOKENS.ink700, marginBottom: 4 }}><b>{tr(lang, "action")}:</b> {p.action}</div>
                    <div style={{ fontSize: 12.5, color: TOKENS.ink700, marginBottom: 4 }}><b>{tr(lang, "effect")}:</b> {p.effect}</div>
                    {p.needed && <div style={{ fontSize: 12, color: TOKENS.ink500, fontStyle: "italic" }}>{tr(lang, "needed")}: {p.needed}</div>}
                  </div>
                ))}

                {diagnosis.health && (
                  <div style={{ background: TOKENS.bronze100, borderRadius: 10, padding: "16px 18px", marginTop: 14 }}>
                    <div style={{ ...mono, fontSize: 10.5, color: TOKENS.navy700, letterSpacing: "0.08em", marginBottom: 4 }}>{tr(lang, "healthScore")}</div>
                    <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: TOKENS.navy950 }}>
                      {diagnosis.health.score !== null && diagnosis.health.score !== undefined ? `${diagnosis.health.score} / 100` : tr(lang, "notEnoughInfo")}
                    </div>
                    {diagnosis.health.dimensions && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                        {Object.entries(diagnosis.health.dimensions).map(([k, v]) => (
                          <div key={k} style={{ fontSize: 11.5, color: TOKENS.navy700 }}>
                            {k.replace(/_/g, " ")}: <b>{v ?? "—"}</b>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 11.5, color: TOKENS.ink500, marginTop: 8, fontStyle: "italic" }}>
                      {diagnosis.health.note || tr(lang, "indicative")}
                    </div>
                  </div>
                )}
                {(() => {
                  const types = Array.from(new Set((diagnosis.observations || []).map((o) => o.type)));
                  const sols = Array.from(new Set(types.flatMap((t) => SOLUTIONS_MAP[t] || SOLUTIONS_MAP.other)));
                  if (sols.length === 0) return null;
                  return (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ ...serif, fontSize: 15, marginBottom: 8, color: TOKENS.navy950 }}>{tr(lang, "solutions")}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                        {sols.map((s, i) => (
                          <span key={i} style={{ fontSize: 12, padding: "6px 11px", borderRadius: 16, background: "#fff", border: `1px solid ${TOKENS.cream100}`, color: TOKENS.navy700 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: TOKENS.ink500, fontStyle: "italic" }}>{tr(lang, "solutionsNote")}</div>
                    </div>
                  );
                })()}

                <button
                  onClick={runDiagnosis}
                  style={{ marginTop: 14, background: "none", border: `1px solid ${TOKENS.navy700}`, color: TOKENS.navy700, borderRadius: 7, padding: "8px 14px", fontSize: 12.5, cursor: "pointer" }}
                >
                  Re-run diagnosis
                </button>
              </div>
            )}
            {diagnosis && diagnosis.error && (
              <div style={{ color: TOKENS.bad, fontSize: 13, padding: 12 }}>Couldn't generate the diagnosis just now — try again.</div>
            )}
          </div>

          {/* Journal */}
          <div style={{ padding: "0 18px 18px" }}>
            <div style={{ ...serif, fontSize: 15, marginBottom: 8, color: TOKENS.navy950 }}>{tr(lang, "journal")}</div>
            <JournalBox onAdd={addJournalEntry} placeholder={tr(lang, "journalPh")} addLabel={tr(lang, "addEntry")} />
            {journal.slice(0, 4).map((j, i) => (
              <div key={i} style={{ fontSize: 12.5, color: TOKENS.ink700, padding: "8px 0", borderBottom: `1px solid ${TOKENS.cream100}` }}>
                <span style={{ ...mono, fontSize: 10.5, color: TOKENS.ink500 }}>{new Date(j.date).toLocaleDateString()}</span> — {j.text}
              </div>
            ))}
          </div>

          {/* Monthly Business Review */}
          <div style={{ padding: "0 18px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ ...serif, fontSize: 15, color: TOKENS.navy950 }}>{tr(lang, "monthlyReview")}</div>
              <button
                onClick={saveSnapshot}
                style={{ fontSize: 11.5, background: TOKENS.navy950, color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
              >
                {tr(lang, "saveSnapshot")}
              </button>
            </div>
            {snapshots.length === 0 ? (
              <div style={{ fontSize: 12.5, color: TOKENS.ink500 }}>{tr(lang, "noSnapshots")}</div>
            ) : (
              <div style={{ background: "#fff", border: `1px solid ${TOKENS.cream100}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: TOKENS.ink500, marginBottom: 8 }}>
                  {new Date(snapshots[0].date).toLocaleDateString()} {snapshots[1] ? `${tr(lang, "vsLastSaved")} ${new Date(snapshots[1].date).toLocaleDateString()}` : ""}
                </div>
                {["revenue", "opProfit", "netProfit", "debtOutstanding"].map((k) => {
                  const cur = snapshots[0][k];
                  const prev = snapshots[1] ? snapshots[1][k] : null;
                  const delta = cur !== null && prev !== null && prev !== undefined ? cur - prev : null;
                  return (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${TOKENS.cream100}`, fontSize: 12.5 }}>
                      <span style={{ color: TOKENS.ink500 }}>{SNAPSHOT_LABELS[k] || k}</span>
                      <span>
                        <b style={mono}>{money(cur)}</b>
                        {delta !== null && (
                          <span style={{ marginLeft: 8, color: delta >= 0 ? TOKENS.good : TOKENS.bad, ...mono, fontSize: 11.5 }}>
                            {delta >= 0 ? "▲" : "▼"} {money(Math.abs(delta))}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Talk to DLS */}
          <div style={{ padding: "0 18px 14px" }}>
            <button
              onClick={() => setHelpSent(true)}
              disabled={helpSent}
              style={{
                width: "100%", padding: 13, borderRadius: 9, border: `1px solid ${TOKENS.navy700}`,
                background: helpSent ? TOKENS.cream100 : "#fff", color: TOKENS.navy700, fontWeight: 600, fontSize: 13.5, cursor: helpSent ? "default" : "pointer",
              }}
            >
              {helpSent ? tr(lang, "requestSent") : `${tr(lang, "talkToDls")} — ${tr(lang, "requestHelp")}`}
            </button>
          </div>

          {/* Privacy / data controls */}
          <div style={{ padding: "0 18px 30px" }}>
            <button
              onClick={() => setShowPrivacy((s) => !s)}
              style={{ background: "none", border: "none", color: TOKENS.ink500, fontSize: 11.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}
            >
              {tr(lang, "privacy")}
            </button>
            {showPrivacy && (
              <div style={{ marginTop: 10, background: TOKENS.cream100, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, color: TOKENS.ink700, marginBottom: 10 }}>{tr(lang, "privacyNote")}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={exportData} style={{ fontSize: 11.5, background: "#fff", border: `1px solid ${TOKENS.navy700}`, color: TOKENS.navy700, borderRadius: 6, padding: "7px 11px", cursor: "pointer" }}>
                    {tr(lang, "exportData")}
                  </button>
                  <button onClick={deleteAllData} style={{ fontSize: 11.5, background: "#fff", border: `1px solid ${TOKENS.bad}`, color: TOKENS.bad, borderRadius: 6, padding: "7px 11px", cursor: "pointer" }}>
                    {tr(lang, "deleteData")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function JournalBox({ onAdd, placeholder, addLabel }) {
  const [v, setV] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, padding: "9px 12px", borderRadius: 7, border: `1px solid ${TOKENS.cream100}`, fontSize: 13.5, fontFamily: "inherit" }}
      />
      <button
        onClick={() => { onAdd(v); setV(""); }}
        style={{ padding: "0 14px", borderRadius: 7, border: "none", background: TOKENS.bronze500, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
      >
        {addLabel}
      </button>
    </div>
  );
}
