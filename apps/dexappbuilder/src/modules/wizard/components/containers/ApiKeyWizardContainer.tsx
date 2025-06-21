import { SiteResponse } from '@dexkit/ui/modules/wizard/types/config';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';

import { AddCredits } from '@dexkit/ui/components/AddCredits';
import { CopyText } from '@dexkit/ui/components/CopyText';
import {
  API_KEY_FREE_MONTHLY_LIMIT,
  API_KEY_PRICE,
  CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  WIDGET_SIGNATURE_FEAT,
} from '@dexkit/ui/constants/featPayments';
import { useApiKeyByAccount } from '@dexkit/ui/hooks/apiKey';
import { useActiveFeatUsage } from '@dexkit/ui/hooks/payments';

interface Props {
  site?: SiteResponse | null;

  isWidget?: boolean;
}
export default function ApiKeyWizardContainer({
  isWidget,

  site,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const apiKeyQuery = useApiKeyByAccount();

  const uuid = apiKeyQuery.data?.uuid;
  const monthlyRequests = apiKeyQuery.data?.monthlyCount;
  const isLoading = apiKeyQuery.isLoading;

  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: isWidget ? WIDGET_SIGNATURE_FEAT : CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  });

  const isPaid = activeFeatUsageQuery.data
    ? activeFeatUsageQuery?.data?.active
    : undefined;

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid item xs={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            <FormattedMessage id="api.key" defaultMessage="Api Key" />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="api.key.settings.description"
              defaultMessage="Api key is required to access the DexKit API on self hosting apps and embedded widgets."
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <AddCredits
          isHidePowered={true}
          isWidget={isWidget}
          alertWarningMessage={
            <FormattedMessage
              id="you.have.requests.number.for.free.make.sure.to.have.credits.to.not.disrupt.service.each.request.cost.price"
              defaultMessage={
                'You have {freeRequestsNumber} requests on free tier. Make sure to have credits to not disrupt service. We charge per request: {requestCost} usd.'
              }
              values={{
                freeRequestsNumber: API_KEY_FREE_MONTHLY_LIMIT,
                requestCost: API_KEY_PRICE,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h6'}>
          <FormattedMessage
            id={'monthly.free.requests'}
            defaultMessage={'Monthly free requests'}
          />
        </Typography>
        <Stack
          direction={'row'}
          spacing={1}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography variant={'subtitle1'}>
            {monthlyRequests ? monthlyRequests : isLoading ? '-' : '0'} /
            {` ${API_KEY_FREE_MONTHLY_LIMIT}`}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Typography variant={'h6'}>
          <FormattedMessage id={'api.key'} defaultMessage={'API Key'} />
        </Typography>
        <Stack
          spacing={isMobile ? 0.5 : 1}
          direction={'row'}
          sx={{
            mb: isMobile ? 1.5 : 2,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {isLoading ? (
            <Skeleton>
              <Typography variant={isMobile ? 'h6' : 'h5'}>
                <FormattedMessage
                  id="api.key.loading"
                  defaultMessage={'API Key loading.'}
                />
              </Typography>
            </Skeleton>
          ) : (
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              {uuid || (
                <FormattedMessage
                  id="api.key.not.found.please.create.one"
                  defaultMessage={'API Key not found. Please create one.'}
                />
              )}
            </Typography>
          )}
          {uuid && <CopyText text={uuid} />}
        </Stack>
      </Grid>
    </Grid>
  );
}
