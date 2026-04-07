# MCP Tools Quick Reference

**Copywriting MCP Plugin v2.0** — Complete tool guide with examples

---

## 1. VOC_SEARCH

**Purpose:** Find Voice of Customer quotes by emotion, intensity, niche

**Signature:**
```
voc_search(
  emotion: string,        // "frustração", "medo", "culpa", etc
  nicho: string,          // "concursos", "fitness", "relacionamentos"
  min_intensity?: 1-5,    // 1=mild, 5=intense
  limit?: number          // default 10
)
```

**Example:**
```
voc_search(emotion="medo", nicho="fitness", min_intensity=4)
```

**Returns:**
```yaml
quotes:
  - text: "I'm terrified I'll invest months and still not see results"
    intensity: 5
    source: YouTube comment / Reddit / Review
    context: "Customer on fitness transformation journey"
    emotion_tag: fear
    embedding: [0.124, 0.556, ...]  # For semantic search
```

**When to use:** Phase 1 (RESEARCH) — extract avatar emotional pain points

**Related:** `semantic_memory_search` (broader context)

---

## 2. GET_PHASE_CONTEXT

**Purpose:** Load HELIX phase context with templates, examples, constraints

**Signature:**
```
get_phase_context(
  phase: 1-10,            // Which HELIX phase
  offer_path: string      // ~/copywriting-ecosystem/niche/offer/
)
```

**Example:**
```
get_phase_context(phase=5, offer_path="fitness/transformation-90-days")
```

**Returns:**
```yaml
phase: 5
name: "MUP Divergent Generation"
instructions: |
  FASE 5A (Divergent):
  Generate 15+ Unique Mechanisms (MUP candidates)
  No evaluation yet — quantity over quality
  ...
context_files:
  - synthesis.md          # From RESEARCH phase
  - avatar-summary.md     # From PHASE 4
templates:
  - mup-mus-discovery.md  # Mandatory load
constraints:
  - "Each MUP must be novel"
  - "Avoid competitor mechanisms"
  - "ET: OFF (divergent phase)"
examples:
  - mup: "Specific daily routine that forces metabolic shift"
  - mup: "Supplement timing window (15-min threshold)"
```

**When to use:** Start of each phase (1-10) — load instructions + templates

**Related:** All phases reference their context

---

## 3. VALIDATE_GATE

**Purpose:** Enforce phase transitions. Blocking checkpoint.

**Signature:**
```
validate_gate(
  gate_type: "research" | "briefing" | "production" | "black",
  offer_path: string,
  include_details?: boolean  // Show specific issues
)
```

**Example - Research Gate:**
```
validate_gate(gate_type="research", offer_path="fitness/transform")
```

**Returns (if PASSED):**
```yaml
gate: research
verdict: PASSED
checks:
  - synthesis.md exists: ✅
  - confidence_score: 78%  (>=70%)
  - quote_count: 67  (>=50)
  - summaries_count: 4  (==4)
message: "Research complete. Proceeding to BRIEFING."
```

**Returns (if FAILED):**
```yaml
gate: research
verdict: FAILED
failed_checks:
  - synthesis.md exists: ❌ File missing
  - quote_count: 12  (need >=50)
details:
  - "Missing VOC from Instagram analysis"
  - "Confidence <70% in avatar definition"
message: "Cannot proceed. Complete research module gaps."
```

**Example - Production Gate:**
```
validate_gate(gate_type="production", offer_path="fitness/transform")
```

**Returns:**
```yaml
gate: production
verdict: PASSED
checks:
  - vsl_delivered: ✅  (6 chapters)
  - lp_delivered: ✅   (14 blocks)
  - creatives_count: 47  (>=40)
  - emails_count: 5  (>=3)
  - quality_avg: 7.8  (>=7.0)
message: "All deliverables complete. Ready for validation."
```

**Example - BLACK Gate (final):**
```
validate_gate(gate_type="black", offer_path="fitness/transform")
```

**Returns:**
```yaml
gate: black
verdict: PASSED
six_gates:
  - fear_first: ✅  STAND
  - mechanism_integrity: ✅  STAND
  - avatar_alignment: ✅  STAND
  - proof_sufficiency: ✅  STAND
  - copy_integrity: ✅  STAND
  - cta_clarity: ✅  STAND
message: "All BLACK gates passed. Ready for delivery."
```

**CRITICAL:** If any gate FAILs, Claude CANNOT proceed. No exceptions.

**When to use:**
- After RESEARCH complete → validate_gate(research)
- After MUP defined → Part of copy-critic validation
- After MUS defined → Part of copy-critic validation
- After PRODUCTION complete → validate_gate(production)
- Before DELIVERY → validate_gate(black)

---

## 4. BLIND_CRITIC

**Purpose:** Evaluate copy without context. Detect AI patterns + weakness.

