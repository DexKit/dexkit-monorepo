export type ZeroExQuote = {
  // Ethereum Address
  sellToken?: string;

  // Ethereum Address
  buyToken?: string;

  // bigNumber
  sellAmount?: string;

  // bigNumber
  buyAmount?: string;

  // 0.03 = 3%
  slippagePercentage?: number;

  // bigNumber
  gasPrice?: string;

  // Ethereum Address
  takerAddress?: string;

  skipValidation?: boolean;

  // Ethereum Address
  feeRecipient?: string;

  buyTokenPercentageFee?: number;

  // Ethereum Address
  affiliateAddress: string;

  enableSlippageProtection?: boolean;

  priceImpactProtectionPercentage?: boolean;

  intentOnFilling?: boolean;
};

export type ZeroExQuoteResponse = {
  price: string;
  guaranteedPrice: any;
  estimatedPriceImpact: any;
  to: string;
  data: string;
  value: string;
  gasPrice: string;
  gas: string;
  estimatedGas: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyAmount: string;
  sellAmount: string;
  sources: any;
  buyTokenAddress: string;
  sellTokenAddress: string;
  allowanceTarget: any;
  orders: any;
  sellTokenToEthRate: any;
  buyTokenToEthRate: any;
  expectedSlippage: any;
  permit2?: any;
};

export type ZrxOrder = {
  chainId: number;
  expiry: string;
  feeRecipient: string;
  maker: string;
  makerAmount: string;
  makerToken: string;
  pool: string;
  salt: string;
  sender: string;
  signature: {
    r: string;
    s: string;
    signatureType: number;
    v: number;
  };
  taker: string;
  takerAmount: string;
  takerToken: string;
  takerTokenFeeAmount: string;
  verifyingContract: string;
};

export type ZrxOrderRecord = {
  metaData: {
    createdAt: string;
    orderHash: string;
    remainingFillableTakerAmount: string;
  };
  order: ZrxOrder;
};

export type ZrxOrderbookResponse = {
  total: number;
  page: number;
  perPage: number;
  records: ZrxOrderRecord[];
};
