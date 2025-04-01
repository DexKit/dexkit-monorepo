import { useMemo } from "react";
import type { Connector } from "wagmi";
import { getMagicIcon } from "../connectors/magic-wagmi/magicConnector";
import { useAsyncImage } from "../rainbowkit/hooks/useAsyncImage";

export function useConnectorImage({ connector }: { connector?: Connector }) {
  const isMagic = connector?.id === "magic";

  const iconURL = isMagic
    ? undefined
    : connector?.icon ||
      (connector?.iconUrl as string) ||
      (connector as any)?.rkDetails?.iconUrl;

  const image = useAsyncImage(iconURL);

  return useMemo(() => {
    if (isMagic) {
      return getMagicIcon();
    } else {
      return typeof image === "string" ? image : image?.src;
    }
  }, [isMagic, image]);
}
