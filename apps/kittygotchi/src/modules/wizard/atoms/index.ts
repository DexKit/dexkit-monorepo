import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';

interface Collection {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  abi: any[];
  chainId?: number;
}

interface Token {
  name: string;
  symbol: string;
  supply: number;
  chainId?: number;
  transactionHash?: string;
  address?: string;
}

export interface WizardState {
  readonly collections: Collection[];
  readonly tokens: Token[];
}

export const wizardStateAtom = atomWithStorage<WizardState>('wizardState', {
  collections: [],
  tokens: [],
});

export const collectionsAtom = focusAtom<WizardState, Collection[], void>(
  wizardStateAtom,
  (o) => o.prop('collections')
);

export const tokensAtom = focusAtom<WizardState, Token[], void>(
  wizardStateAtom,
  (o) => o.prop('tokens')
);
