'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
const MAX_SSE_FAILURES = 3;
const BACKOFF_BASE_MS = 1000;

interface UseSSEOptions<T> {
  /** SWR fallback polling interval in ms (used when SSE fails) */
  fallbackInterval?: number;
  /** Transform incoming SSE data before setting state */
  transform?: (data: unknown) => T;
  /** REST endpoint path for SWR fallback (e.g., '/offers') */
  fallbackPath?: string;
}

/**
 * Hook that connects to an SSE endpoint with automatic fallback to SWR polling.
 *
 * Strategy:
 * 1. Try SSE connection first
 * 2. On 3 consecutive failures, fall back to SWR polling
 * 3. Auto-reconnect on disconnect with exponential backoff (1s, 2s, 4s)
 */
export function useSSE<T>(
  ssePath: string,
  options: UseSSEOptions<T> = {}
): { data: T | undefined; isSSE: boolean; isLoading: boolean; error: Error | null } {
  const {
    fallbackInterval = 30_000,
    transform,
    fallbackPath,
  } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [isSSE, setIsSSE] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sseActive, setSSEActive] = useState(true);

  const failureCount = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Connect to SSE
  const connect = useCallback(() => {
    if (!sseActive) return;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${API_BASE}${ssePath}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const result = transform ? transform(parsed) : (parsed as T);
        setData(result);
        setError(null);
        // Successful message resets failure count
        failureCount.current = 0;
        setIsSSE(true);
      } catch (err) {
        // Parse error — don't count as SSE failure
      }
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      failureCount.current += 1;

      if (failureCount.current >= MAX_SSE_FAILURES) {
        // Switch to SWR fallback
        setSSEActive(false);
        setIsSSE(false);
      } else {
        // Exponential backoff reconnect: 1s, 2s, 4s
        const delay = BACKOFF_BASE_MS * Math.pow(2, failureCount.current - 1);
        reconnectTimer.current = setTimeout(connect, delay);
      }
    };
  }, [ssePath, sseActive, transform]);

  // Start SSE on mount
  useEffect(() => {
    if (sseActive) {
      connect();
    }

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [connect, sseActive]);

  // SWR fallback — only active when SSE has failed 3x
  const swrKey = !sseActive && fallbackPath ? fallbackPath : null;
  const { data: swrData, isLoading: swrLoading } = useSWR<T>(
    swrKey,
    apiFetch,
    { refreshInterval: fallbackInterval }
  );

  // Use SWR data when SSE is not active
  useEffect(() => {
    if (!sseActive && swrData !== undefined) {
      setData(swrData);
    }
  }, [sseActive, swrData]);

  const isLoading = data === undefined && (sseActive || swrLoading);

  return { data, isSSE, isLoading, error };
}
