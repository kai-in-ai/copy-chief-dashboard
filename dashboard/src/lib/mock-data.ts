'use client';

import type { AgentStatus } from '@/stores/agent-store';
import type { OfferStatus } from '@/stores/offer-store';
import type { HelixPhase } from '@/stores/helix-store';
import type { MonitorEvent } from '@/stores/monitor-store';

// ============================================================================
// MOCK AGENTS — 12 Copy Chief personas
// ============================================================================

const AGENT_PERSONAS = [
  { name: 'ATLAS', handle: '@atlas_chief', role: 'Research Lead', color: '#FF6B6B', initial: 'A' },
  { name: 'ECHO', handle: '@echo_strategy', role: 'Strategy Architect', color: '#4ECDC4', initial: 'E' },
  { name: 'PRISM', handle: '@prism_copywriter', role: 'Master Copywriter', color: '#FFE66D', initial: 'P' },
  { name: 'FORGE', handle: '@forge_validator', role: 'Quality Validator', color: '#95E1D3', initial: 'F' },
  { name: 'NOVA', handle: '@nova_producer', role: 'Production Engineer', color: '#F38181', initial: 'N' },
  { name: 'CIPHER', handle: '@cipher_optimizer', role: 'A/B Test Lead', color: '#AA96DA', initial: 'C' },
  { name: 'VOLT', handle: '@volt_executor', role: 'Delivery Specialist', color: '#FCBAD3', initial: 'V' },
  { name: 'LYRA', handle: '@lyra_analyst', role: 'Market Analyst', color: '#A8D8EA', initial: 'L' },
  { name: 'APEX', handle: '@apex_optimizer', role: 'Conversion Expert', color: '#C7CEEA', initial: 'X' },
  { name: 'RUNE', handle: '@rune_researcher', role: 'Deep Research', color: '#FCE38A', initial: 'R' },
  { name: 'SABLE', handle: '@sable_reviewer', role: 'Copy Editor', color: '#95B8D1', initial: 'S' },
  { name: 'THETA', handle: '@theta_orchestrator', role: 'Workflow Lead', color: '#F3A683', initial: 'T' },
];

export function generateMockAgents(): AgentStatus[] {
  return AGENT_PERSONAS.map((p) => ({
    name: p.name,
    handle: p.handle,
    role: p.role,
    color: p.color,
    initial: p.initial,
    status: Math.random() > 0.6 ? 'working' : 'idle',
    current_task: Math.random() > 0.5 ? `Processing offer segment` : null,
    assigned_offer: Math.random() > 0.5 ? `SaaS/WebApp-v${Math.floor(Math.random() * 3) + 1}` : null,
    last_seen: new Date(Date.now() - Math.random() * 600_000).toISOString(),
  }));
}

// ============================================================================
// MOCK OFFERS — Realistic copywriting campaigns at various stages
// ============================================================================

const NICHOS = ['SaaS', 'E-commerce', 'Health', 'Finance', 'RealEstate'];
const OFFER_NAMES = ['WebApp', 'Platform', 'Solution', 'System', 'Suite'];

export function generateMockOffers(): OfferStatus[] {
  const offers: OfferStatus[] = [];
  const phases = ['IDLE', 'RESEARCH', 'BRIEFING', 'PRODUCTION', 'VALIDACAO', 'ENTREGA'];

  for (let i = 0; i < 12; i++) {
    const nicho = NICHOS[i % NICHOS.length];
    const name = `${OFFER_NAMES[i % OFFER_NAMES.length]}-v${Math.floor(i / 5) + 1}`;
    const phaseIdx = Math.floor(Math.random() * phases.length);
    const phase = phases[phaseIdx];

    offers.push({
      name,
      nicho,
      status: Math.random() > 0.2 ? 'active' : 'standby',
      phase,
      mecanismo_state: `${phase}_ongoing`,
      production_count: Math.floor(Math.random() * 50) + 5,
      deliverables: {
        vsl: Math.floor(Math.random() * 15) + 1,
        lp: Math.floor(Math.random() * 20) + 2,
        criativos: Math.floor(Math.random() * 100) + 10,
        emails: Math.floor(Math.random() * 30) + 3,
      },
      active_agent: AGENT_PERSONAS[i % AGENT_PERSONAS.length]?.name || null,
      last_activity: Date.now() - Math.random() * 1_800_000,
      avg_quality: Math.random() * 2 + 7.5,
      rmbc: {
        digerivel: Math.random() * 40 + 60,
        unico: Math.random() * 30 + 50,
        provavel: Math.random() * 35 + 55,
        conectado: Math.random() * 35 + 55,
      },
      blind_critic_score: Math.random() * 2 + 7,
      est_score: Math.random() * 15 + 75,
    });
  }

  return offers;
}

// ============================================================================
// MOCK HELIX PHASES
// ============================================================================

