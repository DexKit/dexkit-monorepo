import { useIsMobile } from "@dexkit/core/hooks";
import { AppDialogTitle } from "@dexkit/ui/components";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListProps,
} from "@mui/material";
import { memo } from "react";
import { FormattedMessage } from "react-intl";
import { ChainId } from "../constants/enum";
import { NETWORKS } from "../constants/networks";
import { parseChainId } from "../utils";

interface SwitchNetworkDialogProps {
  ListProps?: ListProps;
  DialogProps: DialogProps;
  onChangeNetwork: (chainId: ChainId) => void;
  chainId?: ChainId;
}

function SwitchNetworkDialog({
  ListProps,
  DialogProps,
  onChangeNetwork,
  chainId,
}: SwitchNetworkDialogProps) {
  const { onClose } = DialogProps;
  const isMobile = useIsMobile();

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleChange = async (value: ChainId) => {
    onChangeNetwork(value);
    handleClose();
  };

  return (
    <Dialog {...DialogProps} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="switch.network"
            defaultMessage="Switch Network"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List {...ListProps}>
          {Object.keys(NETWORKS)
            .filter((key) => {
              return !NETWORKS[parseChainId(key)].testnet;
            })
            .map((key) => (
              <ListItemButton
                onClick={() => handleChange(parseChainId(key))}
                selected={parseChainId(key) === chainId}
                key={parseChainId(key)}
              >
                <ListItemAvatar>
                  <Avatar src={NETWORKS[parseChainId(key)].imageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    NETWORKS[parseChainId(key)]
                      ? NETWORKS[parseChainId(key)].name
                      : undefined
                  }
                />
              </ListItemButton>
            ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SwitchNetworkDialog);
