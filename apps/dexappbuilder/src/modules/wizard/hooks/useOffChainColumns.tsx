import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from '@dexkit/core/constants/networks';
import { UserEvents } from '@dexkit/core/constants/userEvents';
import { formatStringNumber, truncateAddress } from '@dexkit/core/utils';
import Link from '@dexkit/ui/components/AppLink';
import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export default function useOffChainColumns() {
  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    const accountColumn: GridColDef = {
      minWidth: 200,
      headerName: formatMessage({ id: 'from', defaultMessage: 'From' }),
      flex: 1,
      field: 'from',
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

    const createdAtColumn: GridColDef = {
      field: 'createdAt',
      headerName: formatMessage({
        id: 'created.at',
        defaultMessage: 'Created At',
      }),
      minWidth: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    };

    const referralColumn: GridColDef = {
      field: 'referral',
      headerName: formatMessage({ id: 'referral', defaultMessage: 'Referral' }),
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

    return {
      [UserEvents.postLimitOrder]: [
        accountColumn,
        {
          field: 'chainId',
          headerName: formatMessage({
            id: 'network',
            defaultMessage: 'Network',
          }),
          minWidth: 200,
          valueGetter: ({ row }) => {
            return NETWORK_NAME(row.processedMetadata.chainId);
          },
        },
        {
          field: 'taker.amount',
          headerName: formatMessage({
            id: 'taker.amount',
            defaultMessage: 'Taker Amount',
          }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { takerAmount, takerTokenSymbol } =
              params.row.processedMetadata;

            return (
              <Typography>
                {formatStringNumber(takerAmount)} {takerTokenSymbol}
              </Typography>
            );
          },
        },
        {
          field: 'maker.amount',
          headerName: formatMessage({
            id: 'maker.amount',
            defaultMessage: 'Maker Amount',
          }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { makerTokenAmount, makerTokenSymbol } =
              params.row.processedMetadata;

            return (
              <Typography>
                {formatStringNumber(makerTokenAmount)} {makerTokenSymbol}
              </Typography>
            );
          },
        },
        createdAtColumn,
        referralColumn,
      ],
      [UserEvents.nftERC1155List]: [
        accountColumn,
        {
          field: 'token',
          headerName: formatMessage({ id: 'token', defaultMessage: 'Token' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc20Symbol, erc20TokenAmount } =
              params.row.processedMetadata;

            return (
              <Typography>
                {formatStringNumber(erc20TokenAmount)} {erc20Symbol}
              </Typography>
            );
          },
        },
        {
          field: 'nft',
          headerName: formatMessage({ id: 'nft', defaultMessage: 'NFT' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc1155Name, erc1155TokenId } =
              params.row.processedMetadata;

            return (
              <Typography>
                {erc1155Name} #{erc1155TokenId}
              </Typography>
            );
          },
        },
        {
          field: 'amount',
          headerName: formatMessage({ id: 'amount', defaultMessage: 'Amount' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc1155TokenAmount } = params.row.processedMetadata;

            return <Typography>{erc1155TokenAmount}</Typography>;
          },
        },
        createdAtColumn,
        referralColumn,
      ],
      [UserEvents.nftERC1155Offer]: [
        accountColumn,

        // const {
        //   erc1155Name,
        //   erc20Symbol,
        //   erc1155TokenId,
        //   erc20TokenAmount,
        //   erc1155TokenAmount,
        // } = event.processedMetadata;

        {
          field: 'token',
          headerName: formatMessage({ id: 'token', defaultMessage: 'Token' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc20Symbol, erc20TokenAmount } =
              params.row.processedMetadata;

            return (
              <Typography>
                {formatStringNumber(erc20TokenAmount)} {erc20Symbol}
              </Typography>
            );
          },
        },
        {
          field: 'nft',
          headerName: formatMessage({ id: 'nft', defaultMessage: 'NFT' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc1155Name, erc1155TokenId } =
              params.row.processedMetadata;

            return (
              <Typography>
                {erc1155Name} #{erc1155TokenId}
              </Typography>
            );
          },
        },
        {
          field: 'amount',
          headerName: formatMessage({ id: 'amount', defaultMessage: 'Amount' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc1155TokenAmount } = params.row.processedMetadata;

            return <Typography>{erc1155TokenAmount}</Typography>;
          },
        },
        createdAtColumn,
        referralColumn,
      ],
      [UserEvents.nftERC721List]: [
        accountColumn,
        {
          field: 'token',
          headerName: formatMessage({ id: 'token', defaultMessage: 'Token' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc20TokenAmount, erc20Symbol } =
              params.row.processedMetadata;

            return (
              <Typography>
                {erc20TokenAmount} {erc20Symbol}
              </Typography>
            );
          },
        },
        {
          field: 'nft',
          headerName: formatMessage({ id: 'nft', defaultMessage: 'NFT' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc721Name, erc721TokenId } = params.row.processedMetadata;

            return (
              <Typography>
                {erc721Name} #{erc721TokenId}
              </Typography>
            );
          },
        },
        createdAtColumn,
        referralColumn,
      ],
      [UserEvents.nftERC721Offer]: [
        accountColumn,
        {
          field: 'token',
          headerName: formatMessage({ id: 'token', defaultMessage: 'Token' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc20TokenAmount, erc20Symbol } =
              params.row.processedMetadata;

            return (
              <Typography>
                {erc20TokenAmount} {erc20Symbol}
              </Typography>
            );
          },
        },
        {
          field: 'nft',
          headerName: formatMessage({ id: 'nft', defaultMessage: 'NFT' }),
          disableReorder: true,
          sortable: false,
          minWidth: 280,
          flex: 1,
          renderCell: (params: any) => {
            const { erc721Name, erc721TokenId } = params.row.processedMetadata;

            return (
              <Typography>
                {erc721Name} #{erc721TokenId}
              </Typography>
            );
          },
        },
        createdAtColumn,
        referralColumn,
      ],
      [UserEvents.loginSignMessage]: [
        accountColumn,
        createdAtColumn,
        referralColumn,
      ],
    } as { [key: string]: GridColDef[] };
  }, []);

  return columns;
}
