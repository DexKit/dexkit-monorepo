import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from "@dexkit/core/constants/networks";
import { UserOnChainEvents } from "@dexkit/core/constants/userEvents";
import {
  formatStringNumber,
  truncateAddress,
  truncateHash,
} from "@dexkit/core/utils";
import { Link, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export default function useColumns(type?: string) {
  const { formatMessage } = useIntl();

  const columnType: GridColDef[] = useMemo(() => {
    const accountColumn: GridColDef = {
      renderHeader: () => (
        <FormattedMessage id="account" defaultMessage="Account" />
      ),
      minWidth: 200,
      headerName: formatMessage({ id: "from", defaultMessage: "From" }),
      flex: 1,
      field: "from",
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.from
            }`}
          >
            {truncateAddress(params.row.from)}
          </Link>
        );
      },
    };

    const chainIdColumn: GridColDef = {
      field: "chainId",
      headerName: formatMessage({ id: "network", defaultMessage: "Network" }),
      renderHeader: () => (
        <FormattedMessage id="network" defaultMessage="Network" />
      ),
      minWidth: 200,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    };

    const hashColunn: GridColDef = {
      field: "hash",
      disableReorder: true,
      headerName: "TX",
      minWidth: 200,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    };

    const referralColumn: GridColDef = {
      field: "referral",
      headerName: formatMessage({ id: "referral", defaultMessage: "Referral" }),
      minWidth: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    };

    const createdAtColumn: GridColDef = {
      field: "createdAt",
      headerName: formatMessage({
        id: "created.at",
        defaultMessage: "Created At",
      }),
      minWidth: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    };

    const commonColumns = [
      createdAtColumn,
      chainIdColumn,
      hashColunn,
      accountColumn,
    ];

    const columnTypes: { [key: string]: GridColDef[] } = {
      [UserOnChainEvents.nftAcceptListERC1155]: [
        ...commonColumns,
        {
          field: "paidAmount",
          sortable: false,
          headerName: formatMessage({
            id: "token.amount",
            defaultMessage: "Token amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
          ),
          minWidth: 200,
          renderCell: (params: any) => {
            const { tokenAmount, token } = params.row.processedMetadata;

            return (
              <>
                {formatStringNumber(tokenAmount)} {token?.symbol?.toUpperCase()}
              </>
            );
          },
        },
        {
          field: "paidAmount",

          headerName: formatMessage({
            id: "paid.amount",
            defaultMessage: "Paid amount",
          }),
          sortable: false,
          renderHeader: () => (
            <FormattedMessage id="paid.amount" defaultMessage="Paid amount" />
          ),
          minWidth: 200,
          renderCell: (params: any) => {
            const { collection } = params.row.processedMetadata;

            if (collection?.name) {
              return (
                <Link
                  href={`${NETWORK_EXPLORER(
                    params.row.chainId
                  )}/address/${collection?.address}`}
                  target="_blank"
                >
                  {collection?.name}
                </Link>
              );
            }
          },
        },
        {
          field: "tokenId",

          headerName: formatMessage({
            id: "token.id",
            defaultMessage: "Token ID",
          }),
          sortable: false,
          renderHeader: () => (
            <FormattedMessage id="token.id" defaultMessage="Token ID" />
          ),
          minWidth: 200,
          renderCell: (params: any) => {
            return params.row.processedMetadata.tokenId;
          },
        },
        {
          headerName: formatMessage({ id: "amount", defaultMessage: "Amount" }),
          field: "amount",
          sortable: false,
          renderHeader: () => (
            <FormattedMessage id="amount" defaultMessage="Amount" />
          ),
          minWidth: 200,
          renderCell: (params: any) => {
            const { nftAmount } = params.row.processedMetadata;

            return <>{nftAmount}</>;
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.swap]: [
        ...commonColumns,
        {
          field: "amountIn",
          headerName: formatMessage({
            id: "amount.in",
            defaultMessage: "Amount In",
          }),
          disableReorder: true,
          sortable: false,
          renderHeader: () => (
            <FormattedMessage id="amount.in" defaultMessage="Amount In" />
          ),
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { tokenInAmount, tokenIn } = params.row.processedMetadata;

            return (
              <Typography>
                {formatStringNumber(tokenInAmount)}{" "}
                {tokenIn?.symbol?.toUpperCase()}
              </Typography>
            );
          },
        },
        {
          field: "amountOut",
          disableReorder: true,
          headerName: formatMessage({
            id: "amount.out",
            defaultMessage: "Amount Out",
          }),
          sortable: false,
          renderHeader: () => (
            <FormattedMessage id="amount.out" defaultMessage="Amount Out" />
          ),
          flex: 1,
          minWidth: 280,
          renderCell: (params: any) => {
            const { tokenOut, tokenOutAmount } = params.row.processedMetadata;

            return (
              <Typography>
                {formatStringNumber(tokenOutAmount)}{" "}
                {tokenOut?.symbol?.toUpperCase()}
              </Typography>
            );
          },
        },
        {
          field: "receivedFee",

          headerName: formatMessage({
            id: "received.fee",
            defaultMessage: "Received Fee",
          }),
          disableReorder: true,
          sortable: false,
          renderHeader: () => (
            <FormattedMessage id="Received.fee" defaultMessage="Received Fee" />
          ),
          flex: 1,
          minWidth: 280,
          renderCell: (params: any) => {
            const { receivedFee, tokenIn } = params.row.processedMetadata;

            if (receivedFee && tokenIn && tokenIn?.symbol) {
              return (
                <Typography>
                  {formatStringNumber(receivedFee)}{" "}
                  {tokenIn?.symbol?.toUpperCase()}
                </Typography>
              );
            }
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.transfer]: [
        ...commonColumns,
        {
          field: "amount",
          sortable: false,
          flex: 1,

          headerName: formatMessage({ id: "amount", defaultMessage: "Amount" }),
          renderHeader: () => (
            <FormattedMessage id="amount" defaultMessage="Amount" />
          ),
          minWidth: 160,
          renderCell: (params: any) => {
            const { amount, token } = params.row.processedMetadata;
            if (amount && token) {
              return (
                <>
                  {formatStringNumber(amount)} {token.symbol.toUpperCase()}
                </>
              );
            }
          },
        },
        {
          field: "to",
          sortable: false,
          headerName: formatMessage({ id: "to", defaultMessage: "To" }),
          renderHeader: () => <FormattedMessage id="to" defaultMessage="To" />,
          minWidth: 160,
          flex: 1,
          renderCell: (params: any) => {
            return (
              <Link
                target="_blank"
                href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
                  params.row.processedMetadata.to
                }`}
              >
                {truncateAddress(params.row.processedMetadata.to)}
              </Link>
            );
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.nftAcceptOfferERC1155]: [
        ...commonColumns,
        {
          headerName: formatMessage({
            id: "token.id",
            defaultMessage: "Token ID",
          }),
          renderHeader: () => (
            <FormattedMessage id="token.id" defaultMessage="Token ID" />
          ),
          field: "tokenId",

          sortable: false,
          flex: 1,
          renderCell: (params: any) => {
            const { tokenId } = params.row.processedMetadata;

            if (tokenId) {
              return tokenId;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "total.amount",
            defaultMessage: "Total amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
          ),
          field: "tokenAmount",

          sortable: false,
          flex: 1,
          renderCell: (params: any) => {
            const { tokenAmount } = params.row.processedMetadata;
            if (tokenAmount) {
              return tokenAmount;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "collection.name",
            defaultMessage: "Collection Name",
          }),
          renderHeader: () => (
            <FormattedMessage
              id="collection.name"
              defaultMessage="Collection Name"
            />
          ),
          field: "collectionName",

          sortable: false,
          flex: 1,
          renderCell: (params: any) => {
            const { collection } = params.row.processedMetadata;

            if (collection) {
              return collection?.name;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "nft.amount",
            defaultMessage: "NFT Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
          ),
          field: "nftAmount",
          flex: 1,

          sortable: false,
          renderCell: (params: any) => {
            const { nftAmount } = params.row.processedMetadata;

            if (nftAmount) {
              return nftAmount;
            }
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.nftAcceptOfferERC721]: [
        ...commonColumns,
        {
          headerName: formatMessage({
            id: "tokenAmount",
            defaultMessage: "Token Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
          ),
          minWidth: 200,
          flex: 1,
          field: "tokenAmount",

          sortable: false,
          renderCell: (params: any) => {
            const { tokenAmount, token } = params.row.processedMetadata;
            if (tokenAmount) {
              return (
                <>
                  {formatStringNumber(tokenAmount)}{" "}
                  {token?.symbol?.toUpperCase()}
                </>
              );
            }
          },
        },
        {
          headerName: formatMessage({
            id: "collection.name",
            defaultMessage: "Collection Name",
          }),
          renderHeader: () => (
            <FormattedMessage
              id="collection.name"
              defaultMessage="Collection Name"
            />
          ),
          minWidth: 200,
          flex: 1,

          sortable: false,
          field: "collectionName",
          renderCell: (params: any) => {
            const { collection } = params.row.processedMetadata;

            if (collection?.name) {
              return collection?.name;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "nft.amount",
            defaultMessage: "NFT Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
          ),
          flex: 1,
          minWidth: 200,
          field: "nftAmount",

          sortable: false,
          renderCell: (params: any) => {
            const { nftAmount, token } = params.row.processedMetadata;

            if (nftAmount) {
              return <>{nftAmount}</>;
            }
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.nftAcceptListERC721]: [
        ...commonColumns,
        {
          headerName: formatMessage({
            id: "token.amount",
            defaultMessage: "Token Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
          ),
          minWidth: 200,
          field: "tokenAmount",

          sortable: false,
          flex: 1,
          renderCell: (params: any) => {
            const { tokenAmount, token } = params.row.processedMetadata;

            if (tokenAmount && token) {
              return (
                <>
                  {formatStringNumber(tokenAmount)}{" "}
                  {token?.symbol?.toUpperCase()}
                </>
              );
            }
          },
        },
        {
          headerName: formatMessage({
            id: "collection.name",
            defaultMessage: "Collection name",
          }),
          renderHeader: () => (
            <FormattedMessage
              id="collection.name"
              defaultMessage="Collection name"
            />
          ),
          flex: 1,
          minWidth: 200,

          sortable: false,
          field: "collectionName",
          renderCell: (params: any) => {
            const { collection } = params.row.processedMetadata;

            if (collection?.name) {
              return collection?.name;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "nft.amount",
            defaultMessage: "NFT Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
          ),
          field: "nftAmount",

          sortable: false,
          flex: 1,
          minWidth: 200,
          renderCell: (params: any) => {
            const { nftAmount } = params.row.processedMetadata;

            if (nftAmount) {
              return nftAmount;
            }
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.buyDropCollection]: [
        ...commonColumns,
        {
          headerName: formatMessage({ id: "price", defaultMessage: "Price" }),
          renderHeader: () => (
            <FormattedMessage id="price" defaultMessage="Price" />
          ),
          minWidth: 200,
          field: "price",
          flex: 1,
          sortable: false,
          renderCell: (params: any) => {
            const { price } = params.row.processedMetadata;

            if (price) {
              return price;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "collection.name",
            defaultMessage: "Collection Name",
          }),
          renderHeader: () => (
            <FormattedMessage
              id="collection.name"
              defaultMessage="Collection Name"
            />
          ),
          minWidth: 200,
          flex: 1,
          field: "collectionName",

          sortable: false,
          renderCell: (params: any) => {
            const { collection } = params.row.processedMetadata;

            if (collection?.name) {
              return collection?.name;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "nft.amount",
            defaultMessage: "NFT Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
          ),
          field: "nftAmount",

          sortable: false,
          minWidth: 200,
          flex: 1,
          renderCell: (params: any) => {
            const { nftAmount } = params.row.processedMetadata;

            if (nftAmount) {
              return nftAmount;
            }
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.buyDropEdition]: [
        ...commonColumns,
        {
          headerName: formatMessage({ id: "price", defaultMessage: "Price" }),
          renderHeader: () => (
            <FormattedMessage id="price" defaultMessage="Price" />
          ),
          minWidth: 200,
          field: "price",
          flex: 1,
          sortable: false,
          renderCell: (params: any) => {
            const { price } = params.row.processedMetadata;

            if (price) {
              return price;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "collection.name",
            defaultMessage: "Collection Name",
          }),
          renderHeader: () => (
            <FormattedMessage
              id="collection.name"
              defaultMessage="Collection Name"
            />
          ),
          flex: 1,
          minWidth: 200,
          field: "collectionName",

          sortable: false,
          renderCell: (params: any) => {
            const { collection } = params.row.processedMetadata;

            if (collection?.name) {
              return collection?.name;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "nftAmount",
            defaultMessage: "NFT Amount",
          }),
          renderHeader: () => (
            <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
          ),
          minWidth: 200,
          field: "nftAmount",
          flex: 1,
          sortable: false,
          renderCell: (params: any) => {
            const { nftAmount } = params.row.processedMetadata;

            if (nftAmount) {
              return nftAmount;
            }
          },
        },
        referralColumn,
      ],
      [UserOnChainEvents.deployContract]: [
        ...commonColumns,
        {
          headerName: formatMessage({ id: "type", defaultMessage: "Type" }),
          renderHeader: () => (
            <FormattedMessage id="type" defaultMessage="Type" />
          ),
          minWidth: 200,
          flex: 1,
          field: "type",
          sortable: false,
          renderCell: (params: any) => {
            const { type } = params.row.processedMetadata;

            if (type) {
              return type;
            }
          },
        },
        {
          headerName: formatMessage({ id: "name", defaultMessage: "Name" }),
          renderHeader: () => (
            <FormattedMessage id="name" defaultMessage="Name" />
          ),
          minWidth: 200,
          flex: 1,
          field: "name",
          sortable: false,
          renderCell: (params: any) => {
            const { name } = params.row.processedMetadata;

            if (name) {
              return name;
            }
          },
        },
        {
          headerName: formatMessage({
            id: "address",
            defaultMessage: "Address",
          }),
          renderHeader: () => (
            <FormattedMessage id="address" defaultMessage="Address" />
          ),
          minWidth: 200,
          flex: 1,
          field: "address",
          sortable: false,
          renderCell: (params: any) => {
            const { address } = params.row.processedMetadata;

            return (
              <Link
                target="_blank"
                href={`${NETWORK_EXPLORER(
                  params.row.chainId
                )}/address/${address}`}
              >
                {truncateAddress(address)}
              </Link>
            );
          },
        },
        referralColumn,
      ],
    };

    if (type && columnTypes[type]) {
      return columnTypes[type];
    }

    return [];
  }, [type]);

  return columnType;
}
