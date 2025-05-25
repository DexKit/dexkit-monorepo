import { strPad } from '@/modules/common/utils/strings';

export function TimerSpan({ time = 0 }: { time: number }) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  return (
    <span>
      {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
    </span>
  );
}
