export interface Lock {
  asOf: number;
  name: string;
  publicLockVersion: number;
  maxNumberOfKeys: number; // -1 means Infinite
  expirationDuration: number;
  keyPrice: string;
  beneficiary: string;
  balance: string;
  outstandingKeys: number;
  currencyContractAddress: string | null;
}
