'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMonitorStore, type MonitorEvent } from '@/stores/monitor-store';

const WS_URL = 'ws://localhost:4001/stream';
const MAX_RECONNECT_DELAY = 30_000;
const PING_INTERVAL = 30_000;
const MAX_RECONNECT_ATTEMPTS = 10;

export function useMonitorEvents() {
  const { addEvent, addEvents, setConnected } = useMonitorStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pingTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        reconnectAttempts.current = 0;
        // Start ping/pong keepalive
        if (pingTimer.current) clearInterval(pingTimer.current);
        pingTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, PING_INTERVAL);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Ignore pong responses from keepalive
          if (data.type === 'pong') return;
          if (data.type === 'init' && Array.isArray(data.events)) {
            const mapped = data.events.map((e: Record<string, unknown>) => ({
              id: (e.id as string) || `${Date.now()}-${Math.random()}`,
              type: (e.type as string) || 'unknown',
              timestamp: (e.timestamp as number) || Date.now(),
              session_id: (e.session_id as string) || '',
              tool_name: e.tool_name as string | undefined,
              tool_input: e.tool_input as Record<string, unknown> | undefined,
              tool_result: e.tool_result as string | undefined,
              is_error: e.is_error as boolean | undefined,
              offer: e.offer as string | undefined,
              phase: e.phase as string | undefined,
              data: e.data as Record<string, unknown> | undefined,
              semantic_description: e.semantic_description as string | undefined,
              significance: e.significance as 'milestone' | 'significant' | 'noise' | undefined,
              semantic_data: e.semantic_data as MonitorEvent['semantic_data'] | undefined,
            }));
            addEvents(mapped);
          } else if (data.type === 'event' && data.payload) {
            addEvent({
              id: data.payload.id || `${Date.now()}-${Math.random()}`,
              type: data.payload.type || 'unknown',
              timestamp: data.payload.timestamp || Date.now(),
              session_id: data.payload.session_id || '',
              tool_name: data.payload.tool_name,
              tool_input: data.payload.tool_input,
              tool_result: data.payload.tool_result,
              is_error: data.payload.is_error,
              offer: data.payload.offer,
              phase: data.payload.phase,
              data: data.payload.data,
              semantic_description: data.payload.semantic_description,
              significance: data.payload.significance,
              semantic_data: data.payload.semantic_data,
            });
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (pingTimer.current) clearInterval(pingTimer.current);
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          scheduleReconnect();
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      scheduleReconnect();
    }
  }, [addEvent, addEvents, setConnected]);

  const scheduleReconnect = useCallback(() => {
    const delay = Math.min(
      1000 * Math.pow(2, reconnectAttempts.current),
      MAX_RECONNECT_DELAY
    );
    reconnectAttempts.current += 1;
    reconnectTimer.current = setTimeout(connect, delay);
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      if (pingTimer.current) clearInterval(pingTimer.current);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  return useMonitorStore();
}
