#!/bin/bash

# Copy Chief BLACK — Complete macOS Setup Script
# Automates: Clone repos, install dependencies, configure environment
# Usage: bash setup-copy-chief-macos.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
  echo -e "${BLUE}→${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed"
  echo "Install Node.js 18+ from: https://nodejs.org/"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  print_error "npm is not installed"
  exit 1
fi

if ! command -v git &> /dev/null; then
  print_error "Git is not installed"
  exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION"
print_success "npm $(npm --version)"
print_success "Git $(git --version | awk '{print $3}')"

# Set up directories
SETUP_DIR="$HOME/copy-chief-system"
ECOSYSTEM_DIR="$HOME/copywriting-ecosystem"

print_status "Setting up directories..."

if [ -d "$SETUP_DIR" ]; then
  print_warning "Directory $SETUP_DIR already exists. Skipping creation."
else
  mkdir -p "$SETUP_DIR"
  print_success "Created $SETUP_DIR"
fi

if [ -d "$ECOSYSTEM_DIR" ]; then
  print_warning "Directory $ECOSYSTEM_DIR already exists. Skipping creation."
else
  mkdir -p "$ECOSYSTEM_DIR"
  print_success "Created $ECOSYSTEM_DIR"
fi

cd "$SETUP_DIR"

# Clone repositories
print_status "Cloning repositories..."

REPOS=(
  "https://github.com/lckx777/copy-chief-black.git"
  "https://github.com/kai-in-ai/copy-chief-dashboard.git"
  "https://github.com/lckx777/copywriting-mcp.git"
)

for repo in "${REPOS[@]}"; do
  repo_name=$(basename "$repo" .git)

  if [ -d "$SETUP_DIR/$repo_name" ]; then
    print_warning "Repository $repo_name already cloned. Skipping."
  else
    print_status "Cloning $repo_name..."
    git clone "$repo" "$SETUP_DIR/$repo_name"
    print_success "Cloned $repo_name"
  fi
done

# Install dependencies for each project
print_status "Installing dependencies..."

# Copy Chief BLACK
print_status "Installing Copy Chief BLACK dependencies..."
cd "$SETUP_DIR/copy-chief-black"
npm install
print_success "Copy Chief BLACK dependencies installed"

# Dashboard
print_status "Installing Dashboard dependencies..."
cd "$SETUP_DIR/copy-chief-dashboard/dashboard"
npm install
print_success "Dashboard dependencies installed"

# Create .env.local for dashboard
print_status "Configuring dashboard environment..."
ENV_FILE="$SETUP_DIR/copy-chief-dashboard/dashboard/.env.local"

if [ -f "$ENV_FILE" ]; then
  print_warning "Dashboard .env.local already exists"
else
  cat > "$ENV_FILE" << 'EOF'
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:4001
EOF
  print_success "Created .env.local with WebSocket configuration"
fi

# Create copywriting-ecosystem structure
print_status "Setting up copywriting ecosystem..."

OFFER_DIR="$ECOSYSTEM_DIR/health/slim-control-patch"
mkdir -p "$OFFER_DIR"/{research,briefings,production,swipes,reports}

# Create CONTEXT.md for the offer
if [ ! -f "$OFFER_DIR/CONTEXT.md" ]; then
  cat > "$OFFER_DIR/CONTEXT.md" << 'CONTEXT'
# Slim Control Weight Loss Patch — Offer Context

## Product Overview

**Slim Control** is a transdermal weight loss patch delivering natural appetite suppressants and metabolism boosters through the skin.

### Key Details
- **Type:** Advertorial + VSL → Checkout funnel
- **Niche:** Health & Wellness
- **Sub-niche:** Weight Loss / Women's Health
- **Price Point:** $79-$199 (1-month to 6-month packages)
- **Funnel:** Advertorial → VSL → Sales Page → Checkout
- **Primary Avatar:** Women 30-55, stressed, busy, tired of failed diets

## Mechanism (MUP + MUS)

**MUP (Main Unique Proposition):**
"The Only Weight Loss Patch That Works While You Sleep — No Pills, No Guilt, No Complicated Routines"

**Why it's unique:**
- Transdermal delivery (skin absorption, not ingestion)
- No nausea, no pill fatigue, no digestive upset
- Continuous 24-hour appetite suppression
- Applied only 3x daily (simple routine)
- Works with natural appetite cycles

**MUS (Main Unique Selling Point):**
"47,000+ women lost 10-30 lbs in 8 weeks without dieting — just patch, then forget"

## Target Avatar (Primary)

**Name:** Sarah, 38
- **Income:** $65K-$120K
- **Status:** Married, 2 kids, full-time job
- **Pain Point:** "I've tried EVERYTHING. Keto, gym, shakes. Nothing sticks. I'm exhausted from willpower."
- **Belief:** "My metabolism is broken. I'm destined to be overweight."
- **Desire:** Lose 20-30 lbs, feel confident in photos, have energy for kids
- **Objection:** "Patches don't work. This is probably a scam."
- **Buying Signal:** "If this actually works and I don't have to diet, I'd pay anything"

## Ingredients & Mechanism

- **Green Coffee Bean** (chlorogenic acid): +4% metabolism boost
- **Garcinia Cambogia** (HCA): 30% appetite suppression
- **L-Carnitine**: Efficient fat transport to cells
- **Caffeine**: Thermogenesis (calorie burn)
- **Bioperine**: Nutrient absorption enhancement

