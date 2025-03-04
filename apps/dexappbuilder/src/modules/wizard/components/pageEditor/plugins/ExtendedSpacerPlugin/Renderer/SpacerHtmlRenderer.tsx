import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { CellPluginComponentProps } from '@react-page/editor';
import { lazyLoad } from '@react-page/editor';

import React from 'react';
import { SpacerState } from '../types/state';

function HtmlSpacer(props: CellPluginComponentProps<SpacerState>) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (props.data.hideInDesktop && isDesktop) {
    return null;
  }

  if (props.data.hideInMobile && isMobile) {
    return null;
  }

  return (
    <div style={{ height: `${(props.data?.height || 0).toString()}px` }} />
  );
}

const SpacerResizable = lazyLoad(() => import('./SpacerResizable'));
const SpacerHtmlRenderer: React.FC<CellPluginComponentProps<SpacerState>> = (
  props
) => {
  return (
    <div className={'react-page-plugins-content-spacer'}>
      {props.isEditMode ? <SpacerResizable {...props} /> : HtmlSpacer(props)}
    </div>
  );
};

export default SpacerHtmlRenderer;
