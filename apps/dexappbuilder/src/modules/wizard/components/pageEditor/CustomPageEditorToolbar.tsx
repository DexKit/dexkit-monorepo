import { useIsMobile } from '@dexkit/core';
import { Box, Paper, styled, useTheme } from '@mui/material';
import { BottomToolbar, BottomToolbarProps } from '@react-page/editor';
import { memo } from 'react';

const BottomToolbarStyled = styled(BottomToolbar)(({ theme }) => ({
  '&, & > *': {
    zIndex: `${theme.zIndex.modal + 100} !important`,
  },
}));

const CustomPageEditorToolbar = memo<BottomToolbarProps>((props: any) => {
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <Box sx={{
      width: '100%',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: theme.zIndex.modal + 100
    }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: isMobile ? 0 : undefined,
          p: isMobile ? theme.spacing(1) : 'inherit',
          maxWidth: isMobile ? '100%' : `calc(100% - ${theme.spacing(5)})`,
          mx: 'auto'
        }}
      >
        <BottomToolbarStyled {...props} />
      </Paper>
    </Box>
  );
});

CustomPageEditorToolbar.displayName = 'CustomPageEditorToolbar';

export default CustomPageEditorToolbar; 