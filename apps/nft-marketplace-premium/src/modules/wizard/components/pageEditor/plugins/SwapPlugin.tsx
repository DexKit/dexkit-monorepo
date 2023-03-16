import type { CellPlugin } from '@react-page/editor';
import SwapWidget from '../components/SwapWidget';

const SwapPlugin: CellPlugin = {
  Renderer: () => <SwapWidget />,

  id: 'swap-crypto',
  title: 'Swap ',
  description: 'Swap crypto',
  version: 1,
};

export default SwapPlugin;