**Signature:**
```
blind_critic(
  copy: string,           // The copy text to evaluate
  copy_type: "vsl" | "lp" | "creative" | "email" | "hook",
  offer_id: string        // For context (optional, may not use)
)
```

**Example:**
```
blind_critic(
  copy="I'm terrified...[full VSL chapter 1]",
  copy_type="vsl"
)
```

**Returns:**
```yaml
verdict: NEEDS_REVISION
score: 6.2/10
dimensions:
  clarity: 8/10
    note: "Clear message, easy to follow"
  dre: 5/10
    note: "Fear present but not escalated to identity level"
    issue: "Lacks visceral description of cost of inaction"
  believability: 7/10
    note: "Claims supported but lack specific proof"
  flow: 8/10
    note: "Good momentum, smooth transitions"
  specificity: 4/10
    issue: "Generic benefit language. Could apply to 10 different products"
    example: "Replace 'better results' with specific metric"
ai_patterns_detected:
  - "Imagine..." used twice (once is ok, twice is AI)
  - Sentence length uniform (avg 18 words)
  - Adverb stacking: "incredibly, absolutely, truly"
  - Hedge words: "may", "might"
red_flags: 5
penalty: -0.5  # Each flag beyond 2 = -0.5

specific_fixes:
  - DRE: Add visceral description of problem (sensory + emotional)
  - Specificity: Replace generic terms with numbers/names
  - AI patterns: Vary sentence length. Remove "imagine" second usage.

recommendation: "Revision needed. Address DRE escalation and specificity."
```

**When to use:**
- Post-production for each deliverable
- Before copy-critic final validation
- To detect homogenization before it gets to reader

**Related:** `emotional_stress_test` (emotion-specific), `black_validation` (final gate)

---

## 5. EMOTIONAL_STRESS_TEST

**Purpose:** Deep-dive DRE validation. 5 specific stress tests.

**Signature:**
```
emotional_stress_test(
  copy: string,
  copy_type: "vsl" | "lp" | "creative" | "email",
  nicho: string           // For avatar context
)
```

**Example:**
```
emotional_stress_test(
  copy="[VSL chapter]",
  copy_type="vsl",
  nicho="fitness"
)
```

**Returns:**
```yaml
dre_analysis:
  identified_dre: "FEAR (of wasted time/effort)"
  escalation_levels:
    level_1_surface: "I might not see results"
      examples_in_copy:
        - "Previous programs failed for most people"
    level_2_relational: "People will judge me if I fail again"
      examples_in_copy:
        - Missing — NOT escalated this far
    level_3_identity: "I'm the type who can't stick to fitness"
    level_4_existential: "My life is wasted without health"
    level_5_transcendent: "I can't be the person I'm meant to be"

five_stress_tests:
  test_1_genericness:
    question: "Could this copy work for 5 other niches?"
    assessment: "FAIL — Yes, exact same copy works for productivity app"
    score: 2/10
    issue: "No specific mechanism mentioned. Generic result promise."
  
  test_2_fear_hierarchy:
    question: "Does it escalate from surface fear (level 1) to deeper?"
    assessment: "PARTIAL — Only reaches level 2"
    score: 5/10
    issue: "Stops at relational fear. Doesn't reach identity/existential."
  
  test_3_visceral_activation:
    question: "Can reader FEEL it in their body?"
    assessment: "WEAK — Intellectual only"
    score: 3/10
    examples_missing:
      - Sensory language (touch, sight, taste)
      - Somatic descriptions (chest tightness, stomach knot)
      - Temporal urgency (clock ticking language)
  
  test_4_scroll_stop:
    question: "Does any sentence make reader pause/re-read?"
    assessment: "No standout lines"
    score: 4/10
    issue: "Smooth but forgettable. Nothing surprising."
  
  test_5_social_proof:
    question: "Does proof amplify the emotional claim?"
    assessment: "Proof present but disconnected from DRE"
    score: 6/10
    issue: "Stats don't prove the emotional transformation"

overall_dre_score: 4.0/10
recommendation: "DRE activation insufficient. Rewrite with visceral, escalated fear."
```

**When to use:**
- After DRE-critical copy (VSL, landing page)
- When blind_critic flags low DRE score
- Before final validation

**Related:** `blind_critic` (broader evaluation), `black_validation` (final gate)

---

## 6. WRITE_CHAPTER

**Purpose:** Structured chapter writing with template + validation.

**Signature:**
```
write_chapter(
  chapter: 1-10,          // Which HELIX chapter
  offer_path: string,     // ~/copywriting-ecosystem/niche/offer/
  model?: "sonnet" | "opus"  // Default: per framework rules
)
```

**Example:**
```
write_chapter(
  chapter=1,
  offer_path="fitness/transformation-90-days"
)
```

