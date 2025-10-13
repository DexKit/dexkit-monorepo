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
      <Box pr={isMobile ? 2 : 8} pl={isMobile ? 2 : 8}>
        {children}
      </Box>
    </MainLayoutUI>
  );
}
