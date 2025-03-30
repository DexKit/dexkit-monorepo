import React from 'react';
import { MagicState } from '../types';

export const MagicStateContext = React.createContext<MagicState>({
  showTransactionModal: false,
  showSignDataDialog: false,
  handleShowTransactionModal: () => {},
  handleCloseTransactionModal: () => {},
  handleTransactionConfirm: () => {},
  handleTransactionCancel: () => {},
  handleSignConfirm: () => {},
  handleSignCancel: () => {},
  data: {},
  signData: {},
});