**Returns:**
```yaml
chapter: 1
title: "The Core Problem (Fear Activation)"
instruction: |
  CHAPTER 1 (Stefan Georgi RMBC-II):
  Establish the problem viscerally.
  Activate the primary DRE.
  Show why the reader is stuck.

template_loaded: rmbc-ii-workflow.md
mechanism_context: |
  MUP: "Specific daily 12-minute routine + supplement timing window"
  MUS: "Metabolic reset (metabolic rate increase + fat lock-out)"

constraints:
  - Fear-first methodology
  - NO solution yet (only problem escalation)
  - Escalate from level 1 (surface) toward level 3 (identity)
  - 800-1200 words for VSL chapter 1

generated_chapter: |
  [Generated text — 1100 words, visceral problem description]
  
validation:
  dre_score: 7/10
  specificity_score: 8/10
  flow_score: 8/10
  verdict: STAND ✅

output_file: "{offer}/production/vsl/chapter-01-problem.md"
```

**When to use:**
- PRODUCTION phase for each VSL chapter
- Template enforces structure + methodology

---

## 7. LAYERED_REVIEW

**Purpose:** Review copy in 3 functional layers.

**Signature:**
```
layered_review(
  copy: string,
  layer: 1 | 2 | 3,
  copy_type: "vsl" | "lp" | "creative" | "email"
)
```

**Layers:**
- **Layer 1:** Emotional/DRE impact. Does it activate the fear?
- **Layer 2:** Logical/mechanism clarity. Does the reader understand HOW it works?
- **Layer 3:** Action/CTA clarity. Does reader know what to do next?

**Example:**
```
layered_review(
  copy="[VSL chapter]",
  layer=1,
  copy_type="vsl"
)
```

**Returns (Layer 1):**
```yaml
layer: 1
focus: "Emotional/DRE Impact"
analysis:
  dre_activated: true
  dre_identified: "FEAR (wasted time)"
  escalation: "Level 1-2 (surface → relational)"
  visceral_language: "Some present (clock ticking, judgment fear)"
  intensity: 6/10
feedback:
  strengths:
    - "Specific situation described (3 failed programs)"
    - "Reader pain acknowledged"
  gaps:
    - "Could amplify identity-level fear"
    - "Missing existential consequence"
verdict: "ACCEPTABLE but room for depth"
```

**When to use:**
- Diagnostic for specific weaknesses
- Layer 1 → fix DRE issues
- Layer 2 → fix mechanism clarity
- Layer 3 → fix CTA clarity

---

## 8. BLACK_VALIDATION

**Purpose:** Final 6-gate validation before delivery.

**Signature:**
```
black_validation(
  copy: string | offer_path: string,
  copy_type: "vsl" | "lp" | "creative" | "email",
  offer_path: string
)
```

**Example:**
```
black_validation(
  copy="[full VSL or file path]",
  copy_type="vsl",
  offer_path="fitness/transformation"
)
```

**Returns:**
```yaml
validation: black_six_gates
verdict: STAND ✅

gate_1_fear_first:
  check: "Is DRE activated, not just functional?"
  result: ✅ PASS
  score: 8/10
  notes: "Fear of wasted time clearly escalated through 3 levels"

gate_2_mechanism_integrity:
  check: "Is MUP/MUS clearly connected throughout?"
  result: ✅ PASS
  score: 9/10
  notes: "12-min routine mentioned 7 times, metabolic reset woven throughout"

gate_3_avatar_alignment:
  check: "Are specific avatar pain points addressed?"
  result: ✅ PASS
  score: 7/10
  notes: "Addresses time-poor transformation seeker. Could add more to busy parent."

gate_4_proof_sufficiency:
  check: "Are claims backed (science/social/authority)?"
  result: ✅ PASS
  score: 7/10
  notes: "3 studies cited, 2 testimonials, expert mention. Adequate."

gate_5_copy_integrity:
  check: "No AI homogenization? Personality intact?"
  result: ✅ PASS (with penalty)
  score: 6/10
  ai_red_flags: 2
    - "Imagine..." used twice
    - Slight adverb stacking
  penalty: -0.5 (minor)
  notes: "Mostly clean. 1-2 rewrites suggested for AI pattern removal."

gate_6_cta_clarity:
  check: "Is next step unmistakable?"
  result: ✅ PASS
  score: 8/10
  notes: "Clear CTA: 'Click below to claim your spot in the 90-day protocol'"

overall_black_score: 7.5/10
final_verdict: STAND ✅

recommendation: "Approved for delivery. Minor AI pattern cleanup optional."
```

**CRITICAL:** All 6 gates must PASS. Any FAIL → NEEDS_REVISION

**When to use:**
- FINAL validation before delivery
- Only after all other validations pass
- Last gate before commit to git

---

## 9. MECANISMO_UNICO

