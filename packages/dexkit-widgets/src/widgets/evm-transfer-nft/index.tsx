import { useNftMetadataQuery, useNftQuery } from "@dexkit/core/hooks";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import WidgetLayout from "../../components/WidgetLayout";
import { useConnectWalletDialog } from "../../hooks";
import EvmTransferNft from "./components/EvmTransferNft";

export interface EvmTransferNftWidgetProps {
  tokenId?: string;
  chainId?: number;
  account?: string;
  contractAddress?: string;
  onConnectWallet?: () => void;
}
function EvmTransferNftContainer(params: EvmTransferNftWidgetProps) {
  const nftQuery = useNftQuery({ ...params });
  const nftMetadataQuery = useNftMetadataQuery({
    tokenURI: nftQuery.data?.tokenURI,
  });
  const { provider, account, chainId } = useWeb3React();
  const connectWalletDialog = useConnectWalletDialog();
  const switchMutation = useSwitchNetworkMutation();

  return (
    <EvmTransferNft
      {...params}
      chainId={chainId}
      onSwitchNetwork={() =>
        switchMutation.mutate({ chainId: nftQuery?.data?.chainId as number })
      }
      onConnectWallet={() => connectWalletDialog.setOpen(true)}
      isLoadingNft={nftQuery.isLoading}
      isLoadingNftMetadata={nftMetadataQuery.isLoading}
      nft={nftQuery.data}
      nftMetadata={nftMetadataQuery.data}
      provider={provider}
      account={account}
    />
  );
}

export default function EvmTransferNftWidget(
  params: EvmTransferNftWidgetProps
) {
  return (
    <WidgetLayout>
      <EvmTransferNftContainer {...params} />
    </WidgetLayout>
  );
}
