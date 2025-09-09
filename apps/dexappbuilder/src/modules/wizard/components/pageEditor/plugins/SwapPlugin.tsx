import SwapPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/SwapPlugin';
import type { CellPlugin } from '@react-page/editor';

const SwapPlugin: CellPlugin = {
  ...(SwapPluginViewer as any),
};

export default SwapPlugin;
