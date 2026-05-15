"use client";

import { useEffect, useMemo } from "react";
import {
  computeMarketStats,
  fetchMarketData,
  type MarketDataResponse,
  type MarketProperty,
  type MarketStats,
} from "@/lib/api";
import { useApi, type UseApiOptions } from "@/hooks/use-api";
import type { ApiError } from "@/lib/api";

export interface UseMarketDataOptions extends UseApiOptions {
  /** Fetch automatically on mount. Default: true. */
  autoFetch?: boolean;
}

export interface UseMarketDataResult {
  data: MarketDataResponse | null;
  properties: MarketProperty[];
  stats: MarketStats;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<MarketDataResponse | null>;
}

/**
 * Hook for the Java market dataset. Auto-fetches on mount by default.
 */
export function useMarketData(options: UseMarketDataOptions = {}): UseMarketDataResult {
  const { autoFetch = true, ...apiOptions } = options;
  const { data, loading, error, execute } = useApi(fetchMarketData, apiOptions);

  useEffect(() => {
    if (autoFetch) {
      void execute();
    }
  }, [autoFetch, execute]);

  const properties = useMemo(() => data?.properties ?? [], [data]);
  const stats = useMemo(() => computeMarketStats(properties), [properties]);

  return {
    data,
    properties,
    stats,
    // Show loading on the first render too, before the effect has run.
    loading: loading || (autoFetch && data === null && error === null),
    error,
    refetch: execute,
  };
}
