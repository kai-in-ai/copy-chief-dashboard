# Copy Chief BLACK — Complete System Integration Guide

## ✅ System Status: FULLY OPERATIONAL

Your local Copy Chief BLACK production system is **complete and ready to use**. All 3 components have been built, tested, and verified.

### What Was Built:

1. ✅ **WebSocket Event Server** (`localhost:4001`)
   - Receives events from Copy Chief agents
   - Broadcasts real-time updates to dashboard
   - Persists offer state and quality scores
   - Files: `/home/user/copy-chief-black/lib/websocket-server.js`, `event-emitter.js`, `event-types.js`

2. ✅ **Real-Time Event System**
   - 13 agent types with event schema
   - Events: PhaseTransition, AgentStarted, AgentCompleted, DeliverableGenerated, QualityScore, etc.
   - Global singleton pattern for easy access by agents
   - Files: `lib/event-emitter.js`, `lib/event-types.js`

3. ✅ **Dashboard Integration**
   - Dashboard now set to REAL MODE: `NEXT_PUBLIC_MOCK_MODE=false`
   - Connects via WebSocket to `localhost:4001`
   - Updates Zustand stores in real-time
   - Files: `/home/user/copy-chief-dashboard/dashboard/.env.local`

4. ✅ **Sample Offer Created**
   - Location: `~/copywriting-ecosystem/health/fitness-app/`
   - Ready for pipeline execution
   - Full directory structure in place

5. ✅ **Event System Tested**
   - WebSocket server tested and working
   - Sample events emitted and confirmed
   - Quality scores calculated correctly
   - Events logged and broadcast to clients

---

## 🚀 HOW TO RUN THE COMPLETE SYSTEM

### Setup (One-time)

```bash
# 1. Ensure dashboard is in real mode (already done)
cat /home/user/copy-chief-dashboard/dashboard/.env.local
# Should show: NEXT_PUBLIC_MOCK_MODE=false

# 2. Verify Node.js and dependencies
node --version           # ≥18.0.0
cd /home/user/copy-chief-black
npm install              # Already done
```

### Run the System (3 Terminals)

#### Terminal 1: Start WebSocket Event Server

```bash
cd /home/user/copy-chief-black
npm run server
```

Expected output:
```
✓ Copy Chief BLACK Event System Initialized
✓ WebSocket server running on ws://localhost:4001
✓ Dashboard will connect to: http://localhost:3000

Agents available:
  @helix          - Helix (Orchestration)
  @researcher     - Vox (Market Research)
  ...13 agents total...

Pipeline phases: RESEARCH → STRATEGY → COPY → VALIDATION → DELIVERY
```

**Status indicator:** Server is running when you see "WebSocket server running on ws://localhost:4001"

#### Terminal 2: Start Dashboard

```bash
cd /home/user/copy-chief-dashboard/dashboard
npm run build  # (optional, rebuilds with NEXT_PUBLIC_MOCK_MODE=false)
npm run dev
```

Expected output:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Open browser:** http://localhost:3000

You'll see **DISCONNECTED** initially (waiting for agents to work).

#### Terminal 3: Launch Claude Code

```bash
cd ~/copywriting-ecosystem
claude
```

This opens Claude Code with all agents available as `@handles`.

---

## 📋 STEP-BY-STEP WORKFLOW

### Step 1: Watch Dashboard

1. Open http://localhost:3000 in browser
2. Navigate to **Monitor** tab (`/monitor`)
3. You should see "DISCONNECTED" (no agents working yet)

### Step 2: Request Copywriting Work (in Claude Code)

Type any of these:

```
Start research for health/fitness-app

or

Initiate the copywriting pipeline for health/fitness-app

or

Begin market research and competitor analysis for health/fitness-app
```

Claude routes this to `@helix` (Helix orchestrator), who dispatches to other agents.

### Step 3: Watch Real-Time Updates

As agents work:

1. **Monitor tab** shows live event stream
   - `PhaseTransition: RESEARCH` (agent started research phase)
   - `AgentStarted: @researcher analyzing market` (agent working)
   - `DeliverableGenerated: research/voc.md` (output created)
   - `AgentCompleted: @researcher` (agent finished)

2. **Agents tab** shows status
   - Lights up which agents are working
   - Shows `working / idle` status

3. **Kanban tab** shows offers by pipeline stage
   - `health/fitness-app` moves through phases

4. **HELIX tab** shows phase progress
   - RESEARCH → STRATEGY → COPY → VALIDATION → DELIVERY

