import { ethers } from 'ethers';
import { FormattedMessage } from 'react-intl';
import {
  AcceptTransactionMetadata,
  ApproveForAllTransactionMetadata,
  ApproveTransactionMetadata,
  BuyTransactionMetadata,
  CancelTransactionMetadata,
  SwapTransactionMetadata,
  TransactionMetadata,
  TransactionType,
} from '../types/blockchain';
import { OrderDirection } from '../types/orderbook';

interface Props {
  metadata?: TransactionMetadata;
  type?: TransactionType;
}

export function TransactionTitle({ metadata, type }: Props) {
  if (metadata) {
    switch (type) {
      case TransactionType.CANCEL: {
        let { asset, order } = metadata as CancelTransactionMetadata;

        if (order.direction === OrderDirection.Buy) {
          return (
            <FormattedMessage
              id="cancel.order"
              defaultMessage="Cancel offer for the asset {collectionName} #{id}"
              description="Title for the listing cancel transaction"
              values={{
                collectionName: <b>{asset?.collectionName}</b>,
                id: <b>{asset?.id}</b>,
              }}
            />
          );
        }

        return (
          <FormattedMessage
            values={{
              collectionName: <b>{asset?.collectionName}</b>,
              id: <b>{asset?.id}</b>,
            }}
            id="cancel.order"
            defaultMessage="Cancel listing for the asset {collectionName} #{id}"
            description="Title for the listing cancel transaction"
          />
        );
      }
      case TransactionType.BUY:
        let { asset, order, tokenDecimals, symbol } =
          metadata as BuyTransactionMetadata;

        return (
          <FormattedMessage
            id="buy.asset.transaction.title"
            defaultMessage="Buy {collectionName} #{id} for {amount} {symbol}"
            values={{
              amount: (
                <b>
                  {ethers.utils.formatUnits(
                    order.erc20TokenAmount,
                    tokenDecimals
                  )}
                </b>
              ),
              symbol,
              id: <b>{asset?.id}</b>,
              collectionName: <b>{asset?.collectionName}</b>,
            }}
          />
        );
      case TransactionType.ACCEPT: {
        let { asset, order, tokenDecimals, symbol } =
          metadata as AcceptTransactionMetadata;

        return (
          <FormattedMessage
            id="accept.offer.transaction.title"
            defaultMessage="Accept offer of {amount} {symbol} for the asset {collectionName} #{id}"
            values={{
              amount: (
                <b>
                  {ethers.utils.formatUnits(
                    order.erc20TokenAmount,
                    tokenDecimals
                  )}
                </b>
              ),
              symbol,
              id: <b>{asset?.id}</b>,
              collectionName: <b>{asset?.collectionName}</b>,
            }}
          />
        );
      }
      case TransactionType.SWAP:
        const meta = metadata as SwapTransactionMetadata;
        return (
          <FormattedMessage
            id="swap.notification"
            defaultMessage="Swap {sellAmount} {sellSymbol} for {buyAmount} {buySymbol}"
            description="Swap notification description"
            values={{
              sellAmount: (
                <b>
                  {ethers.utils.formatUnits(
                    meta.sellAmount,
                    meta.sellToken.decimals
                  )}
                </b>
              ),
              sellSymbol: meta.sellToken.symbol.toUpperCase(),
              buyAmount: (
                <b>
                  {ethers.utils.formatUnits(
                    meta.buyAmount,
                    meta.buyToken.decimals
                  )}
                </b>
              ),
              buySymbol: meta.buyToken.symbol.toUpperCase(),
            }}
          />
        );
      case TransactionType.APPROVE: {
        const { amount, decimals, symbol, name } =
          metadata as ApproveTransactionMetadata;

        return (
          <FormattedMessage
            id="approve.token"
            defaultMessage="Approve {name} ({symbol}) to trade"
            description="Approve collection for listing"
            values={{
              symbol: <b>{symbol.toUpperCase()}</b>,
              name: <b>{name}</b>,
            }}
          />
        );
      }
      case TransactionType.APPROVAL_FOR_ALL: {
        const { asset } = metadata as ApproveForAllTransactionMetadata;
        return (
          <FormattedMessage
            id="approve.for.all"
            defaultMessage="Approve collection {collectionName} to trade"
            description="Approve collection for listing"
            values={{
              collectionName: <b>{asset.collectionName}</b>,
            }}
          />
        );
      }
    }
  }

  return null;
}

export default TransactionTitle;
