import {
  NETWORKS,
  NETWORK_FROM_SLUG,
  NETWORK_SLUG,
} from '@dexkit/core/constants/networks';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { useActiveChainIds } from '@dexkit/ui';
import { CollectionPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { hexToString } from '@dexkit/ui/utils';
import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Contract } from 'ethers';
import { Field, Formik } from 'formik';
import { Select, Switch, TextField } from 'formik-mui';
import { SyntheticEvent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { getProviderBySlug } from '@dexkit/ui/services/providers';
import { CreateCollectionFormSchema } from '../../constants/schemas';
import { CollectionItemAutocomplete } from './CollectionItemAutocomplete';
interface DropCheckboxProps {
  address: string;
  network: string;
}

function DropCheckbox({ address, network }: DropCheckboxProps) {
  const contractType = useAsyncMemo(
    async () => {
      if (isAddress(address)) {
        const contract = new Contract(
          address,
          [
            {
              inputs: [],

              name: 'contractType',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'pure',
              type: 'function',
            },
          ],
          getProviderBySlug(network),
        );

        try {
          const call = await contract.contractType();

          return hexToString(call);
        } catch (err) {
          return '';
        }
      }

      return '';
    },
    '',
    [address, network],
  );

  const isDrop = useMemo(() => {
    return contractType?.toLocaleLowerCase()?.search('drop') > -1;
  }, [contractType]);

  if (!isDrop) {
    return null;
  }

  return (
    <FormControlLabel
      control={<Field component={Switch} type="checkbox" name="hideDrops" />}
      label={<FormattedMessage id="hide.drops" defaultMessage="Hide Drops" />}
    />
  );
}

export interface CollectionSectionFormAltProps {
  section?: CollectionPageSection;
  onSave: (section: CollectionPageSection) => void;
  onChange: (section: CollectionPageSection) => void;
  onCancel: () => void;
  showSaveButton?: boolean;
}

export interface Form {
  address: string;
  network: string;
  hideFilters: boolean;
  hideHeader: boolean;
  hideDrops: boolean;
  hideAssets: boolean;
  showPageHeader: boolean;
}

export default function CollectionSectionFormAlt({
  section,
  onSave,
  onChange,
  onCancel,
  showSaveButton,
}: CollectionSectionFormAltProps) {
  const { activeChainIds } = useActiveChainIds();
  const handleSubmit = (config: Form) => {
    onSave({ type: 'collection', config });
  };

  const handleValiate = (config: Form) => {
    onChange({ type: 'collection', config });
  };

  const networks = useMemo(() => {
    return Object.keys(NETWORKS).map(
      (key: string) => NETWORKS[parseChainId(key)],
    );
  }, []);

  const [tab, setTab] = useState('import');

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setTab(value);
  };

  return (
    <Formik
      initialValues={
        section
          ? section.config
          : {
              address: '',
              network: 'ethereum',
              hideAssets: false,
              hideDrops: false,
              hideFilters: false,
              hideHeader: false,
              showPageHeader: false,
            }
      }
      onSubmit={handleSubmit}
      validate={handleValiate}
      validationSchema={CreateCollectionFormSchema}
      validateOnChange
    >
      {({ submitForm, isValid, values, setFieldValue, errors, setValues }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs sx={{ mb: 2 }} value={tab} onChange={handleChangeTab}>
              <Tab
                value="import"
                label={<FormattedMessage id="import" defaultMessage="Import" />}
              />
              <Tab
                value="collections"
                label={
                  <FormattedMessage
                    id="your.collections"
                    defaultMessage="your collections"
                  />
                }
              />
            </Tabs>
            {tab === 'import' ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      label={
                        <FormattedMessage
                          id="network"
                          defaultMessage="Network"
                        />
                      }
                      name="network"
                      fullWidth
                      renderValue={(value: string) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={1}
                          >
                            <Avatar
                              src={ipfsUriToUrl(
                                networks.find((n) => n.slug === value)
                                  ?.imageUrl || '',
                              )}
                              style={{ width: 'auto', height: '1rem' }}
                            />
                            <Typography variant="body1">
                              {networks.find((n) => n.slug === value)?.name}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      {networks
                        .filter((n) => activeChainIds.includes(n.chainId))
                        .map((n) => (
                          <MenuItem key={n.slug} value={n.slug}>
                            <ListItemIcon>
                              <Avatar
                                src={ipfsUriToUrl(n?.imageUrl || '')}
                                style={{ width: '1rem', height: '1rem' }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={n.name} />
                          </MenuItem>
                        ))}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="address"
                    label={
                      <FormattedMessage
                        id="contract.address"
                        defaultMessage="Contract address"
                      />
                    }
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <CollectionItemAutocomplete
                  value={{
                    chainId: NETWORK_FROM_SLUG(values.network)?.chainId,
                    contractAddress: values.address.toLowerCase(),
                  }}
                  onChange={(params: {
                    chainId: number;
                    contractAddress: string;
                  }) => {
                    const { chainId, contractAddress } = params;
                    setValues({
                      ...values,
                      address: contractAddress.toLowerCase(),
                      network: NETWORK_SLUG(chainId) || '',
                    });
                  }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>
                  <FormattedMessage id="advanced" defaultMessage="Advanced" />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideHeader"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.header"
                          defaultMessage="Hide Header"
                        />
                      }
                    />
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideFilters"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.filters"
                          defaultMessage="Hide Filters"
                        />
                      }
                    />
                    <FormControlLabel
                      control={
                        <Field
                          component={Switch}
                          type="checkbox"
                          name="hideAssets"
                        />
                      }
                      label={
                        <FormattedMessage
                          id="hide.assets"
                          defaultMessage="Hide Assets"
                        />
                      }
                    />
                    <DropCheckbox
                      key={values.address}
                      address={values.address}
                      network={values.network}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {showSaveButton && (
            <Grid item xs={12}>
              <Box>
                <Stack spacing={1} direction="row" justifyContent="flex-end">
                  <Button onClick={onCancel}>
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </Button>
                  <Button
                    disabled={!isValid}
                    onClick={submitForm}
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Formik>
  );
}