5. **Insights tab** shows quality scores
   - RMBC (Digestible/Unique/Probable/Connected)
   - Blind Critic scores
   - Emotional intensity

### Step 4: Wait for Pipeline to Complete

The full pipeline (research → briefing → production → validation) takes time as Claude Code processes each phase.

You'll see:
- Research deliverables generated
- HELIX briefing created
- VSL screenplay, landing page, creatives, emails produced
- Quality validation scores calculated
- Final delivery phase

### Step 5: Check Generated Copy

```bash
# View research outputs
ls -la ~/copywriting-ecosystem/health/fitness-app/research/

# View production outputs
ls -la ~/copywriting-ecosystem/health/fitness-app/production/

# View specific deliverable (e.g., VSL)
cat ~/copywriting-ecosystem/health/fitness-app/production/vsl/*.md

# View quality validation
cat ~/copywriting-ecosystem/health/fitness-app/reports/*.yaml 2>/dev/null || echo "Reports generated during validation"
```

---

## 📊 REAL-TIME MONITORING

While agents work, the dashboard shows:

```
┌─ Monitor (Event Stream) ──────────────────┐
│ 15:23:45 PhaseTransition → RESEARCH       │
│ 15:23:46 AgentStarted @researcher         │
│ 15:23:47 DeliverableGenerated research/   │
│ 15:24:12 AgentCompleted @researcher       │
│ 15:24:13 PhaseTransition → STRATEGY       │
│ 15:24:14 AgentStarted @briefer            │
│ ...                                        │
└──────────────────────────────────────────┘

┌─ Agents (Status) ─────────────────────────┐
│ @helix        [idle]                      │
│ @researcher   [working] ⟳                │
│ @briefer      [working] ⟳                │
│ @vsl          [idle]                      │
│ @lp           [idle]                      │
│ ...all 13 agents...                       │
└──────────────────────────────────────────┘

┌─ Kanban (Pipeline) ───────────────────────┐
│ RESEARCH  │ STRATEGY  │ COPY  │ VALIDATION│
│ fitness-  │           │       │           │
│ app (in   │           │       │           │
│ progress) │           │       │           │
└──────────────────────────────────────────┘

┌─ Quality Scores ──────────────────────────┐
│ Digestible  ████████░ 87%                │
│ Unique      █████████ 92%                │
│ Probable    ████████░ 85%                │
│ Connected   █████████ 90%                │
│ Blind Critic ████████░ 87%               │
│ Emotional   █████████ 91%                │
└──────────────────────────────────────────┘
```

---

## 🎯 COMMON COMMANDS IN CLAUDE CODE

```
@helix
  "Start research for health/fitness-app"
  "Run full pipeline for health/fitness-app"
  "Create multiple offers in parallel"

@researcher / @vox
  "Research the fitness app market"
  "Find target avatar for fitness products"

@briefer / @atlas
  "Create HELIX briefing for the research"

@vsl / @echo
  "Write VSL screenplay based on briefing"

@lp / @forge
  "Structure landing page with 14 blocks"

@creative / @scout
  "Generate 50 ad creative variations"

@producer / @blade
  "Write email sequences"

@critic / @hawk
  "Review and critique all copy"

@gatekeeper / @sentinel
  "Run quality validation gates"

@ops
  "Commit deliverables to git"
```

---

## 🔧 ARCHITECTURE BREAKDOWN

```
Your Machine
├─ Terminal 1: npm run server (localhost:4001)
│  └─ WebSocket server accepting connections
│     ├─ Receives events from agents
│     ├─ Broadcasts to all connected clients
│     └─ Tracks offer state in memory
│
├─ Terminal 2: npm run dev (localhost:3000)
│  └─ Next.js dashboard
│     ├─ Connects to WebSocket on mount
│     ├─ Listens for real-time events
│     ├─ Updates Zustand stores
│     └─ Re-renders UI with live data
│
└─ Terminal 3: claude (~/copywriting-ecosystem)
   └─ Claude Code with agents
      ├─ @helix routes requests
      ├─ @researcher, @briefer, @vsl, etc. work
      ├─ Each agent calls getEventEmitter()
      ├─ emitter.emitAgentStarted(...)
      ├─ ... agent work happens ...
      ├─ emitter.emitAgentCompleted(...)
      ├─ emitter.emitQualityScore(...)
      └─ Events sent → WebSocket → Dashboard
```

---

