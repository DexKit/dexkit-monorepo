import { ChainId } from '@dexkit/core/constants';
import {
  getChainLogoImage,
  getChainName,
  getChainSymbol,
} from '@dexkit/core/utils/blockchain';
import ChooseNetworkDialog from '@dexkit/ui/components/dialogs/ChooseNetworkDialog';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useState } from 'react';

interface Props {
  chainId?: ChainId;
  onChange: (chainId: ChainId) => void;
}

export function NetworkSelectButton(props: Props) {
  const { onChange, chainId } = props;
  const [showSelectSwapNetworkDialog, setShowSelectSwapNetwork] =
    useState(false);

  const handleOpenSelectNetworkDialog = () => {
    setShowSelectSwapNetwork(true);
  };

  const handleCloseShowNetworkDialog = () => {
    setShowSelectSwapNetwork(false);
  };

  return (
    <>
      {showSelectSwapNetworkDialog && (
        <ChooseNetworkDialog
          dialogProps={{
            open: showSelectSwapNetworkDialog,
            fullWidth: true,
            maxWidth: 'sm',
            onClose: handleCloseShowNetworkDialog,
          }}
          selectedChainId={chainId}
          onChange={(newChain) => {
            onChange(newChain);
          }}
        />
      )}

      <Button
        onClick={handleOpenSelectNetworkDialog}
        startIcon={
          <Avatar
            src={getChainLogoImage(chainId)}
            sx={(theme) => ({
              width: 'auto',
              height: theme.spacing(3),
            })}
            alt={getChainName(chainId) || ''}
          />
        }
      >
        {getChainSymbol(chainId) || ''}
      </Button>
    </>
  );
}
