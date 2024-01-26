import { ipfsUriToUrl, parseChainId } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import {
  Avatar,
  Checkbox,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ChainId } from "@dexkit/core";
import { useFormikContext } from "formik";
import { useCallback } from "react";
import { DexkitExchangeSettings } from "../../types";

import { useNetworkMetadata } from "@dexkit/ui/hooks/app";

export interface SelectNetworksDialogProps {
  DialogProps: DialogProps;
}

export default function SelectNetworksDialog({
  DialogProps,
}: SelectNetworksDialogProps) {
  const { onClose } = DialogProps;
  const { values, setFieldValue } = useFormikContext<DexkitExchangeSettings>();

  const handleToggleChain = useCallback(
    (chainId: ChainId) => {
      return () => {
        let newNetworks = [...values.availNetworks];

        if (newNetworks.includes(chainId)) {
          let index = newNetworks.findIndex((n) => n === chainId);

          if (index > -1) {
            newNetworks.splice(index, 1);
          }
        } else {
          newNetworks.push(chainId);
        }

        setFieldValue("availNetworks", newNetworks);
      };
    },
    [values]
  );

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const { NETWORKS } = useNetworkMetadata();

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.networks"
            defaultMessage="Select Networks"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List disablePadding>
          {Object.keys(NETWORKS).map((key) => (
            <ListItem divider key={key}>
              <ListItemAvatar>
                <Avatar
                  src={ipfsUriToUrl(NETWORKS[parseChainId(key)].imageUrl || "")}
                />
              </ListItemAvatar>
              <ListItemText primary={NETWORKS[parseChainId(key)].name} />
              <ListItemSecondaryAction>
                <Checkbox
                  onClick={handleToggleChain(parseChainId(key))}
                  checked={values.availNetworks.includes(parseChainId(key))}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
