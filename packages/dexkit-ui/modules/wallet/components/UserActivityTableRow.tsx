import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import {
  formatStringNumber,
  getBlockExplorerUrl,
  truncateAddress,
} from "@dexkit/core/utils";
import {
  getChainSlug,
  getNetworkSlugFromChainId,
} from "@dexkit/core/utils/blockchain";
import { TableCell, TableRow } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";
import Link from "../../../components/AppLink";
import MomentFormatted from "../../../components/MomentFomatted";
import { UserEvent } from "../hooks/useUserActivity";
import UserActivityBuyDropCollection from "./UserActivityBuyDropCollection";
import UserActivityBuyDropEdition from "./UserActivityBuyDropEdition";
import UserActivityBuyDropToken from "./UserActivityBuyDropToken";
import UserActivityLockPurchasePrice from "./UserActivityLockPurchasePrice";
import UserActivityLockRenewPrice from "./UserActivityLockRenewPrice";

function isNFTOrder(event: UserEvent) {
  const types = [
    UserEvents.nftERC1155List,
    UserEvents.nftERC1155Offer,
    UserEvents.nftERC721Offer,
    UserEvents.nftERC721List,
  ];

  return event.type !== null && types.includes(event.type as any);
}

function getOrderHash(event: UserEvent) {
  const {
    order: {
      order: { nonce },
    },
  } = JSON.parse(event.metadata) as any;

  return nonce;
}

function getOrderChainId(event: UserEvent) {
  const { chainId } = event.processedMetadata;

  if (chainId !== undefined) {
    return NETWORK_SLUG(chainId);
  }

  return NETWORK_SLUG(event?.chainId ? event?.chainId : undefined);
}

export interface UserActivityTableRowProps {
  event: UserEvent;
}

