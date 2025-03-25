import { useEffect, useMemo, useState } from 'react';
import { TimerSpan } from './TimerSpan';

interface Props {
  duration?: number;
  startTimestamp?: number;
  onEnd?: () => void;
}

export default function GameCountdown({
  onEnd,
  duration,
  startTimestamp,
}: Props): JSX.Element {
  const endTime = useMemo(() => {
    if (duration && startTimestamp) {
      return new Date((duration + startTimestamp) * 1000);
    }

    return new Date();
  }, [duration, startTimestamp]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor(
        (endTime.getTime() - new Date().getTime()) / 1000
      );

      if (diff <= 0) {
        setCount(0);
        clearInterval(interval);
        if (onEnd) {
          onEnd();
        }
      } else {
        setCount(diff);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onEnd]);

  return <TimerSpan time={count} />;
}
