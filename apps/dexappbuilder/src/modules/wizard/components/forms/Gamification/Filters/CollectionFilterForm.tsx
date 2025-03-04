import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ChangeListener from '../../../ChangeListener';
import { CollectionItemAutocomplete } from '../../CollectionItemAutocomplete';
import { SearchTokenAutocompleteWithTokens } from '../../SearchTokenAutocomplete';
import { Conditions } from '../constants/conditions';

interface CollectionFilter {
  chainId?: number;
  mode?: number;
  collectionAddress?: string;
  tokenId?: string;
  conditionNFT?: string;
  amountNFT?: number;
  tokenAddress?: string;
  amount?: number;
  condition?: string;
}

const CollectionFilterSchema: Yup.SchemaOf<CollectionFilter> =
  Yup.object().shape({
    chainId: Yup.number(),
    tokenAddress: Yup.string(),
    amountNFT: Yup.number(),
    conditionNFT: Yup.string(),
    tokenId: Yup.string(),
    condition: Yup.string(),
    amount: Yup.number(),
    collectionAddress: Yup.string(),
    mode: Yup.number().optional(),
  });

interface Props {
  onCancel?: () => void;
  onSubmit?: (item: CollectionFilter) => void;
  onChange?: (item: CollectionFilter, isValid: boolean) => void;
  item?: CollectionFilter;
  isERC1155?: boolean;
}

