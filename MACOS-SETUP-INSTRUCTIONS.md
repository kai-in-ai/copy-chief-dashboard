# Copy Chief BLACK — Complete macOS Setup

## Quick Start (One Command)

Copy and paste this into your macOS terminal:

```bash
curl -fsSL https://raw.githubusercontent.com/kai-in-ai/copy-chief-dashboard/main/setup-copy-chief-macos.sh | bash
```

**Or manually:**

```bash
bash ~/setup-copy-chief-macos.sh
```

---

## What the Setup Script Does

The automated setup script will:

1. ✅ Check Node.js, npm, and Git are installed
2. ✅ Create `~/copy-chief-system` directory
3. ✅ Clone 3 core repositories:
   - `copy-chief-black` (agent framework)
   - `copy-chief-dashboard` (monitoring UI)
   - `copywriting-mcp` (quality validation tools)
4. ✅ Install npm dependencies for each project
5. ✅ Configure `.env.local` for WebSocket connection
6. ✅ Create `~/copywriting-ecosystem` directory structure
7. ✅ Initialize the Slim Control patch offer with:
   - `CONTEXT.md` (product specification)
   - `helix-state.yaml` (pipeline state)
   - `project_state.yaml` (project state)

**Total time:** ~5 minutes (depending on internet speed)

---

## Manual Setup (If You Prefer)

If you want to do it step-by-step:

### Step 1: Create Directories

```bash
mkdir -p ~/copy-chief-system
mkdir -p ~/copywriting-ecosystem/health/slim-control-patch/{research,briefings,production,reports}
cd ~/copy-chief-system
```

### Step 2: Clone Repositories

```bash
git clone https://github.com/lckx777/copy-chief-black.git
git clone https://github.com/kai-in-ai/copy-chief-dashboard.git
git clone https://github.com/lckx777/copywriting-mcp.git
```

### Step 3: Install Dependencies

```bash
# Copy Chief BLACK
cd ~/copy-chief-system/copy-chief-black
npm install

# Dashboard
cd ~/copy-chief-system/copy-chief-dashboard/dashboard
npm install
```

### Step 4: Configure Dashboard

```bash
# Create .env.local
cat > ~/copy-chief-system/copy-chief-dashboard/dashboard/.env.local << 'EOF'
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:4001
EOF
```

### Step 5: Initialize Offer

Copy the CONTEXT.md from `/home/user/slim-control-context.md` to:
```
~/copywriting-ecosystem/health/slim-control-patch/CONTEXT.md
```

---

## Run the System (3 Terminals)

Once setup is complete, open **3 separate terminal windows:**

### Terminal 1: WebSocket Event Server

```bash
cd ~/copy-chief-system/copy-chief-black
npm run server
```

**Expected Output:**
```
✓ Copy Chief BLACK Event System Initialized
✓ WebSocket server running on ws://localhost:4001
✓ Dashboard will connect to: http://localhost:3000
```

### Terminal 2: Real-Time Dashboard

```bash
cd ~/copy-chief-system/copy-chief-dashboard/dashboard
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Action:** Open your browser to **http://localhost:3000**

You should see the dashboard with "DISCONNECTED" status (waiting for agents).

### Terminal 3: Claude Code + Agents

```bash
cd ~/copywriting-ecosystem
claude
```

**Now make a request:**

```
Start research for health/slim-control-patch
```

Or for the full pipeline:

```
Run complete copywriting pipeline for health/slim-control-patch: research, briefing, VSL production, landing page structure, ad creatives, email sequences, quality validation
```

---

## Watch the System Work

As agents work, you'll see in Terminal 2 (Dashboard):

- **Monitor Tab** → Real-time event stream
- **Agents Tab** → Which agents are working (lights up)
- **Kanban Tab** → Offer moving through phases
- **Insights Tab** → Quality scores as validation completes

---

## Success Indicators

✅ Terminal 1 shows "WebSocket server running on ws://localhost:4001"
✅ Terminal 2 dashboard loads at http://localhost:3000
✅ Terminal 2 shows "CONNECTED" (top right) when agents start working
✅ Terminal 3 shows Claude Code with agents listed
✅ Terminal 2 Monitor tab shows live event stream

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "command not found: node" | Install Node.js: https://nodejs.org/ |
| "command not found: git" | Install Git: https://git-scm.com/ |
| "EADDRINUSE" on port 3000 | Kill existing process: `lsof -i :3000 \| grep node \| awk '{print $2}' \| xargs kill -9` |
| "EADDRINUSE" on port 4001 | Kill existing process: `lsof -i :4001 \| grep node \| awk '{print $2}' \| xargs kill -9` |
| Dashboard shows "DISCONNECTED" | Verify Terminal 1 is running `npm run server` |
| No events appearing | Make sure Terminal 3 Claude Code is active and you made a request |

---

## What You'll Generate

After the full pipeline completes (40-50 minutes):

✅ **Research** (market analysis, avatar, competitors)
✅ **HELIX Briefing** (10-phase psychological framework)
✅ **Advertorial** (2,000-2,500 words, magazine quality)
✅ **VSL Script** (8-minute video sales letter)
✅ **Landing Page** (14 optimized blocks)
✅ **Email Sequence** (5-email automation funnel)
✅ **50+ Ad Creatives** (static images + video variations)
✅ **Quality Validation** (87+ quality score)

All files saved to:
```
~/copywriting-ecosystem/health/slim-control-patch/
```

---

## Next Steps After Setup

1. Run the automated script: `bash ~/setup-copy-chief-macos.sh`
2. Wait for completion
3. Open 3 terminals with exact commands above
4. Watch your system generate a complete advertorial funnel in real-time

**You now have a production-ready Copy Chief BLACK system running locally on your Mac! 🎉**
