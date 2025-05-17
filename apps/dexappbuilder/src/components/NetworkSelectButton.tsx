import { useIsMobile } from '@dexkit/core';
import { ChainId } from '@dexkit/core/constants';
import {
  getChainLogoImage,
  getChainName,
  getChainSymbol,
} from '@dexkit/core/utils/blockchain';
import ChooseNetworkDialog from '@dexkit/ui/components/dialogs/ChooseNetworkDialog';
import { ButtonProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface Props {
  chainId?: ChainId;
  onChange: (chainId: ChainId) => void;
  size?: ButtonProps['size'];
}

export function NetworkSelectButton(props: Props) {
  const { onChange, chainId, size: propSize } = props;
  const isMobile = useIsMobile();
  const size = propSize || (isMobile ? "small" : "medium");

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
        size={size}
        startIcon={
          <Avatar
            src={getChainLogoImage(chainId)}
            sx={(theme) => ({
              width: 'auto',
              height: isMobile ? theme.spacing(2) : theme.spacing(3),
            })}
            alt={getChainName(chainId) || ''}
          />
        }
      >
        <Typography variant={isMobile ? "body2" : "body1"}>
          {getChainSymbol(chainId) || ''}
        </Typography>
      </Button>
    </>
  );
}