function a11yProps(index: number) {
  return {
    id: `collection-tab-${index}`,
    'aria-controls': `collection-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  if (value === index) {
    return <>{children || null} </>;
  } else {
    return null;
  }
}

export default function CollectionFilterForm({
  item,
  onCancel,
  onSubmit,
  onChange,
  isERC1155,
}: Props) {
  const [value, setValue] = useState(1);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setValue(event.target.value as number);
  };

  const { chainId } = useWeb3React();

  const { formatMessage } = useIntl();

  return (
    <Formik
      initialValues={
        item
          ? { ...item }
          : {
              chainId: chainId,
              mode: -1,
            }
      }
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values as CollectionFilter);
        }
      }}
      validationSchema={CollectionFilterSchema}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
        resetForm,
      }) => (
        <Form>
          <ChangeListener
            values={values}
            isValid={isValid}
            onChange={onChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <NetworkSelectDropdown
                  chainId={values.chainId}
                  label={
                    <FormattedMessage id="network" defaultMessage="Network" />
                  }
                  onChange={(chainId) => {
                    setFieldValue('chainId', chainId);
                    setFieldValue('tokenAddress', undefined);
                    setFieldValue('collectionAddress', undefined);
                  }}
                  labelId="Choose network"
                  enableTestnet={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight="500">
                <FormattedMessage
                  id="filter.by.collection"
                  defaultMessage="Filter by collection"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                {values?.mode != -1 && (
                  <InputLabel shrink>
                    <FormattedMessage
                      id="choose.an.option"
                      defaultMessage="Choose an option"
                    />
                  </InputLabel>
                )}

                <Select
                  value={values?.mode ?? -1}
                  onChange={(e) => {
                    setFieldValue('mode', e.target.value as number);
                  }}
                  notched
                  label={
                    values?.mode && values?.mode === -1 ? undefined : (
                      <FormattedMessage
                        id="choose.an.option"
                        defaultMessage="Choose an option"
                      />
                    )
                  }
                  renderValue={
                    values?.mode && values?.mode == -1
                      ? (value: any) => {
                          return (
                            <Typography color="gray">
                              <FormattedMessage
                                id="choose.an.option"
                                defaultMessage="Choose an option"
                              />
                            </Typography>
                          );
                        }
                      : undefined
                  }
                  fullWidth
                >
                  <MenuItem value={0}>
                    <FormattedMessage
                      id="import.collection"
                      defaultMessage="Import collection"
                    />
                  </MenuItem>
                  <MenuItem value={1}>
                    <FormattedMessage
                      id="my.collections.alt"
                      defaultMessage="My collections"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <TabPanel value={values.mode ?? 0} index={1}>
                  <Grid item xs={12} sm={6}>
                    <CollectionItemAutocomplete
                      onChange={(coll) => {
                        setFieldValue(
                          'collectionAddress',
                          coll?.contractAddress,
                        );
                      }}
                      filterByChainId={true}
                      chainId={values.chainId}
                      disabled={values.chainId === undefined}
                      value={{
                        contractAddress: values.collectionAddress,
                        chainId: values.chainId,
                      }}
                    />
                  </Grid>
                </TabPanel>
                <TabPanel value={values.mode ?? 0} index={0}>
                  <Grid item xs={12} sm={8}>
                    <Field
                      component={TextField}
                      label={
                        <FormattedMessage
                          id="collection.address"
                          defaultMessage="Collection address"
                        />
                      }
                      fullWidth
                      name="collectionAddress"
                      required
                    />
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
            {values.mode !== -1 && (
              <>
                {Boolean(isERC1155) && (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Field
                          component={TextField}
                          type="text"
                          fullWidth
                          label={
                            <FormattedMessage
                              id={'nft.id'}
                              defaultMessage={'NFT ID'}
                            />
                          }
                          InputProps={{ min: 0 }}
                          name="tokenId"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel id="condition-amount-nft-select-label">
                            <FormattedMessage
                              id="amount.condition"
                              defaultMessage="Amount condition"
                            />
                          </InputLabel>
                          <Select
                            MenuProps={{
                              slotProps: {
                                paper: {
                                  style: { width: 'fit-content' },
                                },
                              },
                            }}
                            labelId="condition-amount-nft-select-label"
                            id="demo-simple-select"
                            value={values.conditionNFT}
                            label={
                              <FormattedMessage
                                id="amount.condition"
                                defaultMessage="Amount condition"
                              />
                            }
                            onChange={(ev) =>
                              setFieldValue('conditionNFT', ev.target.value)
                            }
                          >
                            {Conditions.map((v, i) => (
                              <MenuItem value={v.symbol} key={i}>
                                {v.symbol} {v.sign}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          component={TextField}
                          type="number"
                          fullWidth
                          label={
                            <FormattedMessage
                              id={'nft.amount'}
                              defaultMessage={'NFT amount'}
                            />
                          }
                          placeholder="e.g., 100"
                          InputProps={{ min: 0 }}
                          name="amountNFT"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
            <Grid item xs={12}>
              <Typography fontWeight="500" variant="body1">
                <FormattedMessage
                  id="filter.by.token"
                  defaultMessage="Filter by token"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <SearchTokenAutocompleteWithTokens
                label={
                  <FormattedMessage
                    id="search.token"
                    defaultMessage="Search token"
                  />
                }
                disabled={values.chainId === undefined}
                data={{
                  address: values.tokenAddress,
                  chainId: values.chainId,
                }}
                chainId={values.chainId}
                onChange={(tk: any) => {
                  if (tk) {
                    setFieldValue('tokenAddress', tk.address);
                  } else {
                    setFieldValue('tokenAddress', undefined);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="condition-amount-select-label">
                  <FormattedMessage
                    id="amount.condition"
                    defaultMessage="Amount condition"
                  />
                </InputLabel>
                <Select
                  MenuProps={{
                    slotProps: {
                      paper: {
                        style: { width: 'fit-content' },
                      },
                    },
                  }}
                  labelId="condition-amount-select-label"
                  id="demo-simple-select"
                  value={values.condition}
                  label={
                    <FormattedMessage
                      id="amount.condition"
                      defaultMessage="Amount condition"
                    />
                  }
                  onChange={(ev) => setFieldValue('condition', ev.target.value)}
                >
                  {Conditions.map((v, i) => (
                    <MenuItem value={v.symbol} key={i}>
                      {v.symbol} {v.sign}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Field
                component={TextField}
                type="number"
                fullWidth
                label={
                  <FormattedMessage
                    id="token.amount.alt"
                    defaultMessage="Token amount"
                  />
                }
                InputProps={{ min: 0 }}
                placeholder="e.g., 100"
                name="amount"
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
