import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab, Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAccountHoldDexkitQuery } from '@dexkit/ui/hooks/account';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { SiteResponse } from 'src/types/whitelabel';
import OwnershipSection from '../sections/OwnershipSection';
import SiteMetadataSection from '../sections/SiteMetadataSection';
import HidePoweredContainer from './HidePoweredContainer';

interface Props {
  site?: SiteResponse | null;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}
export default function OwnershipWizardContainer({
  config,
  onSave,
  onHasChanges,
  site,
}: Props) {
  const { data } = useAccountHoldDexkitQuery();

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Tooltip
            placement="top-start"
            title={
              <FormattedMessage
                id={'ownership.explainer'}
                defaultMessage={
                  'This NFT represents app ownership and editing rights. You can sell or transfer your app ownership through this NFT, hosted on Polygon. Who owns this NFT can edit it. '
                }
              />
            }
          >
            <Typography variant={'h6'}>
              <FormattedMessage id="ownership" defaultMessage="Ownership" />
            </Typography>
          </Tooltip>

          <Typography variant={'body2'}>
            <FormattedMessage
              id="ownership.settings.description"
              defaultMessage="Associate an NFT with your app for ownership control and update site metadata for marketing"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label={
                  <FormattedMessage
                    id="ownership"
                    defaultMessage={'Ownership'}
                  />
                }
                value="1"
              />
              <Tab
                label={
                  <FormattedMessage
                    id="site.metadata"
                    defaultMessage={'Site metadata'}
                  />
                }
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Grid item xs={12}>
              {data === false && (
                <Alert severity="warning">
                  <FormattedMessage
                    id="ownership.nft.info"
                    defaultMessage="To access this feature, simply hold 1000 KIT tokens on one of our supported networks: ETH, BSC, or Polygon.
              Note: NFT-associated apps are not clonable.
              "
                  />
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              {site?.id !== undefined && (
                <OwnershipSection id={site.id} nft={site.nft} />
              )}
            </Grid>
            <Grid item xs={12}>
              {site?.id !== undefined && (
                <HidePoweredContainer
                  config={config}
                  onSave={onSave}
                  isDisabled={data === false}
                  hasNFT={site?.nft !== undefined}
                />
              )}
            </Grid>
          </TabPanel>
          <TabPanel value="2">
            <SiteMetadataSection
              id={site?.id}
              slug={site?.slug}
              siteMetadata={site?.metadata ? site?.metadata : undefined}
            />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
}