**Purpose:** Define + validate offer's unique mechanism (MUP + MUS).

**Signature:**
```
mecanismo_unico(
  offer_path: string,
  mup_statement?: string,  // Optional: pre-defined MUP
  mus_statement?: string   // Optional: pre-defined MUS
)
```

**Example:**
```
mecanismo_unico(
  offer_path="fitness/transformation",
  mup_statement="Specific 12-minute daily routine that forces metabolic shift",
  mus_statement="Metabolic reset through timing window that locks fat stores"
)
```

**Returns:**
```yaml
offer: fitness/transformation
mechanism_summary: |
  MUP: Specific 12-min routine + supplement timing window
  MUS: Metabolic reset (rate increase + fat lock-out)
  
  Connection: The routine *triggers* the metabolic reset
  Uniqueness: Timing window is NOT offered by competitors
  Proof: Study from [institution], testimonials from [expert]

components:
  mup:
    statement: "Specific 12-minute daily routine that forces metabolic shift"
    specificity: 9/10
    novelty: 8/10 (timing aspect is novel)
    credibility: 7/10 (backed by mechanism study)
    
  mus:
    statement: "Metabolic reset through timing window that locks fat stores"
    specificity: 9/10
    mirror_to_mup: 9/10 (timing is central to both)
    proof_connection: 8/10

validation:
  mup_mus_mirror: ✅ STAND
    note: "Timing window *is* the mechanism"
  
  differentiation: ✅ STAND
    note: "Competitors offer routines but not metabolic-timing specificity"
  
  proof_sufficiency: ⚠️ ACCEPTABLE
    note: "2 studies, 5 testimonials. Could add 1 more authority."

output_file: "{offer}/briefings/mecanismo-unico.yaml"
verdict: STAND ✅
```

**When to use:**
- After MUP/MUS defined (phases 5-6)
- Before production begins
- To verify mechanism clarity for all producers

---

## 10. SEMANTIC_MEMORY_SEARCH

**Purpose:** Context injection via embeddings. Find relevant memories.

**Signature:**
```
semantic_memory_search(
  query: string,
  context_type: "voc" | "swipes" | "competitors" | "helix" | "validation",
  limit?: number
)
```

**Example:**
```
semantic_memory_search(
  query="fear of wasted time and money on fitness programs",
  context_type="voc",
  limit=5
)
```

**Returns:**
```yaml
query: "fear of wasted time..."
context_type: voc
results:
  - quote: "I'm terrified I'll invest months and still not see results"
    similarity: 0.94
    intensity: 5
    source: YouTube comments (fitness niche)
    
  - quote: "Previous programs failed — I've spent $5K and have nothing"
    similarity: 0.89
    intensity: 5
    source: Reddit (r/fitness)
    
  - quote: "Every time I start, I make it 2 weeks then quit"
    similarity: 0.86
    intensity: 4
    source: Customer reviews

emotional_profile:
  primary_fear: Wasted investment (time + money)
  intensity_range: 4-5
  avatar_type: "Busy professional, budget-conscious, repeat-failure history"
```

**When to use:**
- During briefing to understand avatar emotions
- During production to inject authentic voice
- To maintain VOC consistency across documents

---

## RULES & CONSTRAINTS

### When to Call Which Tool

| Phase | Tool | Why |
|-------|------|-----|
| RESEARCH (1) | `voc_search`, `semantic_memory_search` | Extract authentic voices |
| BRIEFING (2-6) | `get_phase_context`, `mecanismo_unico` | Load structure + validate mechanism |
| MUP/MUS (5-6) | `copy-critic` (not MCP) | Agent-based validation |
| PRODUCTION (7-10) | `get_phase_context`, `write_chapter` | Templates + structured writing |
| VALIDATION | `blind_critic`, `emotional_stress_test`, `layered_review` | Evaluate each dimension |
| FINAL DELIVERY | `black_validation` | 6-gate final checkpoint |

### Gate Progression

```
RESEARCH GATE MUST PASS ← validate_gate(research)
     ↓
BRIEFING GATE (implicit in phase completion)
     ↓
PRODUCTION GATE MUST PASS ← validate_gate(production)
     ↓
VALIDATION (copy-critic internal, not MCP)
     ↓
BLACK GATE MUST PASS ← black_validation()
     ↓
DELIVERY (ops agent commits to git)
```

### Critical Rules

1. **No tool call = incomplete phase** — Always call appropriate MCP tool before advancing
2. **Gate FAIL = STOP** — Cannot proceed without PASS verdict
3. **Blind critic ≠ producer** — Different agents/models evaluate vs produce
4. **Template evidence required** — Every deliverable must cite template used

---

**MCP Plugin Version:** 2.0.0  
**Framework:** Copy Chief BLACK v6.4  
**Last Updated:** 2026-04-07
