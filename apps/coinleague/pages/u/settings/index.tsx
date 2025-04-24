import { Box, Container, Stack } from '@mui/material';

import BillingSection from '@/modules/user/componentes/BillingSection';
import PaymentsSection from '@/modules/user/componentes/PaymentsSection';
import SettingsLayout from '@/modules/user/componentes/SettingsLayout';
import { DexkitApiProvider } from '@dexkit/core/providers';
import AuthMainLayout from 'src/components/layouts/authMain';
import { myAppsApi } from 'src/services/whitelabel';

export default function SettingsPage() {
  const searchParams = new URLSearchParams(window.location.search);

  const section = searchParams.get('section');

  return (
    <Container>
      <Stack spacing={2}>
        <Box>
          <SettingsLayout tab={section ? (section as string) : 'ai'} shallow>
            {(tab) => (
              <>
                {tab === 'payments' && <PaymentsSection />}
                {/* {tab === 'ai' && <AssitantAISection />} */}
                {tab === 'billing' && <BillingSection />}
              </>
            )}
          </SettingsLayout>
        </Box>
      </Stack>
    </Container>
  );
}

(SettingsPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};


