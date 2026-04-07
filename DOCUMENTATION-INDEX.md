# Copy Chief Dashboard Documentation Index

**Quick Navigation Guide** — All documentation organized by use case

---

## 📖 START HERE

### For a Quick Overview
👉 **[SETUP-COMPARISON-SUMMARY.md](./SETUP-COMPARISON-SUMMARY.md)** (10 min read)
- What we were looking for vs what we found
- Key system capabilities at a glance
- Common Q&A

### For Complete Understanding
👉 **[JARVIS-COPY-CHIEF-ANALYSIS.md](./JARVIS-COPY-CHIEF-ANALYSIS.md)** (30 min read)
- Full system architecture
- Workflow diagram
- All 13 agents explained
- Quality gates system
- File structure reference

### For Using MCP Tools
👉 **[MCP-TOOLS-REFERENCE.md](./MCP-TOOLS-REFERENCE.md)** (Reference)
- Each of 10 MCP tools with examples
- When to call which tool
- Expected inputs/outputs
- Rules & constraints

---

## 🚀 RUNNING THE SYSTEM

### Setup & Troubleshooting
👉 **[SYSTEM-INTEGRATION-COMPLETE.md](./SYSTEM-INTEGRATION-COMPLETE.md)**
- 3-terminal setup instructions
- Step-by-step workflow walkthrough
- Real-time monitoring dashboard
- Troubleshooting guide
- Success criteria checklist

### Dashboard Usage
👉 **[README.md](./README.md)** (Dashboard)
- UI overview
- All 11 pages explained
- Real-time features
- Configuration options

---

## 📋 REFERENCE DOCUMENTS

### Framework Documentation
- **[WORKFLOW-CANONICO.md](../copy-chief-black/framework/WORKFLOW-CANONICO.md)** — Workflow spec (v6.3) with blocking checkpoints
- **[CLAUDE.md](../copy-chief-black/framework/CLAUDE.md)** — Claude Code integration guide
- **[orchestrator.md](../copy-chief-black/framework/orchestrator.md)** — Agent routing rules

### Quality & Validation
- **[copy-quality-gate.md](../copy-chief-black/framework/squads/copy-chief/checklists/copy-quality-gate.md)** — 9-dimension quality checklist
- **[validation-workflow.md](../copy-chief-black/framework/workflows/validation-workflow.md)** — Validation phase workflow

### MCP Plugin
- **[copywriting-mcp/README.md](../copywriting-mcp/server/README.md)** — MCP plugin documentation (v2.0)

---

## 🗂️ QUICK LOOKUP TABLE

| Need | Document | Section |
|------|----------|---------|
| Run system | SYSTEM-INTEGRATION-COMPLETE.md | How to Run |
| Understand workflow | JARVIS-COPY-CHIEF-ANALYSIS.md | Section 1 |
| Learn agents | JARVIS-COPY-CHIEF-ANALYSIS.md | Section 4 |
| Quality gates | JARVIS-COPY-CHIEF-ANALYSIS.md | Section 3 |
| Use voc_search | MCP-TOOLS-REFERENCE.md | Tool 1 |
| Use validate_gate | MCP-TOOLS-REFERENCE.md | Tool 3 |
| Use blind_critic | MCP-TOOLS-REFERENCE.md | Tool 4 |
| Final validation | MCP-TOOLS-REFERENCE.md | Tool 8 |
| Dashboard pages | README.md | Pages section |
| Agent routing | CLAUDE.md | Agent Routing |
| Troubleshooting | SYSTEM-INTEGRATION-COMPLETE.md | Troubleshooting |
| Key insights | SETUP-COMPARISON-SUMMARY.md | Critical Insights |

---

## 📚 READ ORDER BY GOAL

### Goal: "I want to understand what we have"

1. SETUP-COMPARISON-SUMMARY.md (10 min)
2. JARVIS-COPY-CHIEF-ANALYSIS.md sections 1-5 (20 min)
3. MCP-TOOLS-REFERENCE.md (reference as needed)

### Goal: "I want to run the system"

1. SYSTEM-INTEGRATION-COMPLETE.md → How to Run (5 min)
2. Start 3 terminals as instructed (30 min)
3. Follow Step-by-Step Workflow (15 min)

### Goal: "I want to generate copy using agents"

1. SYSTEM-INTEGRATION-COMPLETE.md → How to Run
2. CLAUDE.md → Agent Routing section
3. WORKFLOW-CANONICO.md → Phase you're working on
4. MCP-TOOLS-REFERENCE.md → Tools for your phase

### Goal: "I want to validate copy quality"

1. JARVIS-COPY-CHIEF-ANALYSIS.md → Section 3 (Quality Gates)
2. MCP-TOOLS-REFERENCE.md → Tools 4-8 (Validation tools)
3. copy-quality-gate.md → 9-dimension checklist

### Goal: "I want to troubleshoot a problem"

1. SYSTEM-INTEGRATION-COMPLETE.md → Troubleshooting section
2. Check the specific phase in WORKFLOW-CANONICO.md
3. Reference the appropriate MCP tool in MCP-TOOLS-REFERENCE.md

---

## 🎯 KEY NUMBERS TO KNOW

