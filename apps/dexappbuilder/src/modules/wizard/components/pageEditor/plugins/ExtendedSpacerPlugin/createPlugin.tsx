import type { CellPlugin } from '@react-page/editor';
import { lazyLoad } from '@react-page/editor';
import React from 'react';
import { defaultSettings } from './default/settings';
import { SpacerSettings } from './types/settings';

import type { SpacerState } from './types/state';

const AspectRatio = lazyLoad(() => import('@mui/icons-material/AspectRatio'));
const createPlugin: (settings: SpacerSettings) => CellPlugin<SpacerState> = (
  settings
) => {
  const mergedSettings = { ...defaultSettings, ...settings };

  return {
    Renderer: mergedSettings.Renderer,
    controls: {
      type: 'autoform',
      schema: {
        required: ['height'],
        properties: {
          height: {
            type: 'number',
          },
          hideInDesktop: {
            type: 'boolean',
          },
          hideInMobile: {
            type: 'boolean',
          },
        },
      },
    },
    id: 'ory/editor/core/content/spacer',
    version: 1,
    icon: <AspectRatio />,
    title: mergedSettings.translations?.pluginName,
    description: mergedSettings.translations?.pluginDescription,
    allowClickInside: true,
    createInitialData: () => ({
      height: 24,
      hideInDesktop: false,
      hideInMobile: false,
    }),
  };
};

export default createPlugin;