export function generateMockHelixPhases(): HelixPhase[] {
  const phases = ['RESEARCH', 'STRATEGY', 'COPY', 'VALIDATION', 'DELIVERY'];

  const now = Date.now();
  let runningTime = now - 120_000;

  return phases.map((name, idx) => {
    const duration = 20_000 + Math.random() * 30_000;
    const endTime = runningTime + duration;
    const status: 'pending' | 'active' | 'passed' | 'failed' =
      idx === 0 ? 'active' : idx === 0 ? 'passed' : 'pending';

    const phase: HelixPhase = {
      name,
      status,
      started_at: new Date(runningTime).toISOString(),
      completed_at: status === 'passed' ? new Date(endTime).toISOString() : null,
      tools_used:
        Math.random() > 0.5
          ? ['web_search', 'doc_analyzer', 'market_validator']
          : [],
      tools_missing: idx > 0 && Math.random() > 0.7 ? ['competitor_analyzer'] : [],
    };

    runningTime = endTime;
    return phase;
  });
}

// ============================================================================
// MOCK MONITOR EVENTS
// ============================================================================

const VERBS = [
  'analyzed',
  'researched',
  'validated',
  'optimized',
  'generated',
  'reviewed',
  'processed',
  'discovered',
];

const OBJECTS = [
  'market research',
  'copywriting strategy',
  'target audience',
  'value proposition',
  'competitive landscape',
  'buyer avatar',
  'pain points',
  'offer positioning',
];

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createSemanticData(
  agentName: string,
  verb: string,
  obj: string,
  offer: string | null,
) {
  const agent = AGENT_PERSONAS.find((a) => a.name === agentName);
  return {
    agent_name: agentName,
    agent_color: agent?.color || '#666',
    agent_initial: agent?.initial || '?',
    verb,
    object: obj,
    offer_short: offer ? offer.split('/')[1] : null,
  };
}

export function generateMockMonitorEvents(count: number = 150): MonitorEvent[] {
  const events: MonitorEvent[] = [];
  const offers = generateMockOffers();

  for (let i = 0; i < count; i++) {
    const agent =
      AGENT_PERSONAS[Math.floor(Math.random() * AGENT_PERSONAS.length)];
    const offer = offers[Math.floor(Math.random() * offers.length)];
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const object = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];

    const timestamp = Date.now() - (count - i) * 5000;

    const eventType = Math.random();
    let event: MonitorEvent;

    if (eventType < 0.4) {
      event = {
        id: generateEventId(),
        type: 'PreToolUse',
        timestamp,
        session_id: `session_${Math.floor(i / 20)}`,
        tool_name: [
          'web_search',
          'competitor_analyzer',
          'market_validator',
        ][Math.floor(Math.random() * 3)],
        offer: `${offer.nicho}/${offer.name}`,
        phase: offer.phase,
        semantic_description: `${agent.name} is ${verb} ${object}`,
        significance: 'significant',
        semantic_data: createSemanticData(
          agent.name,
          verb,
          object,
          `${offer.nicho}/${offer.name}`,
        ),
      };
    } else if (eventType < 0.7) {
      event = {
        id: generateEventId(),
        type: 'PostToolUse',
        timestamp,
        session_id: `session_${Math.floor(i / 20)}`,
        tool_name: [
          'web_search',
          'competitor_analyzer',
          'market_validator',
        ][Math.floor(Math.random() * 3)],
        tool_result: `Successfully ${verb} ${object}`,
        is_error: Math.random() > 0.95,
        offer: `${offer.nicho}/${offer.name}`,
        phase: offer.phase,
        semantic_description: `${agent.name} ${verb} ${object}`,
        significance: Math.random() > 0.7 ? 'milestone' : 'significant',
        semantic_data: createSemanticData(
          agent.name,
          verb,
          object,
          `${offer.nicho}/${offer.name}`,
        ),
      };
    } else {
      const phases = [
        'RESEARCH',
        'STRATEGY',
        'COPY',
        'VALIDATION',
        'DELIVERY',
      ];
      const oldPhase = phases[Math.floor(Math.random() * phases.length)];
      const newPhase =
        phases[(phases.indexOf(oldPhase) + 1) % phases.length];

      event = {
        id: generateEventId(),
        type: 'PhaseTransition',
        timestamp,
        session_id: `session_${Math.floor(i / 20)}`,
        offer: `${offer.nicho}/${offer.name}`,
        phase: newPhase,
        data: {
          from_phase: oldPhase,
          to_phase: newPhase,
          gates_passed: 3,
        },
        semantic_description: `${offer.name} moved from ${oldPhase} to ${newPhase}`,
        significance: 'milestone',
        semantic_data: createSemanticData(
          agent.name,
          'advanced',
          `through ${newPhase}`,
          `${offer.nicho}/${offer.name}`,
        ),
      };
    }

    events.push(event);
  }

  return events.sort((a, b) => b.timestamp - a.timestamp);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export interface MockDataState {
  agents: AgentStatus[];
  offers: OfferStatus[];
  helixPhases: HelixPhase[];
  monitorEvents: MonitorEvent[];
}

export function generateAllMockData(): MockDataState {
  return {
    agents: generateMockAgents(),
    offers: generateMockOffers(),
    helixPhases: generateMockHelixPhases(),
    monitorEvents: generateMockMonitorEvents(200),
  };
}
