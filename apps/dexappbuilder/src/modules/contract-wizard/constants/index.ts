export const ERC721_BASE_CONTRACT_URL =
  'https://raw.githubusercontent.com/DexKit/wizard-contracts/next-main/artifacts/contracts/ERC721_BASE.sol/Collection.json';
export const ERC20_BASE_CONTRACT_URL =
  'https://raw.githubusercontent.com/DexKit/wizard-contracts/main/artifacts/contracts/ERC20_BASE.sol/Token.json';

export const THIRDWEB_ROLE_DESCRIPTIONS: {
  [key: string]: {
    title: { id: string; defaultMessage: string };
    description: { id: string; defaultMessage: string };
  };
} = {
  admin: {
    title: { id: 'admin', defaultMessage: 'Admin' },
    description: {
      id: 'determine.who.can.grant.or.revoke.roles.and.modify.settings.on.this.contract.',
      defaultMessage:
        'Determine who can grant or revoke roles and modify settings on this contract.',
    },
  },
  minter: {
    title: { id: 'minter.creator', defaultMessage: 'Minter / Creator' },
    description: {
      id: 'determine.who.can.mint.create.new.tokens.on.this.contract',
      defaultMessage:
        'Determine who can mint / create new tokens on this contract.',
    },
  },
  transfer: {
    title: { id: 'transfer', defaultMessage: 'Transfer' },
    description: {
      id: 'determine.who.can.transfer.tokens.on.this.contract',
      defaultMessage: 'Determine who can transfer tokens on this contract.',
    },
  },
};
