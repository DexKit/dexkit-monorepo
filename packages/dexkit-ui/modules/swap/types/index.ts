import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { type UseQueryResult } from "@tanstack/react-query";
import { type providers } from "ethers";

export type txMutationParams = {
  chainId?: ChainId;
  quote?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse | null | undefined;
  quoteQuery: UseQueryResult<
    ZeroExQuoteResponse | ZeroExGaslessQuoteResponse | null,
    unknown
  >;
  side: "buy" | "sell";
  buyAmount: string;
  sellToken: Token;
  buyToken: Token;
  sellAmount?: string;
  canGasless: boolean;
  provider?: providers.Web3Provider;
};

export type ZeroExQuote = {
  chainId: ChainId;
  taker: string;
  swapFeeBps?: string;
  swapFeeRecipient?: string;
  swapFeeToken?: string;
  tradeSurplusRecipient?: string;
  slippageBps?: number;
  txOrigin?: string;

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

  affiliateAddress?: string;

  feeRecipient?: string;

  buyTokenPercentageFee?: number;
};

export type ZeroExQuoteResponse = {
  price: string;
  guaranteedPrice: any;
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
  buyToken: string;
  sellToken: string;
  allowanceTarget: any;
  orders: any;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: any;
  transaction?: any;
  fees?: any;
  issues?: any;
  permit2?: any;
  trade?: any;
  liquidityAvailable: boolean;
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

export type ZeroExGaslessQuoteResponse = {
  price: string;
  guaranteedPrice: any;
  estimatedPriceImpact: any;
  buyToken: string;
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
  sellToken: string;
  allowanceTarget: any;
  orders: any;
  sellTokenToEthRate: any;
  buyTokenToEthRate: any;
  expectedSlippage: any;
  trade: {
    type: string;
    hash: string;
    eip712: {
      types: any;
      primaryType: any;
      domain: any;
      message: any;
    };
  };
  approval: {
    isRequired: boolean;
    isGasslessAvailable: boolean;
    type: string;
    hash: string;
    eip712: {
      types: any;
      primaryType: any;
      domain: any;
      message: any;
    };
  };
  issues: any;
  liquidityAvailable: boolean;
};

export type ZeroExQuoteGasless = {
  chainId: ChainId;
  taker: string;
  swapFeeRecipient: string;
  swapFeeBps?: number;
  swapFeeToken?: string;
  tradeSurplusRecipient?: string;
  slippageBps?: number;
  excludedSources?: string;

  // Ethereum Address
  sellToken?: string;

  // Ethereum Address
  buyToken?: string;

  // bigNumber
  sellAmount?: string;

  // bigNumber
  buyAmount?: string;

  issues?: any;

  approval?: any;

  trade?: any;
};

export type ZeroExQuoteMetaTransactionResponse = {
  liquidityAvailable: boolean;
  buyAmount: string;
  buyTokenAddress: string;
  estimatedPriceImpact: string;
  price: string;
  sellAmount: string;
  sellTokenAddress: string;
  grossBuyAmount: string;
  grossSellAmount: string;
  grossPrice: string;
  grossEstimatedPriceImpact: string;
  allowanceTarget: string;
  sources: any;

  fees: any;
  trade: {
    type: "metatransaction_v2";
    hash: string;
    eip712: {
      types: {
        EIP712Domain: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "version";
            type: "string";
          },
          {
            name: "chainId";
            type: "uint256";
          },
          {
            name: "verifyingContract";
            type: "address";
          },
        ];

        MetaTransactionDataV2: [
          {
            name: "signer";
            type: "address";
          },
          {
            name: "sender";
            type: "address";
          },
          {
            name: "expirationTimeSeconds";
            type: "uint256";
          },
          {
            name: "salt";
            type: "uint256";
          },
          {
            name: "callData";
            type: "bytes";
          },
          {
            name: "feeToken";
            type: "address";
          },
          {
            name: "fees";
            type: "MetaTransactionFeeData[]";
          },
        ];

        MetaTransactionFeeData: [
          {
            name: "recipient";
            type: "address";
          },
          {
            name: "amount";
            type: "uint256";
          },
        ];
      };

      primaryType: "MetaTransactionDataV2";
      domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
      };

      message: {
        signer: string;
        sender: string;
        expirationTimeSeconds: string;
        salt: string;
        callData: string;
        feeToken: string;
        fees: [
          {
            recipient: string;
            amount: string;
          },
          {
            recipient: string;
            amount: string;
          },
        ];
      };
    };
  };

  approval: {
    isRequired: boolean;
    isGaslessAvailable: boolean;
    type: "permit";
    hash: string;
    eip712: {
      types: {
        EIP712Domain: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "version";
            type: "string";
          },
          {
            name: "verifyingContract";
            type: "address";
          },
          {
            name: "salt";
            type: "bytes32";
          },
        ];
        Permit: [
          {
            name: "owner";
            type: "address";
          },
          {
            name: "spender";
            type: "address";
          },
          {
            name: "value";
            type: "uint256";
          },
          {
            name: "nonce";
            type: "uint256";
          },
          {
            name: "deadline";
            type: "uint256";
          },
        ];
      };
      primaryType: "Permit";
      domain: {
        name: string;
        version: string;
        verifyingContract: string;
        salt: string;
      };
      message: {
        owner: string;
        spender: string;
        value: string;
        nonce: number;
        deadline: string;
      };
    };
  };
};

export enum SignatureType {
  Illegal = 0,
  Invalid = 1,
  EIP712 = 2,
  EthSign = 3,
}