## 🐛 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Dashboard shows DISCONNECTED | Verify Terminal 1: `npm run server` is running. Check browser console (F12) for WebSocket errors. |
| WebSocket connection refused | Check port 4001 not in use: `lsof -i :4001`. Kill if needed: `kill -9 <PID>`. Restart server. |
| No events appearing in Monitor | Verify Claude Code is running (Terminal 3). Make a request like "Start research". Check server logs in Terminal 1. |
| Agents not responding in Claude Code | Type `/help` to see available commands. Verify framework path: `echo $ECOSYSTEM_ROOT`. |
| Events not triggering generation | Verify NEXT_PUBLIC_MOCK_MODE=false in .env.local. Restart dashboard: `npm run dev`. |
| Port 3000 already in use | Kill existing process: `lsof -i :3000`, then `kill -9 <PID>`. Start dashboard again. |

---

## ✨ WHAT HAPPENS BEHIND THE SCENES

When you request "Start research for health/fitness-app":

```
1. Your text enters Claude Code session
2. Helix (@chief) receives the request
3. Helix routes to Vox (@researcher) for RESEARCH phase
4. Vox starts: emitter.emitAgentStarted('@researcher', 'health/fitness-app', '...')
5. Event sent → Terminal 1 WebSocket server
6. Server broadcasts to Terminal 2 dashboard
7. Dashboard receives via WebSocket connection
8. Zustand monitor-store updates with new event
9. React components re-render showing @researcher status as "working"
10. Vox analyzes market, creates research files
11. Vox completes: emitter.emitAgentCompleted(...)
12. Event sent → WebSocket → Dashboard
13. Dashboard updates: @researcher status → "idle", show generated files
14. HELIX briefer (@atlas) triggered automatically
15. Process repeats for STRATEGY, COPY, VALIDATION, DELIVERY phases
16. Dashboard shows complete pipeline progression
17. Quality scores calculated and displayed
18. Final deliverables listed in Insights
```

---

## 🎓 LEARNING THE SYSTEM

### For Beginners:
1. Start with `/home/user/QUICK-START.md` — Simple 5-step walkthrough
2. Run one complete pipeline: "Start research for health/fitness-app"
3. Watch dashboard update in real-time
4. Check generated files in `~/copywriting-ecosystem/health/fitness-app/production/`

### For Deep Dive:
1. Read `/home/user/COPY-CHIEF-SETUP.md` — Complete architecture guide
2. Read `/home/user/copy-chief-black/README.md` — Framework details
3. Check `/home/user/copy-chief-black/framework/plugins/CLAUDE.md` — Claude Code integration
4. Explore agent definitions in `/home/user/copy-chief-black/framework/squads/copy-chief/agents/`

### For Advanced:
1. Modify event emission in Copy Chief agents
2. Add custom event types in `lib/event-types.js`
3. Create custom dashboard views
4. Integrate with external APIs for real data

---

## 🚀 NEXT STEPS

1. **Run the system** with all 3 terminals open
2. **Create 3 different offers** to test parallelization:
   ```bash
   node bin/cli.js new-offer health supplement-x
   node bin/cli.js new-offer relationships dating-app
   node bin/cli.js new-offer investing trading-bot
   ```
3. **Request multiple pipelines** in Claude Code simultaneously
4. **Watch the dashboard** handle parallel agent execution
5. **Analyze output quality** in the Insights tab
6. **Export deliverables** and use them (VSLs, LPs, emails, creatives)

---

## 📞 SUPPORT

**If something breaks:**

1. Check terminal logs (error messages are printed to all 3 terminals)
2. Restart the failing component:
   - Terminal 1: Stop (`Ctrl+C`) and restart with `npm run server`
   - Terminal 2: Stop (`Ctrl+C`) and restart with `npm run dev`
   - Terminal 3: Stop (`Ctrl+C`) and restart with `claude`
3. Check `.env.local` has `NEXT_PUBLIC_MOCK_MODE=false`
4. Verify Node version: `node --version` (≥18.0.0)
5. Check ports are free: `lsof -i :3000` and `lsof -i :4001`

---

## 🎯 SUCCESS CRITERIA

You'll know the system is working when:

✅ WebSocket server prints "WebSocket server running on ws://localhost:4001"
✅ Dashboard shows "CONNECTED" (top right of page)
✅ You make a request in Claude Code
✅ Monitor tab shows real-time events flowing in
✅ Agents tab lights up showing working agents
✅ Kanban tab shows offer moving through phases
✅ Quality scores appear in Insights tab
✅ Files generated in `~/copywriting-ecosystem/health/fitness-app/production/`

---

**You now have a complete, production-ready Copy Chief BLACK system running locally with real-time dashboard monitoring. 🎉**

Start with Terminal 1, then Terminal 2, then Terminal 3. Make a request. Watch the magic happen.
