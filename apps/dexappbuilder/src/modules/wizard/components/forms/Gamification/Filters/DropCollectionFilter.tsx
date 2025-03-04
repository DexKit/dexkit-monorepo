import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { GamificationPoint } from '@/modules/wizard/types';
import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionItemAutocomplete } from '../../CollectionItemAutocomplete';
import { Conditions } from '../constants/conditions';

interface DropCollectionFilter {
  chainId?: number;
  collectionAddress?: string;
  tokenId?: string;
  conditionNFT?: string;
  amountNFT?: number;
}

const DropCollectionFilterSchema: Yup.SchemaOf<DropCollectionFilter> =
  Yup.object().shape({
    chainId: Yup.number(),

    amountNFT: Yup.number(),
    conditionNFT: Yup.string(),
    tokenId: Yup.string(),

    collectionAddress: Yup.string(),
  });

interface Props {
  onCancel?: () => void;
  onSubmit?: (item: DropCollectionFilter) => void;
  onChange?: (item: DropCollectionFilter, isValid: boolean) => void;
  item?: DropCollectionFilter;
  isERC1155?: boolean;
  index?: number;
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

export default function DropCollectionFilterForm({
  item,
  index,
  onCancel,
  onSubmit,
  onChange,
  isERC1155,
}: Props) {
  const { setFieldValue, values } = useFormikContext<{
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  }>();

  const { chainId } = useWeb3React();

  const filter = useMemo(() => {
    if (index !== undefined && values.settings[index].filter) {
      return JSON.parse(values.settings[index].filter ?? '{}') as {
        chainId: number;
        collectionAddress: string;
        conditionNFT: string;
        mode: number;
      };
    }

    return {
      chainId: chainId,
      mode: -1,
      collectionAddress: '',
      conditionNFT: '',
    };
  }, [index, JSON.stringify(values), chainId]);

  const setValue = useCallback(
    (field: string, value: any) => {
      setFieldValue(
        `settings.${index}.filter`,
        JSON.stringify({ ...filter, [field]: value }),
      );
    },
    [filter, index],
  );

  const handleChange = (event: SelectChangeEvent<number>) => {
    setValue('mode', event.target.value as number);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <NetworkSelectDropdown
          label={<FormattedMessage id="network" defaultMessage="Network" />}
          chainId={index !== undefined ? filter?.chainId : undefined}
          onChange={(chainId) => {
            setFieldValue(
              `settings.${index}.filter`,
              JSON.stringify({
                ...filter,
                chainId,
                tokenAddress: '',
                collectionAddres: '',
              }),
            );
          }}
          labelId="Choose network"
          enableTestnet={true}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography fontWeight="500" variant="body1">
          <FormattedMessage
            id="filter.by.collection"
            defaultMessage="Filter by collection"
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              {filter?.mode !== -1 && (
                <InputLabel shrink>
                  <FormattedMessage
                    id="choose.an.option"
                    defaultMessage="Choose an option"
                  />
                </InputLabel>
              )}

              <Select
                value={filter?.mode ?? -1}
                onChange={handleChange}
                notched
                label={
                  filter?.mode && filter?.mode === -1 ? undefined : (
                    <FormattedMessage
                      id="choose.an.option"
                      defaultMessage="Choose an option"
                    />
                  )
                }
                renderValue={
                  filter?.mode && filter?.mode == -1
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
              <TabPanel value={filter.mode} index={1}>
                <Grid item xs={12} sm={6}>
                  <CollectionItemAutocomplete
                    onChange={(coll) => {
                      setFieldValue(
                        `settings.${index}.filter`,
                        JSON.stringify({
                          ...filter,
                          collectionAddress: coll?.contractAddress,
                        }),
                      );
                    }}
                    filterByChainId={true}
                    chainId={filter?.chainId}
                    disabled={filter?.chainId === undefined}
                    value={{
                      contractAddress: filter?.collectionAddress,
                      chainId: filter?.chainId,
                    }}
                  />
                </Grid>
              </TabPanel>
              <TabPanel value={filter.mode} index={0}>
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
        </Grid>
      </Grid>

      {filter?.mode !== -1 && (
        <>
          {isERC1155 === true && (
            <>
              <Grid item xs={12} sm={4}>
                <Field
                  component={TextField}
                  type="text"
                  fullWidth
                  label={
                    <FormattedMessage id="nft.id" defaultMessage="NFT ID" />
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
                    value={filter?.conditionNFT}
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
                      id="nft.amount.alt"
                      defaultMessage="NFT amount"
                    />
                  }
                  InputProps={{ min: 0 }}
                  name="amount"
                  placeholder="e.g., 100"
                />
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
}
