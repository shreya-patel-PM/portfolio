# Shreya Patel — Interactive Portfolio

**Senior Product Manager · AI Product Builder**

Live site: [portfolio-shreya-patel.vercel.app](https://portfolio-shreya-patel.vercel.app/)

An interactive portfolio showcasing 16 AI agents built as part of **StreamMind**, a 22-week initiative shipping autonomous AI workflows across streaming/media, product management, pharma, and ad-revenue domains. Features a Claude-powered AI chatbot that answers recruiter questions about my background in real time.

---

## What's Inside

- **StreamMind Agent Explorer** — 16 AI agents filterable by Streaming, Product Management, and Flagship. Each card shows LLM used, RAG status, eval strategy, and framework. Click to expand architecture details.
- **4 Flagship Agents** — Deep architecture with full evals, guardrails, and cost analysis:
  - **GhostCheck** — Ghost job detection SaaS (Next.js + Supabase + Claude classification, F1 eval, adversarial benchmark) ✅ Shipped
  - **Ad Incrementality Brief** — Deterministic lift math + LLM narration for ad measurement
  - **PM Copilot** — CrewAI multi-agent orchestration with Supabase memory + Slack Bolt
  - **Clinical Trial Analyzer** — RAG over trial protocol PDFs with Claude document API
- **Career Timeline** — 10+ years across Eli Lilly, T-Mobile, J&J, CVS Aetna, Salesforce, and MUFG
- **Salesforce Deep Dive** — V2MOM Application (70K+ users, AppExchange), Insiders Program (97% offer acceptance), Camp B-Well
- **AI Chatbot** — Powered by Claude, answers questions about my experience, agents, and skills
- **Skills & Certifications** — 6 Salesforce certs, 13 Superbadges, Oracle SQL/PLSQL, CSPO, CSM, SAFe

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React + Vite |
| Hosting | Vercel (auto-deploy from GitHub) |
| AI Chatbot | Claude Sonnet via Anthropic API |
| API Proxy | Vercel Serverless Functions |
| Agent Stack | Claude API, Make, CrewAI, Airtable, Supabase, Notion, Streamlit, GitHub Actions, Next.js |

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Deploy to Vercel

```bash
git init
git add .
git commit -m "initial portfolio"
git remote add origin https://github.com/shreya-patel-PM/portfolio.git
git push -u origin main

# Go to vercel.com → Add New Project → Import repo → Deploy
```

## Enable the AI Chatbot

1. Get an API key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. In Vercel: **Project Settings → Environment Variables**
3. Add `ANTHROPIC_API_KEY` = your key
4. Redeploy

The `api/chat.js` serverless function proxies requests so your key stays secret.

## Update Content

All data lives in `src/App.jsx`:

| What to update | Where in the file |
|----------------|-------------------|
| Ship an agent | Flip `shipped: true` in the `AGENTS` array |
| Add/remove an agent | Edit the `AGENTS` array |
| Update work history | Edit the `EXPERIENCE` array |
| Update chatbot knowledge | Edit the `SHREYA_CONTEXT` string |
| Add tools to stack | Edit the `STACK` array |

Edit directly on GitHub (pencil icon on `src/App.jsx`) → commit → Vercel auto-deploys in 30 seconds.

## Project Structure

```
├── index.html          # Entry point + meta tags
├── package.json        # Dependencies (React + Vite)
├── vite.config.js      # Build config
├── api/
│   └── chat.js         # Vercel serverless proxy for chatbot
└── src/
    ├── main.jsx        # React bootstrap
    └── App.jsx         # Entire portfolio (all content + components)
```

## Links

- **Portfolio**: [portfolio-shreya-patel.vercel.app](https://portfolio-shreya-patel.vercel.app/)
- **LinkedIn**: [linkedin.com/in/shreeapatel](https://www.linkedin.com/in/shreeapatel/)
- **Email**: shreyaishwarlalpatel@gmail.com

---

Built with Claude · 2026
