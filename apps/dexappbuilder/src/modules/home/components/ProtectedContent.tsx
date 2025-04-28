import { GatedConditionView } from '@/modules/wizard/components/gated-content/GatedConditionView';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { useCheckGatedConditions } from '@/modules/wizard/hooks';
import { useAuth } from '@dexkit/ui/hooks/auth';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import { PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useProtectedAppConfig } from 'src/hooks/app';

const hasError = (data: { sections?: AppPageSection[] } | null | undefined): boolean => {
  if (!data) return true;
  if (!data.sections) return true;
  return false;
};

export default function ProtectedContent({
  isProtected,
  conditions,
  site,
  page,
  layout,
  pageLayout,
  slug,
}: {
  isProtected: boolean;
  layout?: GatedPageLayout;
  pageLayout?: PageSectionsLayout;
  conditions?: GatedCondition[];
  site: string;
  slug?: string;
  page: string;
}) {
  const { account } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    data: conditionsData, 
    isLoading: isCheckingConditions,
    refetch,
  } = useCheckGatedConditions({
    conditions,
    account,
  });
  
  const { data: protectedConfigResponse } = useProtectedAppConfig({
    isProtected,
    domain: site,
    slug,
    page,
    result: conditionsData?.result,
  });

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  if (protectedConfigResponse?.sections) {
    return (
      <SectionsRenderer sections={protectedConfigResponse.sections} layout={pageLayout} />
    );
  }

  if (hasError(protectedConfigResponse) && account && isLoggedIn) {
    return (
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Stack spacing={3} my={4} alignItems="center">
              <Alert severity="error" sx={{ width: '100%' }}>
                <Typography variant="body1">
                  {conditionsData && 'errorMessage' in conditionsData && conditionsData.errorMessage ? conditionsData.errorMessage : (
                    <FormattedMessage 
                      id="error.checking.conditions" 
                      defaultMessage="There was an error while checking your assets. Please try again."
                    />
                  )}
                </Typography>
              </Alert>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
              >
                <FormattedMessage id="retry" defaultMessage="Retry" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8}>
          <GatedConditionView
            account={account}
            conditions={conditions}
            layout={layout}
            isLoggedIn={isLoggedIn}
            result={conditionsData?.result}
            partialResults={conditionsData?.partialResults}
            balances={conditionsData?.balances}
            isLoading={isCheckingConditions}
            onRetry={handleRetry}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
