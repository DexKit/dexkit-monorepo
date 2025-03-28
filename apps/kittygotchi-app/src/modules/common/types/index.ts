export const TESt = 1;

export interface MagicState {
  showTransactionModal: boolean;
  showSignDataDialog: boolean;
  handleShowTransactionModal: () => void;
  handleCloseTransactionModal: () => void;
  handleTransactionConfirm?: (data: any) => void;
  handleTransactionCancel?: () => void;
  handleSignConfirm?: () => void;
  handleSignCancel?: () => void;
  data?: any;
  signData?: any;
}
