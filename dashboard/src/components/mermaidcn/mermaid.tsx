"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mermaidThemes, type MermaidCustomTheme } from "@/lib/mermaid-themes";

export type MermaidBuiltinTheme = "default" | "dark" | "forest" | "neutral" | "base";
export type MermaidTheme = MermaidBuiltinTheme | MermaidCustomTheme;

const BUILTIN_THEMES = new Set<string>(["default", "dark", "forest", "neutral", "base"]);

export interface MermaidConfig {
  theme?: MermaidTheme;
  darkMode?: boolean;
  look?: "classic" | "handdrawn";
  themeVariables?: Record<string, string>;
  flowchart?: { curve?: "linear" | "cardinal"; padding?: number; htmlLabels?: boolean };
  fontFamily?: string;
  fontSize?: number;
}

export interface MermaidProps {
  chart: string;
  config?: MermaidConfig;
  className?: string;
  onError?: (error: string) => void;
  debounceTime?: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function Mermaid({ chart, config, className, onError, debounceTime = 300 }: MermaidProps) {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const id = React.useId().replace(/:/g, "");
  const renderRef = React.useRef<HTMLDivElement>(null);
  const debouncedChart = useDebounce(chart, debounceTime);
  const configString = React.useMemo(() => JSON.stringify(config ?? {}), [config]);

  React.useEffect(() => {
    if (!debouncedChart.trim()) { setStatus("idle"); setSvg(null); setError(null); return; }
    let isCancelled = false;

    const render = async () => {
      setStatus("loading");
      setError(null);
      try {
        const mermaid = (await import("mermaid")).default;
        if (isCancelled) return;

        const parsedConfig: MermaidConfig = JSON.parse(configString);
        const isCustomTheme = parsedConfig.theme && !BUILTIN_THEMES.has(parsedConfig.theme);
        const resolvedThemeVars = isCustomTheme
          ? { ...mermaidThemes[parsedConfig.theme as MermaidCustomTheme], ...parsedConfig.themeVariables }
          : parsedConfig.themeVariables;
        const resolvedMermaidTheme = isCustomTheme ? "base"
          : (parsedConfig.theme as MermaidBuiltinTheme) || (parsedConfig.darkMode ? "dark" : "dark");

        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedMermaidTheme,
          themeVariables: resolvedThemeVars,
          flowchart: { htmlLabels: parsedConfig.flowchart?.htmlLabels ?? true },
          fontFamily: parsedConfig.fontFamily ?? "JetBrains Mono, monospace",
          fontSize: parsedConfig.fontSize ?? 12,
          logLevel: "error" as const,
          securityLevel: "loose",
        });

        if (!renderRef.current) return;
        renderRef.current.innerHTML = "";
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg: svgOutput } = await mermaid.render(uniqueId, debouncedChart.trim(), renderRef.current);
        if (!isCancelled) { setSvg(svgOutput); setStatus("success"); renderRef.current.innerHTML = ""; }
      } catch (err) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Failed to render diagram";
          setError(message);
          setStatus("error");
          setSvg(null);
          onError?.(message);
        }
      }
    };
    render();
    return () => { isCancelled = true; };
  }, [debouncedChart, configString, id, onError]);

  return (
    <div className={cn("relative w-full min-h-[100px]", className)}>
      {status === "success" && svg && (
        <div
          className="flex items-center justify-center w-full h-full overflow-auto [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
          role="img"
          aria-label="Mermaid diagram"
        />
      )}
      <div ref={renderRef} className="absolute inset-0 invisible -z-50 w-full h-full pointer-events-none overflow-hidden" aria-hidden="true" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono text-[var(--hud-text-dim)] animate-pulse">Rendering...</span>
        </div>
      )}
      {status === "error" && error && (
        <div className="flex items-center justify-center w-full p-4 border border-red-500/20 bg-red-500/5 rounded">
          <code className="text-[10px] text-red-400 font-mono">{error.split("\n")[0]}</code>
        </div>
      )}
      {status === "idle" && (
        <div className="flex items-center justify-center w-full h-full min-h-[100px] border border-dashed border-[var(--hud-border)] rounded">
          <p className="text-xs font-mono text-[var(--hud-text-dim)]">No diagram</p>
        </div>
      )}
    </div>
  );
}
