import MainLayoutUI from '@dexkit/ui/components/layouts/main';
import Box from '@mui/material/Box';


interface Props {
  children: React.ReactNode | React.ReactNode[];
  
}

export default function MainLayout({children}: Props){


return <MainLayoutUI disablePadding={false}><Box pr={8} pl={8}>{children}</Box></MainLayoutUI>

};