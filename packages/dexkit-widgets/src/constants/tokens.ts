export const DEXKIT_TOKEN_ADDRESSES = [
  '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4', // Ethereum
  '0x4D0Def42Cf57D6f27CD4983042a55dce1C9F853c', // Polygon
  '0x314593fa9a2fa16432913dBcCC96104541d32D11', // BSC
  '0x946f8b0ef009f3f5b1b35e6511a82a58b09d8d4e', // Base
  '0x9134283aFaF6E1B45689EC0b0c82fF2B232BCb30', // Arbitrum

] as const;

export const DEXKIT_TOKEN_SYMBOL = 'KIT';

export const isDexKitToken = (token?: { address: string; symbol: string }) => {
  if (!token) return false;
  return DEXKIT_TOKEN_ADDRESSES.includes(token.address as any) && token.symbol === DEXKIT_TOKEN_SYMBOL;
}; 