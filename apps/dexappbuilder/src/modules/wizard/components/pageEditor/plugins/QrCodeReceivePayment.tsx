import { EvmCoin } from '@dexkit/core/types';
import QrCodeReceiveViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/QrCodeReceivePayment';
import EvmReceiveForm from '@dexkit/ui/components/EvmReceiveForm';
import { useEvmCoins } from '@dexkit/ui/hooks/blockchain';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

type Props = {
  receiver?: string | null;
  coin?: EvmCoin | null;
  chainId?: number;
  amount?: number | null;
  ENSName?: string;
};

// you can pass the shape of the data as the generic type argument
const QrCodeReceive: CellPlugin<Props> = {
  ...QrCodeReceiveViewer,
  controls: {
    type: 'custom',
    Component: (data) => {
      const { account, chainId } = useWeb3React();
      const evmCoins = useEvmCoins({
        defaultChainId: data.data.chainId || chainId,
      });
      return (
        <Container sx={{ p: 2 }}>
          <EvmReceiveForm
            onChange={data.onChange}
            defaultCoin={data.data.coin}
            defaultENSName={data.data.ENSName}
            defaultReceiver={data.data.receiver || account}
            defaultChainId={data.data.chainId || chainId}
            defaultAmount={data.data.amount}
            coins={evmCoins}
          />
        </Container>
      );
    },
  },
};

export default QrCodeReceive;
