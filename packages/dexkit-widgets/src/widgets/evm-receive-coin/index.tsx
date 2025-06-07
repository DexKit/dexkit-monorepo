import { EvmCoin } from "@dexkit/core/types";
import EvmReceive from "@dexkit/ui/components/EvmReceive";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import WidgetLayout from "../../components/WidgetLayout";

export interface EvmReceiveWidgetProps {
  coins?: EvmCoin[];
  defaultCoin?: EvmCoin;
}
function EvmReceiveContainer(params: EvmReceiveWidgetProps) {
  const { account, chainId } = useWeb3React();

  return <EvmReceive {...params} chainId={chainId} receiver={account} />;
}

export default function EvmReceiveWidget(params: EvmReceiveWidgetProps) {
  return (
    <WidgetLayout>
      <EvmReceiveContainer {...params} />
    </WidgetLayout>
  );
}
