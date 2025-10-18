import { useIsMobile } from '@dexkit/core';
import MainLayoutUI from '@dexkit/ui/components/layouts/main';
import Box from '@mui/material/Box';
import { CoinLeagueNavbarOverride } from '../../../../components/CoinLeagueNavbarOverride';
import { useAppConfig } from '../../../../hooks/app';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export default function MainLayout({ children }: Props) {
  const isMobile = useIsMobile();
  const appConfig = useAppConfig();

  return (
    <MainLayoutUI disablePadding={false}>
      <CoinLeagueNavbarOverride appConfig={appConfig} />
      <Box
        pr={{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
        pl={{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
      >
        {children}
      </Box>
    </MainLayoutUI>
  );
}
