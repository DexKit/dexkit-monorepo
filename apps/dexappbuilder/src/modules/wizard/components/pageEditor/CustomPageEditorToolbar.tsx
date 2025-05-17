import { useIsMobile } from '@dexkit/core';
import { Box, Paper, styled } from '@mui/material';
import { BottomToolbar, BottomToolbarProps } from '@react-page/editor';
import { memo } from 'react';

const BottomToolbarStyled = styled(BottomToolbar)({
  '&, & > *': {
    zIndex: `1200 !important`,
  },
});

const CustomPageEditorToolbar = memo<BottomToolbarProps>((props) => {
  const isMobile = useIsMobile();

  return (
    <Box sx={{
      width: '100%',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1200
    }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: isMobile ? 0 : undefined,
          p: isMobile ? 1 : undefined,
          maxWidth: isMobile ? '100%' : 'calc(100% - 40px)',
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