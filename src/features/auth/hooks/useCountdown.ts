import { useCallback, useEffect, useState } from 'react';

/** Seconds left until the user may ask for a new OTP. restart() starts again from `seconds`. */
export function useCountdown(seconds: number) {
  const [endsAt, setEndsAt] = useState(() => Date.now() + seconds * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (now >= endsAt) return;
    const id = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(id);
  }, [endsAt, now]);

  const restart = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setEndsAt(t + seconds * 1000);
  }, [seconds]);

  return { secondsLeft: Math.max(0, Math.ceil((endsAt - now) / 1000)), restart };
}
