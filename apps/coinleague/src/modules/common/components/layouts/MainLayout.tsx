import { useIsMobile } from '@dexkit/core';
import MainLayoutUI from '@dexkit/ui/components/layouts/main';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export default function MainLayout({ children }: Props) {
  const isMobile = useIsMobile();

  return (
    <MainLayoutUI disablePadding={false}>
      <Box pr={isMobile ? 2 : 8} pl={isMobile ? 2 : 8}>
        {children}
      </Box>
    </MainLayoutUI>
  );
}
