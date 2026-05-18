import { atom, useAtom } from 'jotai';

const isVibecoderOpenAtom = atom(false);

export function useVibecoderDialog() {
  const [isOpen, setOpen] = useAtom(isVibecoderOpenAtom);

  return {
    isOpen,
    setOpen,
  };
}

