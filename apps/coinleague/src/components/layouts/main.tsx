import MainLayoutUI from '@dexkit/ui/components/layouts/main';
import Box from '@mui/material/Box';
import React from 'react';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  disableAutoLogin?: boolean;
}

export default function MainLayout({children, ...rest}:Props){

  return <MainLayoutUI {...rest}> <Box pl={8} pr={8}>{children}</Box></MainLayoutUI>

};
