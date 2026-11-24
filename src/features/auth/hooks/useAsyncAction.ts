import { useCallback, useRef, useState } from 'react';

import { getUserMessage } from '@/core/errors';

/**
 * Runs one async action (send OTP, save profile...) and tracks loading + a friendly
 * error message. Ignores double taps while the first request is still running.
 */
export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const running = useRef(false);

  const run = useCallback(
    async (...args: Args): Promise<Result | undefined> => {
      if (running.current) return undefined;
      running.current = true;
      setLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (e) {
        setError(getUserMessage(e));
        return undefined;
      } finally {
        running.current = false;
        setLoading(false);
      }
    },
    [action],
  );

  return { run, loading, error, clearError: useCallback(() => setError(null), []) };
}
