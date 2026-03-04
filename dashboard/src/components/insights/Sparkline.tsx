'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SparklinePoint {
  date: string;
  value: number;
}

interface SparklineProps {
  data: SparklinePoint[];
  threshold?: number;
  color?: string;
  thresholdColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  threshold,
  color = '#f59e0b',
  thresholdColor = '#10b981',
  width = 200,
  height = 40,
  className,
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const values = data.map((d) => d.value);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 10);
    const range = max - min || 1;
    const padding = 2;

    const toX = (i: number) => padding + (i / (data.length - 1)) * (width - padding * 2);
    const toY = (v: number) => height - padding - ((v - min) / range) * (height - padding * 2);

    // Threshold line
    if (threshold !== undefined) {
      ctx.beginPath();
      ctx.strokeStyle = thresholdColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const y = toY(threshold);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Data line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (let i = 0; i < data.length; i++) {
      const x = toX(i);
      const y = toY(values[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill under the line
    ctx.lineTo(toX(data.length - 1), height);
    ctx.lineTo(toX(0), height);
    ctx.closePath();
    ctx.fillStyle = `${color}15`;
    ctx.fill();

    // Dots at start and end
    for (const i of [0, data.length - 1]) {
      ctx.beginPath();
      ctx.arc(toX(i), toY(values[i]), 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }, [data, threshold, color, thresholdColor, width, height]);

  if (data.length < 2) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ width, height }}>
        <span className="text-[10px] font-mono text-[var(--hud-text-dim)]">No data</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
    />
  );
}
