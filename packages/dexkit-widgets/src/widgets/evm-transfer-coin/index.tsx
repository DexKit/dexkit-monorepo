import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useWeb3React } from "@web3-react/core";
import WidgetLayout from "../../components/WidgetLayout";
import { useConnectWalletDialog } from "../../hooks";
import EvmTransferCoin from "./components/EvmTransferCoin";

export interface EvmTransferCoinWidgetProps {
  tokenId?: string;
  chainId?: number;
  account?: string;
  contractAddress?: string;
  onConnectWallet?: () => void;
}
function EvmTransferCoinContainer(params: EvmTransferCoinWidgetProps) {
  const { provider, account, chainId } = useWeb3React();
  const connectWalletDialog = useConnectWalletDialog();
  const switchMutation = useSwitchNetworkMutation();
  return (
    <EvmTransferCoin
      {...params}
      chainId={chainId}
      onSwitchNetwork={({ chainId }) =>
        switchMutation.mutate({ chainId: chainId as number })
      }
      onConnectWallet={() => connectWalletDialog.setOpen(true)}
      provider={provider}
      account={account}
    />
  );
}

export default function EvmTransferCoinWidget(
  params: EvmTransferCoinWidgetProps,
) {
  return (
    <WidgetLayout>
      <EvmTransferCoinContainer {...params} />
    </WidgetLayout>
  );
}
