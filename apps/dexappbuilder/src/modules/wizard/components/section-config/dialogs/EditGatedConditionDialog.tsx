import { ChainId } from '@dexkit/core';
import { Token } from '@dexkit/core/types';
import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import { AppDialogTitle, getAssetProtocol, useAllTokenList } from '@dexkit/ui';
import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field, Formik, getIn } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { CollectionItemAutocomplete } from '../../forms/CollectionItemAutocomplete';
import { SearchTokenAutocomplete } from '../../forms/SearchTokenAutocomplete';

const GatedCoditionSchema = Yup.object().shape({
  type: Yup.string().required(),
  condition: Yup.string(),
  address: Yup.string().required(),
  chainId: Yup.number(),
  decimals: Yup.number(),
  protocol: Yup.string(),
  tokenId: Yup.string(),
  amount: Yup.string().required(),
});

const GatedConditionFormSchema = Yup.object().shape({
  condition: GatedCoditionSchema,
});

export interface EditGatedConditionDialogProps {
  DialogProps: DialogProps;
  condition?: GatedCondition;
  onSaveGatedCondition: (condition: GatedCondition) => void;
  isFirst?: boolean;
  index?: number;
}

function getValueFrom(values: any) {
  let value = getIn(values, `condition`);

  if (value) {
    let val = {
      chainId: value.chainId,
      backgroundImageUrl: value.backgroundImageUrl,
      contractAddress: value.address,
    };

    return val;
  }

  return undefined;
}

export default function EditGatedConditionDialog({
  DialogProps,
  condition,
  onSaveGatedCondition,
  isFirst,
  index,
}: EditGatedConditionDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSubmit = async (values: { condition: GatedCondition }) => {
    onSaveGatedCondition(values.condition);

    handleClose();
  };

  const featuredTokens = useAllTokenList({
    includeNative: true,
    isWizardConfig: true,
  });

  const [selectedCoin, setSelectedCoin] = useState<Token | undefined>(
    condition !== undefined
      ? {
          address: condition?.address ?? '',
          symbol: condition?.symbol ?? '',
          chainId: condition?.chainId ?? ChainId.Ethereum,
          decimals: condition?.decimals ?? 0,
          name: condition?.name ?? '',
        }
      : undefined,
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={
        condition
          ? { condition }
          : {
              condition: {
                type: 'collection',
                amount: '1',
                condition: 'or',
              },
            }
      }
      validationSchema={GatedConditionFormSchema}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
      }) => (
        <Dialog {...DialogProps}>
          <AppDialogTitle
            onClose={handleClose}
            title={
              condition ? (
                <FormattedMessage
                  id="edit.gated.condition"
                  defaultMessage="Edit gated condition"
                />
              ) : (
                <FormattedMessage
                  id="add.gated.condition"
                  defaultMessage="Add gated condition"
                />
              )
            }
            titleBox={{ px: 3, py: 1 }}
          />
          <DialogContent sx={{ px: 4 }} dividers>
            <Grid container spacing={2}>
              {index !== undefined && (
                <Grid item xs={12}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography align="left">
                        <b>
                          <FormattedMessage
                            id="condition.index.value"
                            defaultMessage="Condition {index}"
                            values={{
                              index: index >= 0 ? index + 1 : 0,
                            }}
                          />
                        </b>
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              )}

              {!isFirst && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel shrink>
                      <FormattedMessage
                        id="condition"
                        defaultMessage="Condition"
                      />
                    </InputLabel>
                    <Field
                      component={Select}
                      name="condition.condition"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      variant="filled"
                    >
                      <MenuItem value="or">
                        <FormattedMessage id="or" defaultMessage="Or" />
                      </MenuItem>

                      <MenuItem value="and">
                        <FormattedMessage id="and" defaultMessage="And" />
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel shrink>
                        <FormattedMessage id="type" defaultMessage="Type" />
                      </InputLabel>
                      <Field
                        component={Select}
                        name="condition.type"
                        label={
                          <FormattedMessage id="type" defaultMessage="Type" />
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      >
                        <MenuItem value="collection">
                          <FormattedMessage
                            id="collection"
                            defaultMessage="Collection"
                          />
                        </MenuItem>

                        <MenuItem value="coin">
                          <FormattedMessage id="coin" defaultMessage="Coin" />
                        </MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  {values.condition.type === 'collection' && (
                    <Grid item xs={12} sm>
                      <CollectionItemAutocomplete
                        onChange={async (coll: any) => {
                          setFieldValue(
                            'condition.address',
                            coll.contractAddress,
                          );
                          setFieldValue('condition.chainId', coll.chainId);
                          setFieldValue('condition.symbol', coll.name);
                          setFieldValue('condition.name', coll.name);
                          // We identify protocol to then check if we need to add token Id
                          getAssetProtocol(
                            getProviderByChainId(coll.chainId),
                            coll.contractAddress,
                          ).then((v) => {
                            setFieldValue('condition.protocol', v);
                          });
                        }}
                        value={getValueFrom(values) ?? {}}
                      />
                    </Grid>
                  )}
                  {values.condition?.type === 'coin' && (
                    <Grid item xs={12} sm>
                      <SearchTokenAutocomplete
                        label="Search coin"
                        tokens={featuredTokens}
                        data={selectedCoin}
                        onChange={(tk: any) => {
                          setSelectedCoin(tk);

                          setFieldValue('condition', {
                            ...values.condition,
                            address: tk?.address,
                            symbol: tk.symbol,
                            chainId: tk?.chainId,
                            decimals: tk?.decimals,
                            name: tk?.name,
                          });
                        }}
                      />
                    </Grid>
                  )}

                  {values.condition?.protocol === 'ERC1155' && (
                    <Grid item xs={12} sm={3}>
                      <Field
                        component={TextField}
                        name="condition.tokenId"
                        label={
                          <FormattedMessage
                            id="token.id"
                            defaultMessage="token.id"
                          />
                        }
                        fullWidth
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={3}>
                    <Field
                      component={TextField}
                      name="condition.amount"
                      label={
                        <FormattedMessage
                          id="required.quantity"
                          defaultMessage="Required quantity"
                        />
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 2 }}>
            <Button disabled={!isValid || isSubmitting} onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={!isValid || isSubmitting}
              onClick={submitForm}
              variant="contained"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
