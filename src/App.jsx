import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ───
const T = {
  bg: "#08090D", surface: "#111318", card: "#1A1D27", elevated: "#242836",
  border: "#2D3141", borderLight: "#383D52",
  accent: "#FF6B35", mint: "#00E599", purple: "#8B5CF6", coral: "#FF7EB3", amber: "#FBBF24",
  text: "#F5F3FF", textSec: "#9CA0B0", textMuted: "#5C6070",
  glow: "rgba(255,107,53,0.15)", mintGlow: "rgba(0,229,153,0.12)",
};
const DOMAIN_COLORS = { streaming: T.amber, pm: T.purple, pharma: T.coral, ads: "#F97316", product: T.accent };
const DOMAIN_LABELS = { streaming: "Streaming", pm: "Product Mgmt", pharma: "Pharma", ads: "Ad Revenue", product: "Product" };

const SHREYA_CONTEXT = `You are Shreya Patel's portfolio AI assistant. Answer questions conversationally and confidently — as her professional representative. Keep answers concise (2-4 sentences) unless detail is requested.

CRITICAL RULES:
- 13 agents are SHIPPED and live. The other 3 are PLANNED but NOT yet built.
- NEVER describe a planned agent as if it is complete or shipped.
- If asked "what has she shipped," ONLY mention the 9 shipped agents below.

CURRENT ROLE: Senior Product Manager at Eli Lilly (Cancer Clinical Platform). Building StreamMind — a 22-week project to ship 16 AI agents. Currently Week 7 of 22.

STREAMMIND: 16 agents total — 8 streaming, 1 ad-revenue (flagship), 5 PM, 1 pharma, 1 product (GhostCheck). 4 are FLAGSHIP-grade with full evals, architecture docs, guardrails, and cost analysis. Stack: Claude API, Make, Airtable, Notion, Supabase, CrewAI, Streamlit, Vercel, GitHub Actions, Next.js.

4 FLAGSHIPS (deep architecture + evals + guardrails):
1. GhostCheck — Ghost job detection SaaS. Next.js + Supabase + Claude classification. Full F1 eval, adversarial benchmark, GUARDRAILS.md. SHIPPED.
2. Clinical Trial Analyzer (Pharma) — RAG over trial PDFs. Guardrails for regulated domain.
3. Ad Incrementality Brief (Streaming #19) — Deterministic lift math + LLM narration. "When NOT to use an agent" example.
4. PM Copilot (PM #5) — CrewAI multi-agent (Researcher/Writer/Reviewer) + Supabase memory + Slack Bolt. SHIPPED. 3.69/5.0 rubric benchmark.

3 SHIPPED AGENTS:
1. Grooming Bot (PM #1) — JIRA story grooming. LLM: Claude Sonnet, Framework: Make, No RAG. Shipped Week 3.
2. Research Synthesizer (PM #2) — Research to product insights. LLM: Claude Sonnet, Framework: Make+Streamlit, No RAG. Shipped Week 6.
3. Monday Weekly Digest (Streaming #13) — Weekly email digest. LLM: Claude Sonnet, Framework: Make, No RAG. Shipped Week 6.
4. Content Tagging (Streaming #1) — Auto-tags catalog titles with genre/mood/audience metadata. LLM: Claude Sonnet, Framework: Make. Shipped Week 8.
5. Copy Generator (Streaming #2) — Generates 6 marketing copy variants from content briefs. LLM: Claude Sonnet, Framework: Make. Shipped Week 9.
6. Subtitle QA (Streaming #3) — SRT file quality validation. LLM: Claude Haiku, Framework: Make. Shipped Week 11.
7. A/B Test Analyzer (Streaming #8) — Experiment analysis memos from Sheets data. LLM: Claude Sonnet, Framework: Make. Shipped Week 8.
8. Licensing Monitor (Streaming #9) — Contract renewal briefs on Monday schedule. LLM: Claude Sonnet, Framework: Make. Shipped Week 10.
9. PRD Studio (PM #3) — Multi-mode PRD generator: brief → outline → full doc. LLM: Claude Sonnet, Framework: Make. Shipped Week 12.
10. GhostCheck (Product, FLAGSHIP) — Ghost job detection SaaS. LLM: Claude Sonnet, Framework: Next.js+Supabase. F1 eval + adversarial benchmark. Shipped Week 13.
11. Win-Back Campaign (Streaming #5) — Re-engagement sequences for churned users. LLM: Claude Sonnet, Framework: Make. Shipped Week 14.
12. Competitive Intel Hub (PM #4) — Weekly competitive landscape digest. LLM: Claude Sonnet, Framework: GitHub Actions, RAG. Shipped Week 15.
13. PM Copilot (PM #5, FLAGSHIP) — CrewAI multi-agent: Researcher → Analyst → Writer. 3.69/5.0 rubric benchmark. Structural HITL checkpoint. Shipped Week 16.

3 PLANNED (NOT yet built): Ad Incrementality Brief (flagship), Clinical Trial Analyzer (flagship), Stakeholder Updates. Target all 16 by September 2026.

WORK: Eli Lilly PM Jan 2026–Present (clinical trials platform, 30K+ users, built Pathways Studio + AI toolkit), T-Mobile PM Mar 2024–Feb 2025 (SaaS platform, 10K+ drivers, API architecture), CVS Aetna Healthcare PM Mar 2023–Mar 2024 (100% clinical data migration, workflow automation), Salesforce PM Feb 2021–Mar 2023 (60K+ users, 40% adoption↑, V2MOM + Insiders), MUFG PO Mar 2017–Jan 2021 (100% adoption, retired 20-yr CRM, 80% usability↑).

ELI LILLY DEEP DIVE (Jan 2026–Present):
- Lilly Pathways Studio: AI-powered training platform that turns system user documentation into role-based, Trailhead-style learning programs with SME review. Piloted on Lilly Nexus (clinical trial platform, 34+ applications). Designed for reuse across ATOM5, IWRS, and other Lilly systems.
- Nexus Platform AI Agents: Proposed 4 agents for the Lilly Nexus clinical trial platform — Onboarding Orchestration Agent, FPV Milestone Watcher, Q&A Support Deflection Agent, Access Review Summarizer. GxP-regulated environment.
- AI/ML BA Methodologies: Built AI tools to standardize BA skills across teams. Weekly mentoring in AI/ML methodologies. Championed responsible data practices.

SALESFORCE DEEP DIVE (Feb 2021–Mar 2023):
- V2MOM Application: 70K+ employees, AppExchange, 95% alignment, 10+ mgmt layers, 6+ features
- Insiders Program: 300+ volunteers, 19 countries, 97% offer acceptance, 2,483 sessions
- Camp B-Well: 5 wellness dimensions, 5+ Trailhead modules
- Impact: 40% adoption↑, 60K users, 6 certs, 13 Superbadges

EDUCATION: Northwestern Kellogg PM 2022, MS MIS Cal State Fullerton 2017, BS IT Mumbai 2013.
CERTS: 6 Salesforce+13 Superbadges, Oracle SQL/PLSQL, CSPO, CSM, SAFe.
CONTACT: shreyaishwarlalpatel@gmail.com, 415-604-6080, linkedin.com/in/shreeapatel, github.com/shreya-patel-PM

If unsure, say so and suggest emailing her directly.`;

