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
import { Container, Grid } from '@mui/material';

import { useProtectedAppConfig } from 'src/hooks/app';

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
  const { data: conditionsData } = useCheckGatedConditions({
    conditions,
    account,
  });
  const { data } = useProtectedAppConfig({
    isProtected,
    domain: site,
    slug,
    page,
    result: conditionsData?.result,
  });

  if (data?.data?.result) {
    return (
      <SectionsRenderer sections={data?.data?.sections} layout={pageLayout} />
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
          />
        </Grid>
      </Grid>
    </Container>
  );
}
