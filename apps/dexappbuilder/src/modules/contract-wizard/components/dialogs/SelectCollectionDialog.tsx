import { useListDeployedContracts } from '@/modules/forms/hooks';
import { ChainId } from '@dexkit/core';
import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { isAddressEqual } from '@dexkit/core/utils';
import { AppDialogTitle } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    List,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Radio,
    Stack,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCollections } from 'src/hooks/app';
import { myAppsApi } from 'src/services/whitelabel';

export interface SelectCollectionDialogProps {
  DialogProps: DialogProps;
  chainId?: ChainId;
  onSelect: (address: string) => void;
  isErc1155?: boolean;
}

function SelectCollectionDialog({
  DialogProps,
  chainId,
  onSelect,
  isErc1155,
}: SelectCollectionDialogProps) {
  const { onClose } = DialogProps;

  const { account } = useWeb3React();
  const [selectedContractAddr, setSelectedContractAddr] = useState<string>();

  const collectionsList = useCollections();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    setSelectedContractAddr(undefined);
  };

  const [type, setType] = useState<string>('');

  const [query, setQuery] = useState<string>();

  const filter = useMemo(() => {
    let f: any = {
      owner: account?.toLowerCase(),
      type: { in: isErc1155 ? 'TokenERC1155' : 'TokenERC721' },
    };

    if (query) {
      f.q = query;
    }

    if (type && type !== '' && type !== undefined) {
      f.type = type;
    }

    return f;
  }, [query, account, type]);

  const [page, setPage] = useState(0);

  const listContractsQuery = useListDeployedContracts({
    filter,
    page,
    pageSize: 10,
  });

  const collections = useMemo(() => {
    const arr =
      collectionsList && collectionsList?.length > 0
        ? collectionsList
            ?.filter((c) => c.chainId === chainId)
            .map((c) => ({
              chainId: c.chainId,
              contractAddress: c.contractAddress,
              name: c.name,
            }))
        : [];

    if (listContractsQuery.data?.data) {
      return [
        ...arr,
        ...listContractsQuery.data?.data.map((c) => ({
          chainId: c.chainId,
          contractAddress: c.contractAddress,
          name: c.name,
        })),
      ];
    }

    return arr;
  }, [listContractsQuery.data, collectionsList]);

  const data = useMemo(() => {
    if (collections) {
      return collections.filter((c) => c.chainId === chainId);
    }

    return [];
  }, [collections]);

  const handleConfirm = () => {
    if (selectedContractAddr) {
      onSelect(selectedContractAddr);
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        onClose={handleClose}
        title={
          <FormattedMessage
            id="select.collection"
            defaultMessage="Select collection"
          />
        }
      />
      <DialogContent dividers sx={{ p: 0 }}>
        {(data && data.length > 0) ||
        (collections && collections?.length > 0) ? (
          <List disablePadding>
            {collections?.map((collection, key) => (
              <ListItemButton
                key={key}
                onClick={() =>
                  setSelectedContractAddr(collection.contractAddress)
                }
              >
                <ListItemText
                  primary={collection.name}
                  secondary={NETWORK_SLUG(collection.chainId)?.toUpperCase()}
                />

                <ListItemSecondaryAction>
                  <Radio
                    checked={isAddressEqual(
                      collection.contractAddress,
                      selectedContractAddr,
                    )}
                  />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Box py={2}>
            <Stack justifyContent="center">
              <Typography variant="h5" align="center">
                <FormattedMessage
                  id="no.collections"
                  defaultMessage="No collections"
                />
              </Typography>
              <Typography color="text.secondary" variant="body1" align="center">
                <FormattedMessage
                  id="deploy.a.collection.to.see.it.here"
                  defaultMessage="Deploy a collection to see it here"
                />
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!selectedContractAddr}
          variant="contained"
          onClick={handleConfirm}
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Wrapper(props: SelectCollectionDialogProps) {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <SelectCollectionDialog {...props} />
    </DexkitApiProvider.Provider>
  );
}
