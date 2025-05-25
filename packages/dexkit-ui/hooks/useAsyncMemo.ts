import { useEffect, useState } from "react";

export function useAsyncMemo<T>(
  cb: (initial: T) => Promise<T>,
  initial: T,
  args: unknown[]
) {
  const [result, setResult] = useState<T>(initial);

  useEffect(() => {
    async function load() {
      const res = await cb(result);
      if (!active) {
        return;
      }
      setResult(res);
    }

    let active = true;
    load();
    return () => {
      active = false;
    };
  }, args);

  return result;
}