**How It Works:**
1. Patch delivers nutrients continuously for 8 hours
2. Applied at natural appetite peaks (8am, 1pm, 6pm)
3. Hunger signals reduced by ~40% within 4 hours
4. Metabolism increases 3-7% throughout application
5. No "stimulant crash" like pills cause

## Marketing Approach

### Advertorial Goal:
Write a 2,000-2,500 word feature-style article that:
- Positions Slim Control as a breakthrough, not a diet
- Tells real story of women who failed at dieting
- Explains the science without being condescending
- Builds emotional trust and relatability
- Includes 3-5 real customer testimonials
- Ends with powerful CTA and 60-day guarantee

### Copy Pillars:
1. **Empathy**: "Most people DON'T fail diets. Dieting fails them."
2. **Mechanism**: "How transdermal delivery beats pills"
3. **Social Proof**: Real weight loss data + testimonials
4. **Risk Reversal**: 60-day money-back guarantee
5. **Urgency**: Limited supply, ingredient sourcing

### Emotional Hooks:
✓ Hope: "Finally, something that actually works"
✓ Relief: "No more diet guilt or willpower battles"
✓ Control: "I'm in charge of my body again"
✓ Belonging: "Join thousands reclaiming their confidence"
✓ Scarcity: "Limited supply due to sourcing"

## Research Focus Areas

**@researcher should investigate:**
1. Weight loss market size for women 30-55
2. Why diet failures happen (psychology + physiology)
3. Transdermal delivery technology adoption rates
4. Competitive landscape (what's available now)
5. Customer pain points (most common objections)
6. Success story patterns (what makes testimonials work)

## Production Deliverables

- **Advertorial**: 2,000-2,500 words (magazine-style feature)
- **VSL Script**: 7-8 minute video (conversational, story-driven)
- **Landing Page**: 5-section structure (problem → solution → proof → objection → CTA)
- **Email Sequence**: 5-email funnel (welcome → story → proof → urgency → close)
- **Ad Creatives**: 50+ variations (static images + video thumbnails)

## Quality Gates

| Gate | Criteria |
|------|----------|
| Research | Market insights + competitor analysis complete |
| Briefing | HELIX 10-phase structure approved |
| Production | Copy meets RMBC scores ≥85 |
| Validation | Blind critique score ≥80, zero major objections |
| Delivery | All files generated, testimonials integrated |

---

**This offer is ready for full pipeline execution.**
CONTEXT
  print_success "Created CONTEXT.md for slim-control-patch offer"
fi

# Create placeholder state files
if [ ! -f "$OFFER_DIR/helix-state.yaml" ]; then
  cat > "$OFFER_DIR/helix-state.yaml" << 'YAML'
offer: slim-control-patch
phase: RESEARCH
status: pending
created_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
phases:
  RESEARCH:
    status: pending
    agents: [researcher, miner]
  STRATEGY:
    status: pending
    agents: [briefer]
  COPY:
    status: pending
    agents: [vsl, lp, creative, producer]
  VALIDATION:
    status: pending
    agents: [critic, gatekeeper]
  DELIVERY:
    status: pending
    agents: [ops]
YAML
  print_success "Created helix-state.yaml"
fi

if [ ! -f "$OFFER_DIR/project_state.yaml" ]; then
  cat > "$OFFER_DIR/project_state.yaml" << 'YAML'
project:
  name: slim-control-patch
  type: advertorial-funnel
  niche: health
  status: initialized
  created_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
deliverables:
  research: pending
  briefing: pending
  advertorial: pending
  vsl: pending
  landing_page: pending
  emails: pending
  creatives: pending
quality_scores:
  digestible: 0
  unique: 0
  probable: 0
  connected: 0
  blind_critic: 0
  emotional_intensity: 0
YAML
  print_success "Created project_state.yaml"
fi

# Summary
print_status "Setup complete! 🎉"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Installation Summary:"
echo ""
echo "  📁 Setup Directory:      $SETUP_DIR"
echo "  📁 Ecosystem Directory:  $ECOSYSTEM_DIR"
echo ""
echo "  📦 Cloned Repositories:"
echo "     • copy-chief-black"
echo "     • copy-chief-dashboard"
echo "     • copywriting-mcp"
echo ""
echo "  ⚙️  Installed Dependencies:"
echo "     • Copy Chief BLACK: npm install ✓"
echo "     • Dashboard: npm install ✓"
echo ""
echo "  📝 Offer Created:"
echo "     • health/slim-control-patch"
echo "     • CONTEXT.md: Product specification"
echo "     • helix-state.yaml: Pipeline state"
echo "     • project_state.yaml: Project state"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Next Step: Run the 3-Terminal System"
echo ""
echo "  TERMINAL 1: Start WebSocket Event Server"
echo "  $ cd $SETUP_DIR/copy-chief-black"
echo "  $ npm run server"
echo ""
echo "  TERMINAL 2: Start Real-Time Dashboard"
echo "  $ cd $SETUP_DIR/copy-chief-dashboard/dashboard"
echo "  $ npm run dev"
echo "  → Open browser: http://localhost:3000"
echo ""
echo "  TERMINAL 3: Launch Claude Code with Agents"
echo "  $ cd $ECOSYSTEM_DIR"
echo "  $ claude"
echo "  → Request: 'Start research for health/slim-control-patch'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