const AGENTS = [
  // ── Streaming (8) ──
  {id:1,name:"Content Tagging",domain:"streaming",desc:"Auto-tags catalog titles with genre, mood, and audience metadata via structured JSON",stack:"Airtable catalog → Make → Claude tags as JSON → Airtable writeback",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Tag accuracy vs human baseline",framework:"Make"},
  {id:2,name:"Copy Generator",domain:"streaming",desc:"Generates 6 marketing copy variants from a content brief",stack:"Notion brief → Make → Claude 6 variants JSON → Notion + Slack #copy-review",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Variant quality + tone consistency",framework:"Make"},
  {id:3,name:"Subtitle QA",domain:"streaming",desc:"Watches for new SRT files and validates quality automatically",stack:"Google Drive SRT watcher → Make → Claude QA → Airtable error log + Slack",shipped:true,llm:"Claude Haiku",rag:false,evals:"Error detection accuracy",framework:"Make"},
  {id:5,name:"Win-Back Campaign",domain:"streaming",desc:"Generates personalized re-engagement sequences for churned users",stack:"Airtable cancellation log → Make → Claude → Mailchimp journey",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Open rate + reactivation tracking",framework:"Make"},
  {id:6,name:"Content Gap Analyzer",domain:"streaming",desc:"Identifies missing content categories by analyzing search queries",stack:"Query data → Make → Claude gap report → Notion",shipped:true,llm:"Claude Sonnet",rag:true,evals:"Gap relevance scoring",framework:"Make"},
  {id:7,name:"A/B Test Analyzer",domain:"streaming",desc:"Reads experiment results from Sheets and generates analysis memos",stack:"Sheets trigger → Make → Claude analysis JSON → Notion memo + Slack",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Statistical conclusion accuracy",framework:"Make"},
  {id:8,name:"Licensing Monitor",domain:"streaming",desc:"Monitors content contracts and generates renewal briefs",stack:"Airtable contracts → Make Monday scheduler → Claude renewal brief → Gmail + Slack",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Date accuracy + brief completeness",framework:"Make"},
  {id:9,name:"Monday Weekly Digest",domain:"streaming",desc:"Automated weekly content digest delivered every Monday via email",stack:"Make Monday 7am → Google Sheets data → Claude 300-word digest → Gmail",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Content accuracy + formatting",framework:"Make"},
  // ── Ad Revenue (1 — Flagship only) ──
  {id:12,name:"Ad Incrementality Brief",domain:"ads",desc:"Generates incrementality lift reports — deterministic stats calc with LLM narration",stack:"Experiment data → Python lift math → Claude narrative → Notion report",shipped:false,llm:"Claude Sonnet",rag:false,evals:"Lift accuracy + narrative quality",framework:"Make + Python",flagship:true,
    details:{
      quadrant:"Exact output · multi-component",
      pattern:"Deterministic stats in code + LLM narrative, number-grounding gate",
      failure:"Drifted number or overclaimed win in a sales brief",
      evalMethod:"Unit tests (exact) + number-match parse + significance-honesty scenarios",
      headline:"Number-match pass rate target: 100%",
      guardrail:"Reject-over-repair: mismatched brief is killed, not fixed",
      whenNot:"When not to use an LLM — math is code, language is the model",
      stakes:"Customer-facing sales; one wrong number kills trust",
      oneLiner:"The LLM never touches a number. Math is code; the model only narrates."
    }},
  // ── PM (5) ──
  {id:15,name:"Grooming Bot",domain:"pm",desc:"Automates JIRA story grooming with acceptance criteria, edge cases & sizing",stack:"JIRA webhook → Make → Claude structured generation → JIRA update",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Output quality + edge case coverage",framework:"Make"},
  {id:16,name:"Research Synthesizer",domain:"pm",desc:"Structures research transcripts into product insights and recommendations",stack:"Google Drive transcripts → Make → Claude synthesis → Streamlit dashboard",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Insight relevance + completeness",framework:"Make + Streamlit"},
  {id:17,name:"PRD Studio",domain:"pm",desc:"Multi-mode PRD generator: brief → outline → full doc with edge cases and metrics",stack:"Notion brief → Make → Claude multi-pass → Notion PRD + Slack",shipped:true,llm:"Claude Sonnet",rag:false,evals:"Completeness + section quality scoring",framework:"Make"},
  {id:18,name:"Competitive Intel Hub",domain:"pm",desc:"Weekly competitive landscape digest with strategic implications",stack:"GitHub Actions Monday cron → Claude web_search → Resend digest",shipped:true,llm:"Claude Sonnet",rag:true,evals:"Source coverage + insight quality",framework:"GitHub Actions"},
  {id:19,name:"PM Copilot",domain:"pm",desc:"Multi-agent orchestration for end-to-end PM decision support",stack:"CrewAI (Researcher/Writer/Reviewer) + Notion + Slack Bolt + Supabase memory",shipped:true,llm:"Claude Sonnet",rag:true,evals:"Decision quality + agent coordination",framework:"CrewAI + Supabase",flagship:true,
    details:{
      quadrant:"Generative output · multi-component",
      pattern:"Sequential CrewAI crew: Researcher → Analyst → Writer → human review",
      failure:"Invented scope, untestable acceptance criteria",
      evalMethod:"LLM-as-judge rubric (clarity, testability, scope, completeness, grounding) + human cross-check",
      headline:"3.69 / 5.0 rubric benchmark — scope fidelity 2.66 documented as honest gap",
      guardrail:"Structural HITL checkpoint — agent proposes, PM decides",
      whenNot:"When not to use a crew — ablation-proven: single call wins on speed; crew wins on adversarial asks",
      stakes:"Internal tooling; rework cost",
      oneLiner:"Gather, scope, and write are three different jobs with different failure modes — so it's a crew, not a prompt."
    }},
  // ── Pharma (1) ──
  {id:20,name:"Clinical Trial Analyzer",domain:"pharma",desc:"Surfaces eligibility criteria & endpoint data from trial protocol PDFs",stack:"Google Drive PDFs → Make → Claude doc API with citations → Notion + Airtable log",shipped:false,llm:"Claude Sonnet",rag:true,evals:"Extraction accuracy + completeness",framework:"Claude Doc API",flagship:true,
    details:{
      quadrant:"Generative output · single model",
      pattern:"Whole-PDF-in-context (document API) + prompt caching, citation-gated",
      failure:"Fabricated citation feeds a regulated decision",
      evalMethod:"Faithfulness, citation correctness, refusal accuracy on golden Q&A set",
      headline:"Hallucination rate target: zero fabricated citations",
      guardrail:"Programmatic citation validation + medical-advice refusal",
      whenNot:"When not to RAG — long-context wins for small corpora",
      stakes:"Regulated pharma; PHI redaction; audit trail",
      oneLiner:"Every claim is cited, and a programmatic check confirms the cited text exists in the source."
    }},
  // ── Product (1) ──
  {id:21,name:"GhostCheck",domain:"product",desc:"Ghost job detection SaaS — classifies listings as real vs ghost with F1-scored evals",stack:"Next.js + Supabase + Claude classification → adversarial benchmark (75 examples)",shipped:true,llm:"Claude Sonnet",rag:false,evals:"F1 score at threshold 0.60 + adversarial benchmark",framework:"Next.js + Supabase",flagship:true,
    details:{
      quadrant:"Exact output · single model",
      pattern:"Calibrated classifier with explainable signal breakdown",
      failure:"False positive hides a real opportunity",
      evalMethod:"Precision / recall / F1 on 75-case adversarial benchmark; PR-curve threshold walk",
      headline:"F1 0.93 @ 0.60 threshold",
      guardrail:"Locked operating point + amber caution band (30–59%)",
      whenNot:"When not to trust one opaque score — expose the signals",
      stakes:"Consumer trust; real SaaS revenue ($29/mo)",
      oneLiner:"I walked the PR curve on an adversarial benchmark and locked the threshold where false positives stop being acceptable."
    }},
];

const EXPERIENCE = [
  {co:"Eli Lilly",role:"Product Manager",dates:"Jan 2026 – Present",loc:"Remote",what:"Clinical Trials Platform · 30,000+ Users",highlight:"AI-powered training platform + agent toolkit",bullets:["Leading product strategy for clinical trial platform serving 30,000+ internal users, external sites, and patient populations globally","Partnered with data science on AI/ML model evaluation for clinical workflows; translated model outputs into actionable product decisions","Built AI-powered enterprise training platform (Lilly Pathways Studio) turning system docs into Trailhead-style learning programs, piloted on Lilly Nexus","Built toolkit of 10 Claude agent skills + 6 MCP plugins cutting drafting time by 60%, adopted by 60 teammates across 4 product teams","Automated delivery hygiene saving 10 hrs/sprint across 20 sprints — rough notes to groomed stories, epic audits, sprint reviews from live Jira"]},
  {co:"T-Mobile",role:"Product Manager",dates:"Mar 2024 – Feb 2025",loc:"Remote",what:"SaaS Platform · 10K+ Drivers",highlight:"API architecture & A/B testing",bullets:["Owned product strategy and technical requirements for large-scale SaaS platform serving 10K+ drivers","Drove API integration architecture and authentication design from concept to deployment","Optimized platform performance using data telemetry and A/B testing; built measurement dashboard to track release impact","Led cross-functional teams through sprint planning, backlog prioritization, and release coordination"]},
  {co:"CVS Aetna",role:"Healthcare Product Manager",dates:"Mar 2023 – Mar 2024",loc:"Remote",what:"Service & Clinical Products",highlight:"100% migration success rate",bullets:["Owned multi-phase migration of enterprise clinical datasets from on-prem to Salesforce Data Cloud — 100% success, retired legacy systems","Partnered with data science and engineering on data validation and QA; improved reporting reliability for clinical teams","Delivered workflow automation across service and clinical products; translated API dependencies into clear product decisions","Accelerated internal adoption by structuring specifications that reduced ambiguity and rework"]},
  {co:"Salesforce",role:"Product Manager",dates:"Feb 2021 – Mar 2023",loc:"San Francisco, CA",what:"Employee Success · 60K+ Users",highlight:"40% adoption increase",bullets:["Shipped three major products to 60K+ users; drove 40% adoption increase through data-led feature prioritization","V2MOM: Redesigned and shipped v2 to AppExchange — 70K+ employees, 95% alignment awareness, 6+ features (goal cascading, KPI splitting)","Insiders Program: Launched candidate-employee matching to 300+ volunteers across 19 countries — 97% offer acceptance among 2,483 candidates","Built measurement frameworks connecting product participation to retention and satisfaction KPIs"]},
  {co:"MUFG Union Bank",role:"Product Owner",dates:"Mar 2017 – Jan 2021",loc:"San Diego, CA",what:"Salesforce Sales Cloud",highlight:"100% adoption · retired 20-yr CRM",bullets:["Led Salesforce Sales Cloud rollout for Regional and Wealth Banking — 40% adoption increase Y1, 100% among Commercial Bank","Retired 20-year-old legacy CRM by designing customer journey maps and translating workflows to Salesforce — 80% usability increase","Owned all product requirements, user stories, and acceptance criteria; presented prototypes and demos to C-suite and engineering"]},
];

const STACK = ["Claude API","Make","CrewAI","Airtable","Supabase","Notion","Streamlit","Vercel","GitHub Actions","Slack API","Reddit API","Mailchimp","Google Sheets"];
const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

// ─── COMPONENTS ───

function Hero() {
  const shipped = AGENTS.filter(a => a.shipped).length;
  const stats = [
    { n:"16", label:"AI Agents", color:T.accent },
    { n:`${shipped}`, label:"Shipped", color:T.mint },
    { n:"4", label:"Flagships", color:T.coral },
    { n:"10+", label:"Years PM", color:T.amber },
  ];
  const jumps = [
    { label:"Experience", target:"career" },
    { label:"Deep Dive", target:"deepdive" },
    { label:"AI Agents", target:"agents" },
    { label:"Skills", target:"skills" },
  ];
  return (
    <section style={{ padding:"56px 24px 44px", position:"relative", overflow:"hidden", borderBottom:`1px solid ${T.border}` }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,107,53,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"relative", maxWidth:1080, margin:"0 auto", textAlign:"center" }}>
        {/* Photo */}
        <div style={{ width:100, height:100, borderRadius:"50%", border:`2px solid ${T.borderLight}`, background:T.surface, display:"inline-flex", alignItems:"center", justifyContent:"center", overflow:"hidden", marginBottom:20 }}>
          <img src="data:image/jpeg;base64,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" alt="Shreya Patel" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>

        {/* Name */}
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(44px,8vw,72px)", fontWeight:700, color:T.text, letterSpacing:"-0.04em", lineHeight:1, margin:"0 0 10px" }}>Shreya Patel</h1>

        {/* Tagline */}
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(18px,2.5vw,24px)", color:T.textSec, margin:"0 0 16px", fontWeight:400 }}>
          Product Manager who <span style={{ color:T.accent, fontWeight:700 }}>actually builds things</span>
        </p>

        {/* Contact */}
        <div style={{ display:"flex", justifyContent:"center", gap:14, flexWrap:"wrap", fontSize:14, fontFamily:"'Inter',sans-serif", color:T.textMuted, marginBottom:28 }}>
          <a href="mailto:shreyaishwarlalpatel@gmail.com" style={{ color:T.accent, textDecoration:"none" }}>shreyaishwarlalpatel@gmail.com</a>
          <span>·</span><span>415-604-6080</span><span>·</span>
          <a href="https://www.linkedin.com/in/shreeapatel/" style={{ color:T.accent, textDecoration:"none" }}>LinkedIn</a>
          <span>·</span>
          <a href="https://github.com/shreya-patel-PM" style={{ color:T.accent, textDecoration:"none" }}>GitHub</a>
        </div>

        {/* About */}
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:16, color:T.textSec, lineHeight:1.7, margin:"0 auto 32px", maxWidth:720 }}>
          Technical Product Manager with 10+ years driving product strategy across enterprise SaaS, healthcare, and streaming platforms. Currently building StreamMind — 16 AI agents shipped with production evals, guardrails, and architecture docs. I don't just write specs for AI features — I build and ship them.
        </p>

        {/* Stats */}
        <div style={{ display:"flex", justifyContent:"center", gap:40, flexWrap:"wrap", marginBottom:28 }}>
          {stats.map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:700, color:s.color, lineHeight:1 }}>{s.n}</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:T.textMuted, marginTop:4, textTransform:"uppercase", letterSpacing:"0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Jump links */}
        <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
          {jumps.map(l => (
            <button key={l.target} onClick={() => jumpTo(l.target)}
              style={{ padding:"8px 20px", fontSize:14, fontWeight:600, color:T.text, background:T.surface, border:`1px solid ${T.border}`, borderRadius:100, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.color=T.accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.text }}>
              {l.label} ↓
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StreamMindSection() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [modalAgent, setModalAgent] = useState(null);
  const shipped = AGENTS.filter(a => a.shipped).length;
  const filtered = filter === "all" ? AGENTS : filter === "flagship" ? AGENTS.filter(a => a.flagship) : AGENTS.filter(a => a.domain === filter);
  const total = AGENTS.length;
  const pct = Math.round((shipped / total) * 100);

  const Tag = ({ label, value, color }) => (
    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.04em", minWidth:55 }}>{label}</span>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:color||T.textSec, padding:"2px 8px", background:`${(color||T.textSec)}12`, border:`1px solid ${(color||T.textSec)}25`, borderRadius:4 }}>{value}</span>
    </div>
  );

  return (
    <section style={{ padding:"48px 24px", maxWidth:1080, margin:"0 auto" }} id="agents">
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:T.accent, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:6 }}>Personal AI Project — StreamMind</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:700, color:T.text, letterSpacing:"-0.03em", margin:"0 0 8px" }}>16 AI Agents · 4 Flagships</h2>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:T.textSec, maxWidth:500, margin:"0 auto 18px" }}>
          trigger → data ingestion → LLM reasoning → structured output → action
        </p>
        <div style={{ maxWidth:340, margin:"0 auto 18px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontFamily:"'Inter',sans-serif", color:T.textMuted, marginBottom:5 }}>
            <span><span style={{ color:T.mint, fontWeight:600 }}>{shipped}</span> shipped</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height:5, borderRadius:3, background:T.border }}>
            <div style={{ height:5, borderRadius:3, width:`${pct}%`, background:`linear-gradient(90deg, ${T.mint}, ${T.accent})` }} />
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
          {[
            { id:"all", label:`All ${total}` },
            { id:"streaming", label:`Streaming (${AGENTS.filter(a=>a.domain==="streaming").length})` },
            { id:"pm", label:`Product Mgmt (${AGENTS.filter(a=>a.domain==="pm").length})` },
            { id:"flagship", label:`Flagship (${AGENTS.filter(a=>a.flagship).length})` },
          ].map(f => (
            <button key={f.id} onClick={() => { setFilter(f.id); setOpen(null); }}
              style={{ padding:"6px 14px", fontSize:12, fontWeight:filter===f.id?600:400, color:filter===f.id?T.text:T.textSec, background:filter===f.id?T.elevated:T.surface, border:`1px solid ${filter===f.id?T.borderLight:T.border}`, borderRadius:100, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(285px, 1fr))", gap:10 }}>
        {filtered.map(agent => {
          const dc = DOMAIN_COLORS[agent.domain];
          const isOpen = open === agent.id;
          const isShipped = agent.shipped;
          return (
            <div key={agent.id} onClick={() => setOpen(isOpen ? null : agent.id)}
              style={{
                padding:"16px 18px", borderRadius:12, cursor:"pointer", transition:"all 0.2s",
                background: isOpen ? T.elevated : T.card,
                border: `1px solid ${isShipped ? T.mint+"50" : agent.flagship ? T.coral+"40" : isOpen ? T.borderLight : T.border}`,
                boxShadow: isShipped ? `0 0 16px ${T.mintGlow}` : agent.flagship ? `0 0 12px rgba(244,160,179,0.08)` : "none",
                position:"relative", display:"flex", flexDirection:"column",
              }}>
              {isShipped && <div style={{ position:"absolute", top:-1, right: agent.flagship ? 80 : 14, padding:"2px 8px", fontSize:10, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", color:T.bg, background:T.mint, borderRadius:"0 0 5px 5px", letterSpacing:"0.06em", textTransform:"uppercase" }}>Shipped</div>}
              {agent.flagship && <div style={{ position:"absolute", top:-1, right:14, padding:"2px 8px", fontSize:10, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", color:T.bg, background:T.coral, borderRadius:"0 0 5px 5px", letterSpacing:"0.06em", textTransform:"uppercase" }}>Flagship</div>}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:dc, fontWeight:500 }}>{DOMAIN_LABELS[agent.domain]}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textMuted }}>#{String(agent.id).padStart(2,"0")}</span>
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600, color:T.text, marginBottom:5 }}>{agent.name}</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:T.textSec, lineHeight:1.5, marginBottom:10, flex:1 }}>{agent.desc}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px 10px", paddingTop:10, borderTop:`1px solid ${T.border}` }}>
                <Tag label="LLM" value={agent.llm} color={T.accent} />
                <Tag label="RAG" value={agent.rag?"Yes":"No"} color={agent.rag?T.mint:T.textMuted} />
                <Tag label="Frmwk" value={agent.framework} color={T.purple} />
                <Tag label="Evals" value="✓" color={T.amber} />
              </div>
              {isOpen && (
                <div style={{ marginTop:10 }}>
                  <div style={{ marginBottom:8, padding:"8px 12px", background:T.surface, borderRadius:6, border:`1px solid ${T.border}` }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.amber, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Eval Strategy</div>
                    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:T.textSec, lineHeight:1.5 }}>{agent.evals}</div>
                  </div>
                  <div style={{ padding:"8px 12px", background:T.surface, borderRadius:6, border:`1px solid ${T.border}` }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.accent, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Architecture</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.accent, lineHeight:1.6 }}>{agent.stack}</div>
                  </div>
                  {agent.flagship && agent.details && (
                    <button onClick={(e) => { e.stopPropagation(); setModalAgent(agent); }}
                      style={{ marginTop:8, width:"100%", padding:"10px", fontSize:12, fontWeight:600, fontFamily:"'Inter',sans-serif", color:T.coral, background:`${T.coral}10`, border:`1px solid ${T.coral}30`, borderRadius:6, cursor:"pointer", transition:"all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background=`${T.coral}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.background=`${T.coral}10`; }}>
                      View Flagship Deep Dive →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:20, padding:"18px", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, textAlign:"center" }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:T.text, marginBottom:10 }}>Product Stack</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
          {STACK.map(t => <span key={t} style={{ padding:"4px 12px", fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:T.textSec, background:T.surface, border:`1px solid ${T.border}`, borderRadius:100 }}>{t}</span>)}
        </div>
      </div>

      {/* Flagship Deep Dive Modal */}
      {modalAgent && modalAgent.details && (
        <div onClick={() => setModalAgent(null)}
          style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width:"min(640px, 100%)", maxHeight:"85vh", overflowY:"auto", background:T.card, border:`1px solid ${T.borderLight}`, borderRadius:16, boxShadow:`0 12px 60px rgba(0,0,0,0.5), 0 0 40px ${T.glow}` }}>
            <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:T.text }}>{modalAgent.name}</span>
                  <span style={{ padding:"2px 8px", fontSize:10, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", color:T.bg, background:T.coral, borderRadius:4, textTransform:"uppercase" }}>Flagship</span>
                  {modalAgent.shipped && <span style={{ padding:"2px 8px", fontSize:10, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", color:T.bg, background:T.mint, borderRadius:4, textTransform:"uppercase" }}>Shipped</span>}
                </div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec }}>{modalAgent.desc}</div>
              </div>
              <button onClick={() => setModalAgent(null)} style={{ background:"none", border:"none", color:T.textMuted, fontSize:20, cursor:"pointer", padding:"0 4px", flexShrink:0 }}>✕</button>
            </div>
            <div style={{ padding:"20px 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div style={{ padding:"14px 16px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.coral, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Competency Quadrant</div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:600, color:T.text }}>{modalAgent.details.quadrant}</div>
                </div>
                <div style={{ padding:"14px 16px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.coral, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Stakes Profile</div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:600, color:T.text }}>{modalAgent.details.stakes}</div>
                </div>
              </div>
              <div style={{ padding:"16px 20px", background:`${T.mint}08`, border:`1px solid ${T.mint}20`, borderRadius:10, marginBottom:16, textAlign:"center" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.mint, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Headline Metric</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:T.mint }}>{modalAgent.details.headline}</div>
              </div>
              <div style={{ display:"grid", gap:12, marginBottom:16 }}>
                {[
                  { label:"Core Pattern", value:modalAgent.details.pattern, color:T.purple },
                  { label:"Failure Mode Defended", value:modalAgent.details.failure, color:T.accent },
                  { label:"Eval Methodology", value:modalAgent.details.evalMethod, color:T.amber },
                  { label:"Signature Guardrail", value:modalAgent.details.guardrail, color:T.mint },
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:3, flexShrink:0, alignSelf:"stretch", borderRadius:2, background:item.color, marginTop:2 }} />
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:item.color, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{item.label}</div>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, lineHeight:1.6 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"14px 16px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, marginBottom:12 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>"When Not To" Decision</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, lineHeight:1.6, fontStyle:"italic" }}>{modalAgent.details.whenNot}</div>
              </div>
              <div style={{ padding:"16px 20px", background:`${T.accent}08`, border:`1px solid ${T.accent}25`, borderRadius:10, marginBottom:12 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.accent, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Interview One-Liner</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:T.text, lineHeight:1.6, fontStyle:"italic" }}>"{modalAgent.details.oneLiner}"</div>
              </div>
              <div style={{ padding:"12px 16px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.accent, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Architecture</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:T.accent, lineHeight:1.6 }}>{modalAgent.stack}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CareerSection() {
  const [expanded, setExpanded] = useState(null);
  return (
    <section style={{ padding:"48px 24px", maxWidth:1080, margin:"0 auto" }} id="career">
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:T.purple, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:6 }}>Career</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:700, color:T.text, letterSpacing:"-0.03em", margin:0 }}>10+ Years Building Products</h2>
      </div>
      <div style={{ display:"grid", gap:6 }}>
        {EXPERIENCE.map((e,i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} onClick={() => setExpanded(isOpen ? null : i)}
              style={{ padding:"14px 20px", background:T.card, border:`1px solid ${isOpen?T.borderLight:T.border}`, borderRadius:10, cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:6 }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600, color:T.text }}>{e.co}</span>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec }}>{e.role}</span>
                  </div>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:T.textMuted }}>{e.what}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <span style={{ padding:"3px 10px", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:600, color:T.mint, background:T.mintGlow, border:`1px solid ${T.mint}30`, borderRadius:100 }}>{e.highlight}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textMuted }}>{e.dates}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${T.border}` }}>
                  {e.bullets.map((b,j) => (
                    <div key={j} style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, lineHeight:1.6, padding:"2px 0 2px 14px", position:"relative" }}>
                      <span style={{ position:"absolute", left:0, top:9, width:5, height:5, borderRadius:"50%", background:`${T.accent}60` }} />{b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:10, marginTop:16 }}>
        <div style={{ padding:"18px 20px", background:T.card, border:`1px solid ${T.border}`, borderRadius:10 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:T.accent, marginBottom:8 }}>Education</div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, lineHeight:1.9 }}>
            <strong style={{ color:T.text }}>Northwestern Kellogg</strong> — PM Certificate, 2022<br/>
            <strong style={{ color:T.text }}>Cal State Fullerton</strong> — MS, MIS, 2017<br/>
            <strong style={{ color:T.text }}>Mumbai University</strong> — BS, IT, 2013
          </div>
        </div>
        <div style={{ padding:"18px 20px", background:T.card, border:`1px solid ${T.border}`, borderRadius:10 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:T.accent, marginBottom:8 }}>Certifications</div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, lineHeight:1.9 }}>
            <strong style={{ color:T.text }}>Salesforce</strong> — 6 certs + 13 Superbadges<br/>
            <strong style={{ color:T.text }}>Oracle</strong> — SQL & PL/SQL Associate<br/>
            <strong style={{ color:T.text }}>Agile</strong> — CSPO · CSM · SAFe
          </div>
        </div>
      </div>
    </section>
  );
}

function DeepDiveSection() {
  const sfBlue = "#00A1E0";
  const lillyRed = "#D52B1E";
  const [activeTab, setActiveTab] = useState("lilly");

  const sfInitiatives = [
    { title:"V2MOM Application", tagline:"Enterprise Goal-Alignment Platform",
      desc:"Led the V2MOM redesign (V2), Salesforce's enterprise goal-alignment platform used by 70,000+ employees. Defined roadmap for 6+ features including goal cascading, KPI splitting, and team views. Shipped to AppExchange as open-source Salesforce Labs solution.",
      metrics:[{n:"70K+",l:"Employees"},{n:"95%",l:"Alignment"},{n:"10+",l:"Mgmt layers"},{n:"6+",l:"Features"}],
      links:[{label:"AppExchange",url:"https://appexchange.salesforce.com/appxListingDetail?listingId=a0N4V00000GHbotUAD"},{label:"GitHub",url:"https://github.com/SalesforceLabs/MyV2MOM"}] },
    { title:"Insiders Program", tagline:"Candidate-Employee Matching Platform",
      desc:"Launched and scaled the Salesforce Insiders Program, a candidate-employee matching platform embedded in the global interview process. Grew to 300+ volunteers across 19 countries.",
      metrics:[{n:"97%",l:"Offer acceptance"},{n:"2,483",l:"Sessions"},{n:"300+",l:"Volunteers"},{n:"19",l:"Countries"}],
      links:[{label:"Blog",url:"https://www.salesforce.com/blog/insiders-program-salesforce-interview-process/"}] },
    { title:"Camp B-Well", tagline:"Employee Wellness Program",
      desc:"Designed Salesforce's employee wellness program across 5 dimensions: physical, mental, nutrition, workspace, and flexibility. Produced 5+ Trailhead modules with measurement framework.",
      metrics:[{n:"5",l:"Dimensions"},{n:"5+",l:"Trailhead modules"}],
      links:[{label:"Blog",url:"https://www.salesforce.com/blog/small-business/small-business-wellness-program/"},{label:"Trailhead",url:"https://trailhead.salesforce.com/content/learn/trails/camp-pono"}] },
  ];
  const lillyInitiatives = [
    { title:"Lilly Pathways Studio", tagline:"AI-Powered Enterprise Training Platform",
      desc:"Built an AI-powered training platform that transforms system user documentation into role-based, Trailhead-style learning programs with SME review gates. Piloted on Lilly Nexus (clinical trial platform consolidating 40+ applications). Designed for reuse across other Lilly systems including clinical and commercial applications.",
      metrics:[{n:"40+",l:"Apps consolidated"},{n:"5",l:"User personas"},{n:"AI",l:"Content generation"}],
      links:[] },
    { title:"Nexus Platform AI Agents", tagline:"Clinical Trial Platform Optimization",
      desc:"Identified and proposed 4 AI agents to optimize the Lilly Nexus clinical trial platform: Onboarding Orchestration Agent (replacing manual Outlook bulk-email workflows), FPV Milestone Watcher (replacing ad-hoc timeline tracking), Q&A Support Deflection Agent (citation-grounded answers from 36-page platform docs), and Access Review Summarizer for auditors.",
      metrics:[{n:"4",l:"Agents proposed"},{n:"70K+",l:"Platform users"},{n:"GxP",l:"Regulated"}],
      links:[] },
    { title:"AI Builder Toolkit", tagline:"Team Capability Building",
      desc:"Built and scaled an AI-powered PM/BA toolkit across 4 product teams.",
      bullets:[
        "10 reusable Claude agent skills (PRDs, RICE/WSJF, user stories, process maps) — 60% drafting time reduction, adopted by 60 teammates",
        "6 role-based MCP plugins (Discovery, Roadmap, Launch, Jira Delivery, Requirements Governance, Sprint Reporting) connected to Jira, Confluence, Drive, Gmail, Calendar",
        "Automated delivery hygiene: rough notes → groomed stories, epic audits, sprint reviews from live Jira data — 10 hrs saved/sprint across 20 sprints",
        "Composable architecture: PM and BA plugins share core skills, new workflows ship without rebuilding"
      ],
      metrics:[{n:"10",l:"Agent skills"},{n:"6",l:"Plugins"},{n:"60%",l:"Time saved"},{n:"60",l:"Adopted by"}],
      links:[] },
  ];
  const initiatives = activeTab === "salesforce" ? sfInitiatives : lillyInitiatives;
  const accentColor = activeTab === "salesforce" ? sfBlue : lillyRed;
  const roleLabel = activeTab === "salesforce" ? "Product Owner, Employee Success · Feb 2021 – Mar 2023" : "Product Manager, Cancer Clinical Platform · Jan 2026 – Present";

  return (
    <section style={{ padding:"48px 24px", maxWidth:1080, margin:"0 auto" }} id="deepdive">
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:accentColor, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:6 }}>Deep Dive</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:700, color:T.text, letterSpacing:"-0.03em", margin:"0 0 12px" }}>What I Built</h2>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:8 }}>
          <button onClick={() => setActiveTab("lilly")}
            style={{ padding:"7px 18px", fontSize:13, fontWeight:activeTab==="lilly"?600:400, color:activeTab==="lilly"?"#fff":T.textSec, background:activeTab==="lilly"?lillyRed:T.surface, border:`1px solid ${activeTab==="lilly"?lillyRed:T.border}`, borderRadius:100, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
            Eli Lilly
          </button>
          <button onClick={() => setActiveTab("salesforce")}
            style={{ padding:"7px 18px", fontSize:13, fontWeight:activeTab==="salesforce"?600:400, color:activeTab==="salesforce"?"#fff":T.textSec, background:activeTab==="salesforce"?sfBlue:T.surface, border:`1px solid ${activeTab==="salesforce"?sfBlue:T.border}`, borderRadius:100, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
            Salesforce
          </button>
        </div>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, margin:0 }}>{roleLabel}</p>
      </div>
      <div style={{ display:"grid", gap:12 }}>
        {initiatives.map((init, i) => (
          <div key={i} style={{ padding:"20px", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, borderLeft:`3px solid ${accentColor}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:10 }}>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:600, color:T.text, marginBottom:2 }}>{init.title}</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:accentColor }}>{init.tagline}</div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                {init.links.map((link, j) => (
                  <a key={j} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{ padding:"3px 10px", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:500, color:accentColor, background:`${accentColor}12`, border:`1px solid ${accentColor}30`, borderRadius:100, textDecoration:"none" }}
                    onClick={e => e.stopPropagation()}>{link.label} ↗</a>
                ))}
              </div>
            </div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:T.textSec, lineHeight:1.6, margin:"0 0 14px" }}>{init.desc}</p>
            {init.bullets && (
              <div style={{ margin:"0 0 14px" }}>
                {init.bullets.map((b, bi) => (
                  <div key={bi} style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:T.textSec, lineHeight:1.6, padding:"3px 0 3px 14px", position:"relative" }}>
                    <span style={{ position:"absolute", left:0, top:9, width:5, height:5, borderRadius:"50%", background:`${accentColor}60` }} />
                    {b}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {init.metrics.map((m, k) => (
                <div key={k} style={{ textAlign:"center", minWidth:70 }}>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:accentColor, lineHeight:1 }}>{m.n}</div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:T.textMuted, marginTop:2 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12, padding:"14px 20px", background:T.elevated, border:`1px solid ${T.border}`, borderRadius:10, display:"flex", justifyContent:"center", gap:20, flexWrap:"wrap" }}>
        {(activeTab === "lilly" ? [
          {n:"10",l:"Agent skills built"},{n:"6",l:"MCP plugins shipped"},{n:"60%",l:"Drafting time saved"},{n:"200hrs",l:"Saved across sprints"}
        ] : [
          {n:"40%",l:"Adoption increase"},{n:"60K",l:"Users supported"},{n:"6",l:"Salesforce certs"},{n:"13",l:"Superbadges"}
        ]).map((s,i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700, color:T.mint }}>{s.n}</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:T.textMuted, marginLeft:5 }}>{s.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const categories = {
    "AI & Agents": { items:["Claude API","Claude MCP","CrewAI","Agentic Architecture","Prompt Engineering","AI/ML Requirements"], color:T.accent },
    "Automation": { items:["Make","GitHub Actions","Airtable","Supabase","Notion API","Webhooks","REST APIs","OAuth"], color:T.mint },
    "Deployment": { items:["Streamlit","Vercel","HTML/CSS/JS","React"], color:T.purple },
    "Product": { items:["Data-Driven Decisions","A/B Testing","Digital Commerce","Revenue Optimization","Business Cases"], color:T.amber },
    "Analytics": { items:["SQL","Telemetry","GMV / ARPU / Churn","Experimentation Platforms","Data Analytics"], color:T.coral },
    "Execution": { items:["Agile/Scrum","JIRA","Confluence","Figma","Productboard","Backlog Prioritization"], color:T.textSec },
  };
  return (
    <section style={{ padding:"48px 24px", maxWidth:1080, margin:"0 auto" }} id="skills">
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color:T.amber, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:6 }}>Toolkit</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:700, color:T.text, letterSpacing:"-0.03em", margin:0 }}>Skills & Proficiency</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:10 }}>
        {Object.entries(categories).map(([cat, { items, color }]) => (
          <div key={cat} style={{ padding:"16px 18px", background:T.card, border:`1px solid ${T.border}`, borderRadius:10 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600, color, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:color }} />{cat}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {items.map(s => <span key={s} style={{ padding:"3px 10px", fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:T.textSec, background:T.surface, border:`1px solid ${T.border}`, borderRadius:100 }}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hey! I'm Shreya's AI — ask me anything about her experience, agents, skills, or background.\n\nTry: \"What has she shipped?\" or \"Tell me about her Salesforce work.\"" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  const send = async () => {
    if (!input.trim() || loading) return;
    const newMsgs = [...messages, { role:"user", content:input.trim() }];
    setMessages(newMsgs); setInput(""); setLoading(true);
    try {
      const chatUrl = window.location.hostname === 'localhost' || window.location.hostname.includes('vercel')
        ? '/api/chat' : 'https://api.anthropic.com/v1/messages';
      const r = await fetch(chatUrl, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system:SHREYA_CONTEXT, messages:newMsgs.map(m=>({role:m.role,content:m.content})) })
      });
      const d = await r.json();
      setMessages(p => [...p, { role:"assistant", content:d.content?.map(c=>c.text||"").join("")||"Couldn't process that." }]);
    } catch(e) { setMessages(p => [...p, { role:"assistant", content:"Something went wrong. Try again." }]); }
    setLoading(false);
  };
  return (
    <div style={{ position:"fixed", bottom:72, right:20, width:"min(380px,calc(100vw - 40px))", height:"min(480px,70vh)", background:T.card, border:`1px solid ${T.borderLight}`, borderRadius:16, display:"flex", flexDirection:"column", zIndex:200, boxShadow:`0 8px 40px rgba(0,0,0,0.5), 0 0 40px ${T.glow}` }}>
      <div style={{ padding:"12px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:T.text }}>Ask Shreya's AI</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textMuted }}>powered by claude</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.textMuted, fontSize:16, cursor:"pointer", padding:4 }}>✕</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
        {messages.map((m,i) => (
          <div key={i} style={{ marginBottom:8, display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"85%", padding:"8px 12px", fontSize:13, fontFamily:"'Inter',sans-serif", lineHeight:1.6, whiteSpace:"pre-wrap",
              borderRadius:m.role==="user"?"10px 10px 3px 10px":"10px 10px 10px 3px",
              background:m.role==="user"?`${T.accent}18`:T.surface,
              border:`1px solid ${m.role==="user"?`${T.accent}30`:T.border}`, color:T.textSec,
            }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ marginBottom:8 }}><div style={{ display:"inline-block", padding:"8px 12px", borderRadius:"10px 10px 10px 3px", background:T.surface, border:`1px solid ${T.border}`, fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.textMuted }}>thinking...</div></div>}
        <div ref={ref} />
      </div>
      <div style={{ padding:"10px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about experience, agents, skills..."
          style={{ flex:1, padding:"8px 12px", fontSize:13, fontFamily:"'Inter',sans-serif", background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, color:T.text, outline:"none" }} />
        <button onClick={send} disabled={loading}
          style={{ padding:"8px 16px", fontSize:13, fontWeight:600, background:T.accent, color:"#fff", border:"none", borderRadius:8, opacity:loading?0.5:1, fontFamily:"'Inter',sans-serif" }}>Send</button>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <Hero />
      <div style={{ maxWidth:100, margin:"0 auto", height:1, background:`linear-gradient(90deg, transparent, ${T.purple}, transparent)` }} />
      <CareerSection />
      <div style={{ maxWidth:100, margin:"0 auto", height:1, background:`linear-gradient(90deg, transparent, #00A1E0, transparent)` }} />
      <DeepDiveSection />
      <div style={{ maxWidth:100, margin:"0 auto", height:1, background:`linear-gradient(90deg, transparent, ${T.accent}, transparent)` }} />
      <StreamMindSection />
      <div style={{ maxWidth:100, margin:"0 auto", height:1, background:`linear-gradient(90deg, transparent, ${T.amber}, transparent)` }} />
      <SkillsSection />
      <footer style={{ padding:"28px 24px", textAlign:"center", borderTop:`1px solid ${T.border}` }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textMuted }}>shreya patel · 2026 · built with claude</div>
      </footer>
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)}
          style={{ position:"fixed", bottom:20, right:20, width:52, height:52, borderRadius:"50%", background:T.accent, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:`0 4px 20px ${T.glow}`, zIndex:100 }}>💬</button>
      )}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
