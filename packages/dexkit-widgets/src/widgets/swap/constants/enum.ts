export enum ExecSwapState {
  quote = "quote",
  gasless_approval = "gasless_approval",
  gasless_trade = "gasless_trade",
  gasless_trade_submit = "gasless_trade_submit",
  gasless_trade_confirmed = "gasless_trade_confirmed",
  approve = "approve",
  swap = "swap",
}

enum JobFailureReason {
  // Transaction simulation failed so no transaction is submitted onchain.
  // Our system simulate the transaction before submitting onchain.
  TransactionSimulationFailed = "transaction_simulation_failed",
  // The order expired
  OrderExpired = "order_expired",
  // Last look declined by the market maker
  LastLookDeclined = "last_look_declined",
  // Transaction(s) submitted onchain but reverted
  TransactionReverted = "transaction_reverted",
  // Error getting market signature / signature is not valid; this is NOT last look decline
  MarketMakerSignatureError = "market_maker_sigature_error",
  // Fallback error reason
  InternalError = "internal_error",
}
