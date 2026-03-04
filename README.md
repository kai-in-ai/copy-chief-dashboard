<p align="center">
  <h1 align="center">Copy Chief Dashboard</h1>
  <p align="center">
    <strong>Dashboard visual em tempo real para o Copy Chief BLACK</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19-blue" alt="React">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </p>
</p>

---

## O que e

Dashboard Next.js que observa e visualiza o pipeline do Copy Chief BLACK em tempo real. **Nunca controla, apenas observa.** O framework funciona 100% sem o dashboard.

### Instalacao

```bash
npx @lucapimenta/copy-chief-dashboard install
```

## Funcionalidades

- **Pipeline View** — Visualiza o estado do pipeline (Research → Briefing → Production → Delivery)
- **Kanban Board** — Drag-and-drop de tarefas por fase
- **HELIX Viewer** — Visualiza as 10 fases do briefing HELIX
- **War Room** — Monitoramento em tempo real de agents ativos
- **Agent Activity** — Timeline de atividade dos 12 agentes
- **Quality Gates** — Status dos gates MCP
- **Offer Overview** — Dashboard por oferta
- **Squad Panel** — Visao geral da Copy Squad

## Paginas

| Pagina | Rota | Descricao |
|--------|------|-----------|
| Dashboard | `/` | Overview geral |
| Pipeline | `/pipeline` | Pipeline por oferta |
| Kanban | `/kanban` | Board de tarefas |
| HELIX | `/helix` | Briefing viewer |
| War Room | `/warroom` | Agents em tempo real |
| Agents | `/agents` | Lista de agentes |
| Gates | `/gates` | Quality gates |
| Offers | `/offers` | Lista de ofertas |
| Settings | `/settings` | Configuracoes |
| Logs | `/logs` | Session logs |
| Timeline | `/timeline` | Activity timeline |

## Arquitetura

```
~/.claude/dashboard-v2/
  src/
    app/                    11 paginas (Next.js App Router)
    components/             40+ componentes React
    stores/                 10 Zustand stores
    lib/                    Utilitarios
  public/
  next.config.js
  tailwind.config.js
  package.json
```

## Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS 4
- **State:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React

## Instalacao Manual

```bash
# 1. Clone
git clone https://github.com/lckx777/copy-chief-dashboard.git
cd copy-chief-dashboard

# 2. Instale deps do dashboard
cd dashboard && npm install

# 3. Rode em dev
npm run dev
# -> http://localhost:3000

# 4. Ou build + start
npm run build && npm start
```

## Requisitos

- Copy Chief BLACK instalado (`npx @lucapimenta/copy-chief-black install`)
- Node.js >= 18

## Pacotes Relacionados

| Pacote | Descricao |
|--------|-----------|
| [`@lucapimenta/copy-chief-black`](https://github.com/lckx777/copy-chief-black) | Core framework (obrigatorio) |
| [`@lucapimenta/copywriting-mcp`](https://github.com/lckx777/copywriting-mcp) | MCP server (quality gates) |

## Licenca

MIT — [LICENSE](./LICENSE)
