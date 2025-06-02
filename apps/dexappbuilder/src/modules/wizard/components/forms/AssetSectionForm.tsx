import { Field, Formik } from 'formik';

import {
  NETWORKS,
  NETWORK_FROM_SLUG,
  NETWORK_SLUG,
} from '@dexkit/core/constants/networks';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import { AssetPageSection } from '@dexkit/ui/modules/wizard/types/section';
import {
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
import { Select, Switch, TextField } from 'formik-mui';
import { SyntheticEvent, useContext, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useIntegrationDataQuery } from '../../hooks/integrations';
import { SiteContext } from '../../providers/SiteWizardProvider';
import { AssetFormType } from '../../types';
import { CollectionItemAutocomplete } from './CollectionItemAutocomplete';
export interface AssetSectionFormProps {
  onCancel: () => void;
  onSave: (section: AssetPageSection) => void;
  onChange: (section: AssetPageSection) => void;
  section?: AssetPageSection;
  showSaveButton?: boolean;
}

export default function AssetSectionForm({
  onCancel,
  onSave,
  onChange,
  section,
  showSaveButton,
}: AssetSectionFormProps) {
  const { activeChainIds } = useActiveChainIds();
  const handleSubmit = async (values: AssetFormType) => {
    onSave({ type: 'asset-section', config: values });
  };

  const handleValidate = (values: any) => {
    onChange({ type: 'asset-section', config: values });
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

  const { siteId } = useContext(SiteContext);

  const darkblockQuery = useIntegrationDataQuery({ type: 'darkblock', siteId });

  return darkblockQuery.isFetched ? (
    <Formik
      initialValues={
        section
          ? {
              ...section.config,
              enableDrops: section.config.enableDrops
                ? section.config.enableDrops
                : false,
              enableFiat: section.config.enableFiat
                ? section.config.enableFiat
                : false,
              enableDarkblock: section.config.enableDarkblock
                ? section.config.enableDarkblock
                : darkblockQuery.data
                ? darkblockQuery.data.settings.enableDarkblock
                : false,
            }
          : {
              address: '',
              network: '',
              tokenId: '',
              enableDrops: false,
              enableFiat: false,
              enableDarkblock: false,
            }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setValues, values, isValid, submitForm }) => (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field
                  component={Select}
                  label={
                    <FormattedMessage id="network" defaultMessage="Network" />
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
                            networks.find((n) => n.slug === value)?.imageUrl ||
                              '',
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
              <Tabs value={tab} onChange={handleChangeTab}>
                <Tab
                  value="import"
                  label={
                    <FormattedMessage id="import" defaultMessage="Import" />
                  }
                />
                <Tab
                  value="collections"
                  label={
                    <FormattedMessage
                      id="your.collections"
                      defaultMessage="Your collections"
                    />
                  }
                />
              </Tabs>
            </Grid>
            {tab === 'import' ? (
              <Grid item xs={12}>
                <Grid container spacing={2}>
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
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      fullWidth
                      name="tokenId"
                      label={
                        <FormattedMessage
                          id="token.id"
                          defaultMessage="Token ID"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <CollectionItemAutocomplete
                        value={{
                          chainId: NETWORK_FROM_SLUG(values.network)?.chainId,
                          contractAddress: values.address.toLowerCase(),
                        }}
                        onChange={({
                          contractAddress,
                          chainId,
                        }: {
                          contractAddress: string;
                          chainId: number;
                        }) => {
                          setValues({
                            ...values,
                            address: contractAddress.toLowerCase(),
                            network: NETWORK_SLUG(chainId) || '',
                          });
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      fullWidth
                      name="tokenId"
                      label={
                        <FormattedMessage
                          id="token.id"
                          defaultMessage="Token ID"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Field
                        component={Switch}
                        name="enableFiat"
                        type="checkbox"
                      />
                    }
                    label={
                      <FormattedMessage
                        id="enable.fiat"
                        defaultMessage="Enable Fiat"
                      />
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Field
                        component={Switch}
                        name="enableDrops"
                        type="checkbox"
                      />
                    }
                    label={
                      <FormattedMessage
                        id="enable.drop"
                        defaultMessage="Enable Drop"
                      />
                    }
                  />
                </Grid>
                {darkblockQuery.data &&
                  darkblockQuery.data.settings.enableDarkblock && (
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Field
                            component={Switch}
                            name="enableDarkblock"
                            type="checkbox"
                          />
                        }
                        label={
                          <FormattedMessage
                            id="enable.drop"
                            defaultMessage="Enable Darkblock"
                          />
                        }
                      />
                    </Grid>
                  )}
              </Grid>
            </Grid>
            {showSaveButton && (
              <Grid item xs={12}>
                <Box>
                  <Stack justifyContent="flex-end" direction="row" spacing={1}>
                    <Button onClick={onCancel}>
                      <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button
                      disabled={!isValid}
                      onClick={submitForm}
                      variant="contained"
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Formik>
  ) : null;
}
