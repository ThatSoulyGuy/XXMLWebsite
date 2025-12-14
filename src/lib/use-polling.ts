"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UsePollingOptions<T> {
  url: string;
  interval?: number; // in milliseconds
  enabled?: boolean;
  onUpdate?: (data: T) => void;
}

export function usePolling<T>({
  url,
  interval = 5000,
  enabled = true,
  onUpdate,
}: UsePollingOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const onUpdateRef = useRef(onUpdate);

  // Keep onUpdate ref current
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const newData = await response.json();
      setData(newData);
      setError(null);
      onUpdateRef.current?.(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up polling
    const pollInterval = setInterval(fetchData, interval);

    return () => clearInterval(pollInterval);
  }, [enabled, fetchData, interval]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    return fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch };
}
