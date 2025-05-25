import type { CellPlugin } from '@react-page/editor';

import ContainerPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ContainerPlugin';

const ContainerPlugin: CellPlugin = {
  ...ContainerPluginViewer,
};

export default ContainerPlugin;
