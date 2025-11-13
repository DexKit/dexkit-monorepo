import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAccountHoldDexkitQuery } from '@dexkit/ui/hooks/account';
import {
  AppConfig,
  SiteResponse,
} from '@dexkit/ui/modules/wizard/types/config';

import OwnershipSection from '../sections/OwnershipSection';
import SiteMetadataSection from '../sections/SiteMetadataSection';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data } = useAccountHoldDexkitQuery();

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
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
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontSize: isMobile ? '1.15rem' : '1.5rem',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              <FormattedMessage id="ownership" defaultMessage="Ownership" />
            </Typography>
          </Tooltip>

          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="ownership.settings.description"
              defaultMessage="Associate an NFT with your app for ownership control and update site metadata for marketing"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <TabContext value={value}>
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '.MuiTabs-flexContainer': {
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            },
            '.MuiTab-root': {
              fontSize: isMobile ? '0.85rem' : 'inherit',
              padding: isMobile ? '8px 12px' : 'inherit',
              minWidth: isMobile ? 'auto' : undefined,
              flex: isMobile ? '1 1 auto' : undefined,
            },
          }}>
            <TabList onChange={handleChange} aria-label="ownership tabs" variant={isMobile ? "scrollable" : "standard"}>
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
          <TabPanel value="1" sx={{ padding: isMobile ? '8px 0' : 'inherit' }}>
            <Grid size={12}>
              {data === false && (
                <Alert
                  severity="warning"
                  sx={{
                    fontSize: isMobile ? '0.85rem' : 'inherit',
                    '& .MuiAlert-message': {
                      padding: isMobile ? '4px' : 'inherit'
                    }
                  }}
                >
                  <FormattedMessage
                    id="ownership.nft.info"
                    defaultMessage="To access this feature, simply hold 1000 KIT tokens on one of our supported networks: ETH, BSC, or Polygon.
              Note: NFT-associated apps are not clonable.
              "
                  />
                </Alert>
              )}
            </Grid>

            <Grid size={12}>
              {site?.id !== undefined && (
                <OwnershipSection id={site.id} nft={site.nft} isMobile={isMobile} />
              )}
            </Grid>
            {/* <Grid size={12}>
              {site?.id !== undefined && (
                <HidePoweredContainer
                  config={config}
                  onSave={onSave}
                  isDisabled={data === false}
                  hasNFT={site?.nft !== undefined}
                />
              )}
            </Grid>*/}
          </TabPanel>
          <TabPanel value="2" sx={{ padding: isMobile ? '8px 0' : 'inherit' }}>
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
