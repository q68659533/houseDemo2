"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface UseApiOptions {
  /** Show a toast when the request fails. Default: true. */
  toastOnError?: boolean;
  /** Called after a successful response. */
  onSuccess?: <T>(data: T) => void;
  /** Called when the request fails. Receives the message and original error. */
  onError?: (message: string, error: ApiError) => void;
}

export interface UseApiResult<TArgs extends unknown[], T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: TArgs) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic API hook. Tracks loading/error/data state for any async function.
 * Failures are caught and surfaced through `error`; no exception escapes `execute`.
 * On error, a toast is shown via the global ToastProvider unless `toastOnError` is false.
 */
export function useApi<TArgs extends unknown[], T>(
  fn: (...args: TArgs) => Promise<T>,
  options: UseApiOptions = {}
): UseApiResult<TArgs, T> {
  const { toastOnError = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { addToast } = useToast();

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: TArgs): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
        onSuccess?.(result);
        return result;
      } catch (e) {
        const err =
          e instanceof ApiError
            ? e
            : new ApiError(e instanceof Error ? e.message : "未知错误", "network");
        if (mountedRef.current) {
          setError(err);
          setLoading(false);
        }
        if (toastOnError) addToast(err.message, "error");
        onError?.(err.message, err);
        return null;
      }
    },
    [fn, addToast, toastOnError, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