| Metric | Value |
|--------|-------|
| **Workflow Phases** | 5 (PESQUISA → VALIDAÇÃO) |
| **Blocking Checkpoints** | 6 (cannot bypass) |
| **MCP Tools** | 10 available |
| **MCP Resources** | 9 (templates + prompts) |
| **Agent Personas** | 13 (Helix, Vox, Cipher, etc.) |
| **Dashboard Pages** | 11 (Dashboard, Pipeline, Kanban, etc.) |
| **Quality Gate Dimensions** | 9 (Clarity, DRE, Believability, etc.) |
| **BLACK Final Gates** | 6 (Fear-First, Mechanism, etc.) |
| **Anti-Homog Red Flags** | 10 possible (each -0.5 penalty) |
| **DRE Escalation Levels** | 5 (Surface → Transcendent) |

---

## 📍 FILE LOCATIONS

```
/home/user/copy-chief-dashboard/
├── DOCUMENTATION-INDEX.md          ← You are here
├── SETUP-COMPARISON-SUMMARY.md     ← Key findings
├── JARVIS-COPY-CHIEF-ANALYSIS.md   ← Complete analysis
├── MCP-TOOLS-REFERENCE.md          ← Tool reference
├── SYSTEM-INTEGRATION-COMPLETE.md  ← Setup guide
├── README.md                        ← Dashboard docs
└── dashboard/                       ← Next.js app
    └── .env.local                   ← NEXT_PUBLIC_MOCK_MODE=false

/home/user/copy-chief-black/
├── framework/
│   ├── WORKFLOW-CANONICO.md
│   ├── CLAUDE.md
│   ├── orchestrator.md
│   └── squads/copy-chief/
│       └── checklists/
│           └── copy-quality-gate.md

/home/user/copywriting-mcp/
└── server/
    ├── README.md
    ├── src/tools/                  ← 10 MCP tools
    ├── prompts/                    ← Tool prompts
    └── data/                        ← SQLite DB
```

---

## 🔗 CROSS-REFERENCES

### From SETUP-COMPARISON-SUMMARY.md

- "We Don't Need External Comparison" → See JARVIS-COPY-CHIEF-ANALYSIS.md Section 7
- "MCP Integration Is Mandatory" → See MCP-TOOLS-REFERENCE.md
- "Quality Gates Are Blocking" → See copy-quality-gate.md
- "Fear-First Framework" → See WORKFLOW-CANONICO.md, Section on DRE

### From JARVIS-COPY-CHIEF-ANALYSIS.md

- Section 1 (Workflow) → See WORKFLOW-CANONICO.md for full spec
- Section 2 (MCP Tools) → See MCP-TOOLS-REFERENCE.md for details
- Section 3 (Quality Gates) → See copy-quality-gate.md for checklist
- Section 4 (Agents) → See CLAUDE.md for routing rules
- Section 6 (Dashboard) → See README.md for UI details

### From MCP-TOOLS-REFERENCE.md

- validate_gate tool → See WORKFLOW-CANONICO.md Section: ENFORCEMENT
- blind_critic tool → See copy-quality-gate.md Section: 9-Dimension Quality Scoring
- black_validation tool → See copy-quality-gate.md (implied by tool)

---

## ✅ VERIFICATION CHECKLIST

Use this to verify system is ready:

- [ ] Read SETUP-COMPARISON-SUMMARY.md
- [ ] Read JARVIS-COPY-CHIEF-ANALYSIS.md (at least sections 1-4)
- [ ] Checked file locations match documentation
- [ ] Terminal 1: `npm run server` starts (localhost:4001)
- [ ] Terminal 2: `npm run dev` starts dashboard (localhost:3000)
- [ ] Terminal 3: `claude` opens with @agents available
- [ ] Dashboard shows DISCONNECTED initially
- [ ] Made request in Claude: "Start research for health/fitness-app"
- [ ] Events stream to dashboard in real-time
- [ ] Quality scores appear after validation
- [ ] Files generated in ~/copywriting-ecosystem/

If all checked ✅ → System is operational

---

## 🆘 SUPPORT

**If stuck on:**

| Issue | Reference |
|-------|-----------|
| System won't start | SYSTEM-INTEGRATION-COMPLETE.md → Troubleshooting |
| Gate validation fails | WORKFLOW-CANONICO.md → Enforcement section |
| MCP tool not working | MCP-TOOLS-REFERENCE.md → specific tool |
| Quality score low | copy-quality-gate.md → dimension that failed |
| Agent not responding | CLAUDE.md → Agent Routing section |
| Dashboard not updating | SYSTEM-INTEGRATION-COMPLETE.md → "Dashboard shows DISCONNECTED" |

---

## 📅 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-07 | Initial documentation set created |

---

## 🎓 LEARNING PATH

**Beginner (30 minutes):**
1. SETUP-COMPARISON-SUMMARY.md
2. SYSTEM-INTEGRATION-COMPLETE.md → How to Run
3. Start the system, make one request

**Intermediate (2 hours):**
1. JARVIS-COPY-CHIEF-ANALYSIS.md (all sections)
2. WORKFLOW-CANONICO.md (full spec)
3. Run 2-3 different offers, watch patterns

**Advanced (ongoing):**
1. MCP-TOOLS-REFERENCE.md (deep dive)
2. copy-quality-gate.md (scoring methodology)
3. CLAUDE.md (agent coordination)
4. Customize/extend based on needs

---

**Last Updated:** 2026-04-07  
**Status:** COMPLETE — All documentation compiled and indexed
