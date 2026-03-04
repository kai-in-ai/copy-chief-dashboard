'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, Columns3, GitBranch, Users, TrendingUp, Play, Link2,
  Bot, Terminal, FileCode, Settings, Github, Map, Shield,
  PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { PendingBadge } from '@/components/clickup/PendingBadge';

const NAV_ITEMS = [
  { href: '/warroom', label: 'War Room', icon: Shield },
  { href: '/monitor', label: 'Monitor', icon: Activity },
  { href: '/kanban', label: 'Kanban', icon: Columns3 },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/terminals', label: 'Terminals', icon: Terminal },
  { href: '/helix', label: 'HELIX', icon: GitBranch },
  { href: '/pipeline', label: 'Pipeline', icon: Play },
  { href: '/context', label: 'Context', icon: FileCode },
  { href: '/squad', label: 'Squad', icon: Users },
  { href: '/insights', label: 'Insights', icon: TrendingUp },
  { href: '/github', label: 'GitHub', icon: Github },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/clickup', label: 'ClickUp', icon: Link2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-[var(--hud-border)] bg-[var(--hud-bg)] transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-52'
      )}
    >
      <div className="flex items-center justify-between px-3 py-4 border-b border-[var(--hud-border)]">
        {!sidebarCollapsed && (
          <span className="text-xs font-mono text-[var(--hud-accent)] tracking-widest uppercase">
            Copy Chief
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-[var(--hud-surface)] text-[var(--hud-text-dim)] hover:text-[var(--hud-text)]"
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 text-sm font-mono transition-colors',
                active
                  ? 'text-[var(--hud-accent)] bg-[var(--hud-accent)]/10 border-r-2 border-[var(--hud-accent)]'
                  : 'text-[var(--hud-text-dim)] hover:text-[var(--hud-text)] hover:bg-[var(--hud-surface)]'
              )}
            >
              <Icon size={16} />
              {!sidebarCollapsed && (
                <span className="flex items-center gap-2">
                  {label}
                  {label === 'ClickUp' && <PendingBadge />}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[var(--hud-border)]">
        {!sidebarCollapsed && (
          <p className="text-[10px] font-mono text-[var(--hud-text-dim)] opacity-50">
            BLACK v10.5
          </p>
        )}
      </div>
    </aside>
  );
}