export default function UserActivityTableRow({
  event,
}: UserActivityTableRowProps) {
  let cells: React.ReactNode[] = [];

  if (event.type === UserEvents.approve) {
    cells.push(<FormattedMessage id="approve" defaultMessage="Approve" />);
  }

  if (event.type === 'connectAccount') {
    cells.push(
      <FormattedMessage
        id="connect.account"
        defaultMessage="Connect Account"
      />
    );
  }

  if (event.type === UserEvents.buyDropToken) {
    cells.push(<UserActivityBuyDropToken event={event} />);
  }

  if (event.type === UserEvents.buyDropCollection) {
    cells.push(<UserActivityBuyDropCollection event={event} />);
  }

  if (event.type === UserEvents.buyDropEdition) {
    cells.push(<UserActivityBuyDropEdition event={event} />);
  }

  if (event.type === UserEvents.marketSell) {
    const { tokenOutAmount, tokenInAmount, tokenOut, tokenIn } =
      event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="sell.for"
        defaultMessage="Sell {tokenOutAmount} {tokenOutSymbol} for {tokenInAmount} {tokenInSymbol}"
        values={{
          tokenOutAmount,
          tokenInAmount,
          tokenOutSymbol: tokenOut?.symbol,
          tokenInSymbol: tokenIn?.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.renewKey) {
    cells.push(<UserActivityLockRenewPrice event={event} />);
  }

  if (event.type === UserEvents.stakeErc20) {
    const { stakeAddress, symbol, amount, name } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="stake.on"
        defaultMessage="Stake {amount} {symbol} on {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          amount: <strong>{amount}</strong>,
          symbol: <strong>{symbol}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.unstakeErc20) {
    const { stakeAddress, symbol, amount, name } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="unstake.on"
        defaultMessage="Unstake {amount} {symbol} on {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          amount: <strong>{amount}</strong>,
          symbol: <strong>{symbol}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.stakeClaimErc20) {
    const { stakeAddress, symbol, amount, name } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="claim.reward.for"
        defaultMessage="Claim Reward {amount} {symbol} on {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          amount: <strong>{amount}</strong>,
          symbol: <strong>{symbol}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.stakeClaimErc721) {
    const { stakeAddress, symbol, amount, name } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="claim.reward.for.erc721"
        defaultMessage="Claim Reward {amount} {symbol} on {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          amount: <strong>{amount}</strong>,
          symbol: <strong>{symbol}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.stakeErc721) {
    const { stakeAddress, name, tokenIds } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="stake.tokens.on.erc721"
        defaultMessage="Stake Tokens: {tokens} on {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          tokens: <strong>{tokenIds.join(", ")}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.unstakeErc721) {
    const { stakeAddress, name, tokenIds } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="unstake.tokens.on.erc721"
        defaultMessage="Unstake Tokens: {tokens} from {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          tokens: <strong>{tokenIds.join(", ")}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.unstakeErc1155) {
    const { stakeAddress, name, tokenId, amount } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="unstake.tokens.on.erc1155"
        defaultMessage="Unstake {amount} of token #{token} from {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          amount,
          token: <strong>{tokenId}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.stakeErc1155) {
    const { stakeAddress, name, tokenId, amount } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="stake.tokens.on.erc1155"
        defaultMessage="Stake {amount} of token #{token} on {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          amount,
          token: <strong>{tokenId}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.stakeClaimErc1155) {
    const { stakeAddress, name, tokenId } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="claimReawards.from.erc1155"
        defaultMessage="Claim rewards of token #{token} from {name}"
        values={{
          name: (
            <Link
              href={`/stake/${getNetworkSlugFromChainId(
                event.chainId ? event.chainId : undefined
              )}/${stakeAddress}`}
              target="_blank"
            >
              <strong>{name}</strong>
            </Link>
          ),
          token: <strong>{tokenId}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.postLimitOrder) {
    const {
      chainId,
      takerAmount,
      makerTokenAmount,
      makerTokenSymbol,
      takerTokenSymbol,
    } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="post.limit.order"
        defaultMessage="Limit Order: {makerTokenAmount} {makerTokenSymbol} for {takerAmount} {takerTokenSymbol}"
        values={{
          makerTokenAmount: formatStringNumber(makerTokenAmount),
          takerAmount: formatStringNumber(takerAmount),
          takerTokenSymbol,
          makerTokenSymbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.nftERC721Offer) {
    const {
      chainId,
      erc20TokenAmount,
      erc721Name,
      erc721TokenId,
      erc20Symbol,
    } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="offer.order.erc721"
        defaultMessage="Offer {erc20TokenAmount} {erc20Symbol} for {erc721Name} #{erc721TokenId}"
        values={{
          erc20TokenAmount: (
            <strong>{formatStringNumber(erc20TokenAmount)}</strong>
          ),
          erc20Symbol,
          erc721Name: <strong>{erc721Name}</strong>,
          erc721TokenId,
        }}
      />
    );
  }

  if (event.type === UserEvents.nftERC721List) {
    const {
      chainId,
      erc20TokenAmount,
      erc721Name,
      erc721TokenId,
      erc20Symbol,
    } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="post.limit.list.erc721"
        defaultMessage="List {erc20TokenAmount} {erc20Symbol} for {erc721Name} #{erc721TokenId}"
        values={{
          erc20TokenAmount: (
            <strong>{formatStringNumber(erc20TokenAmount)}</strong>
          ),
          erc20Symbol,
          erc721Name: <strong>{erc721Name}</strong>,
          erc721TokenId,
        }}
      />
    );
  }

  if (event.type === UserEvents.nftERC1155Offer) {
    const {
      erc1155Name,
      erc20Symbol,
      erc1155TokenId,
      erc20TokenAmount,
      erc1155TokenAmount,
    } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="offer.order.erc1155"
        defaultMessage="Offer {erc20TokenAmount} {erc20Symbol} for {erc1155Name} #{erc1155TokenId} ({erc1155TokenAmount})"
        values={{
          erc20Symbol,
          erc1155TokenId,
          erc20TokenAmount: (
            <strong>{formatStringNumber(erc20TokenAmount)}</strong>
          ),
          erc1155Name: <strong>{erc1155Name}</strong>,
          erc1155TokenAmount,
        }}
      />
    );
  }

  if (event.type === UserEvents.nftERC1155List) {
    const {
      chainId,
      erc20Name,
      erc20Token,
      erc1155Name,
      erc20Symbol,
      erc1155Token,
      erc1155TokenId,
      erc20TokenAmount,
      erc1155TokenAmount,
    } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="list.order.erc1155"
        defaultMessage="Listing: Sell {erc1155Name} #{erc1155TokenId} ({erc1155TokenAmount}) for {erc20TokenAmount} {erc20Symbol}"
        values={{
          erc20TokenAmount: (
            <strong>{formatStringNumber(erc20TokenAmount)}</strong>
          ),
          erc1155Name: <strong>{erc1155Name}</strong>,
          erc1155TokenAmount,
          erc1155TokenId,
          erc20Symbol: <strong>{erc20Symbol}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.purchaseKey) {
    cells.push(<UserActivityLockPurchasePrice event={event} />);
  }

  if (event.type === UserEvents.marketBuy) {
    const { tokenOutAmount, tokenInAmount, tokenOut, tokenIn } =
      event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="buy.for"
        defaultMessage="Buy {tokenInAmount} {tokenInSymbol} for {tokenOutAmount} {tokenOutSymbol}"
        values={{
          tokenOutAmount,
          tokenInAmount,
          tokenOutSymbol: tokenOut?.symbol,
          tokenInSymbol: tokenIn?.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.transfer) {
    const { to, amount, token } = event.processedMetadata;
    cells.push(
      <FormattedMessage
        id="transfer.amount"
        defaultMessage="Transfer {amount} {symbol} to {to}"
        values={{
          to: (
            <Link
              href={`${event.chainId ? getBlockExplorerUrl(event.chainId) : undefined
                }/address/${to}`}
            >
              {truncateAddress(to)}
            </Link>
          ),
          amount,
          symbol: token.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.receive) {
    const { from, amount, token } = event.processedMetadata;
    cells.push(
      <FormattedMessage
        id="transfer.amount"
        defaultMessage="Receive {amount} {symbol} from {from}"
        values={{
          from: (
            <Link
              href={`${event.chainId ? getBlockExplorerUrl(event.chainId) : undefined
                }/address/${from}`}
            >
              {truncateAddress(from)}
            </Link>
          ),
          amount,
          symbol: token.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.swap) {
    const { tokenOutAmount, tokenInAmount, tokenOut, tokenIn } =
      event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="swap.for"
        defaultMessage="Swap {tokenOutAmount} {tokenOutSymbol} for {tokenInAmount} {tokenInSymbol}"
        values={{
          tokenOutAmount,
          tokenInAmount,
          tokenOutSymbol: tokenOut?.symbol,
          tokenInSymbol: tokenIn?.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.orderCancelled) {
    const {
      makerTokenAmount,
      makerTokenName,
      makerTokenSymbol,
      chainId,
      takerAmount,
      takerTokenName,
      takerTokenSymbol,
    } = event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="cancelled.order"
        defaultMessage="Cancel order: {makerTokenAmount} {makerTokenSymbol} for {takerAmount} {takerTokenSymbol}"
        values={{
          makerTokenAmount: <strong>{makerTokenAmount}</strong>,
          makerTokenSymbol: <strong>{makerTokenSymbol}</strong>,
          takerAmount: <strong>{takerAmount}</strong>,
          takerTokenSymbol: <strong>{takerTokenSymbol}</strong>,
        }}
      />
    );
  }

  if (event.type === UserEvents.deployContract) {
    const { name, type, address } = event.processedMetadata as any;

    cells.push(
      <FormattedMessage
        id="deploy.contract"
        defaultMessage="Deploy contract: {contract}"
        values={{
          contract: (
            <Link
              href={`/contract/${event.chainId ? getChainSlug(event.chainId) : undefined
                }/${address}`}
              target="_blank"
            >
              {name}
            </Link>
          ),
        }}
      />
    );
  }

  if (cells.length === 0) {
    cells.push(
      <FormattedMessage
        id="unknown.activity"
        defaultMessage="Unknown activity type: {type}"
        values={{
          type: event.type || 'Unknown'
        }}
      />
    );
  }

  return (
    <TableRow>
      {cells.map((cell, index) => (
        <TableCell key={index}>{cell}</TableCell>
      ))}
      <TableCell>
        <MomentFormatted date={event.createdAt} format="LLLL" />
      </TableCell>
      <TableCell>
        {/* {isNFTOrder(event) && (
          <Link
            href={`/order/${getOrderChainId(event)}/${getOrderHash(event)}`}
            target="_blank"
          >
            <FormattedMessage id="view.tx" defaultMessage="View" />
          </Link>
        )} */}
        {event.type === 'connectAccount' ? (
          <FormattedMessage id="not.applicable" defaultMessage="N/A" />
        ) : event.hash ? (
          <Link
            href={`${getBlockExplorerUrl(
              event.chainId ? event.chainId : undefined
            )}/tx/${event.hash}`}
            target="_blank"
          >
            <FormattedMessage id="view.tx" defaultMessage="View" />
          </Link>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
