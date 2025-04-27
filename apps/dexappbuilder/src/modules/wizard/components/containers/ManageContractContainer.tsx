import { ContractContainer } from '@/modules/contract-wizard/components/containers/ContractContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Container from '@mui/material/Container';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { THIRDWEB_CLIENT_ID } from 'src/constants';

interface Props {
  address: string;
  network: string;
  onGoBack: () => void;
}

export default function ManageContractContainer({
  address,
  network,
  onGoBack,
}: Props) {
  const { signer } = useWeb3React();

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={NETWORK_FROM_SLUG(network as string)?.chainId}
      signer={signer}
    >
      <Container>
        <ContractContainer
          address={address as string}
          network={network as string}
          showPageHeader={true}
          onGoBack={onGoBack}
        />
      </Container>
    </ThirdwebSDKProvider>
  );
}
