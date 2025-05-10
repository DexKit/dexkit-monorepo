import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Delete from '@mui/icons-material/Delete';
import {
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import { FieldArray, Form, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionItemsForm } from '../types';
import CollectionItemForm from './CollectionItemForm';

interface Props {
  network: string;
  onlySingleMint?: boolean;
  allowMultipleQuantity?: boolean;
}

export default function CollectionItemsCard({
  network,
  onlySingleMint = false,
  allowMultipleQuantity = false,
}: Props) {
  const { chainId } = useWeb3React();
  const { submitForm, isValid, values } =
    useFormikContext<CollectionItemsForm>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<() => void>();

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setConfirmCallback(undefined);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={<FormattedMessage id="remove.nft" defaultMessage="Remove NFT" />}
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.remove.this.nft"
            defaultMessage="Do you really want to remove this NFT?"
          />
        </Typography>
      </AppConfirmDialog>

      <Card>
        <CardContent>
          <Form>
            <FieldArray
              name="items"
              render={(arrayHelper) => (
                <Stack spacing={2}>
                  {values.items?.map((_, index: number, arr: any[]) => (
                    <React.Fragment key={index}>
                      {onlySingleMint === false && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>NFT: {index + 1}</Typography>

                          <Button
                            startIcon={<Delete />}
                            onClick={() => {
                              setShowConfirm(true);
                              setConfirmCallback(() => () => {
                                arrayHelper.remove(index);
                                setShowConfirm(false);
                              });
                            }}
                          >
                            <FormattedMessage
                              id="remove"
                              defaultMessage="Remove"
                            />
                          </Button>
                        </Stack>
                      )}
                      <CollectionItemForm
                        itemIndex={index}
                        onlySingleMint={onlySingleMint}
                        allowMultipleQuantity={allowMultipleQuantity}
                      />
                      {index < arr.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  {onlySingleMint === false && (
                    <Button
                      variant="outlined"
                      onClick={() => arrayHelper.push({ quantity: 1 })}
                    >
                      <FormattedMessage id="add.nft" defaultMessage="Add nft" />
                    </Button>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      disabled={
                        !isValid ||
                        values.items.length === 0 ||
                        !chainId ||
                        chainId !== NETWORK_FROM_SLUG(network)?.chainId
                      }
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      {onlySingleMint === false ? (
                        <FormattedMessage
                          id="create.nfts"
                          defaultMessage="Create NFTs"
                        />
                      ) : (
                        <FormattedMessage
                          id="create.nft"
                          defaultMessage="Create NFT"
                        />
                      )}
                    </Button>
                  </Stack>
                </Stack>
              )}
            />
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
