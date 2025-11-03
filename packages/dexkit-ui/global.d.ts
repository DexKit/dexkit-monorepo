// Global type declarations to fix build issues with Next 15 and React 19

declare module 'minimatch' {
  interface IMinimatch {
    pattern: string;
    set: string[][];
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;
    match(s: string): boolean;
    makeRe(): RegExp | false;
  }

  interface IOptions {
    nobrace?: boolean;
    nocomment?: boolean;
    nonegate?: boolean;
    debug?: boolean;
    noglobstar?: boolean;
    noext?: boolean;
    nocase?: boolean;
    nonull?: boolean;
    matchBase?: boolean;
    flipNegate?: boolean;
  }

  function minimatch(target: string, pattern: string, options?: IOptions): boolean;
  namespace minimatch {
    function filter(pattern: string, options?: IOptions): (target: string) => boolean;
    function match(list: string[], pattern: string, options?: IOptions): string[];
    function makeRe(pattern: string, options?: IOptions): RegExp | false;
    var Minimatch: new (pattern: string, options?: IOptions) => IMinimatch;
  }
  export = minimatch;
}

// Declaraciones de tipos para módulos faltantes que se usan dinámicamente
declare module '@dexkit/ui/components/dialogs/QrReaderDialog' {
  import React from 'react';
  export interface QrReaderDialogProps {
    dialogProps?: {
      open?: boolean;
      onClose?: () => void;
    };
  }
  const QrReaderDialog: React.FC<QrReaderDialogProps>;
  export default QrReaderDialog;
}

declare module '../section-config/dialogs/EditGatedConditionDialog' {
  import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
  import React from 'react';
  export interface EditGatedConditionDialogProps {
    DialogProps?: {
      open?: boolean;
      onClose?: () => void;
      fullWidth?: boolean;
      maxWidth?: string;
    };
    onSaveGatedCondition?: (condition: GatedCondition, index?: number) => void;
    isFirst?: boolean;
    index?: number;
    condition?: GatedCondition;
  }
  const EditGatedConditionDialog: React.FC<EditGatedConditionDialogProps>;
  export default EditGatedConditionDialog;
}

declare module '@dexkit/darkblock-evm-widget' {
  import React from 'react';
  export interface EVMDarkblockWidgetProps {
    contractAddress?: string;
    chainId?: number;
    tokenId?: string;
    account?: string;
    provider?: any;
    cb?: () => void;
  }
  export const EVMDarkblockWidget: React.FC<EVMDarkblockWidgetProps>;
}