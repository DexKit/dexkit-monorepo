import { Box, Grid, Link, Stack, Typography } from "@mui/material";

import { useAppRankingQuery } from "@dexkit/ui/modules/wizard/hooks/ranking";
import { RankingPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import React, { useMemo, useState } from "react";

import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { FormattedMessage } from "react-intl";

import { getBlockExplorerUrl, truncateAddress } from "@dexkit/core/utils";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export interface RankingSectionProps {
  section: RankingPageSection;
}

const NoRows: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={1} alignItems="center" justifyContent="center">
        <Stack
          sx={{
            fontSize: "3rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StarOutlineIcon fontSize="inherit" />
        </Stack>
        <div>
          <Typography variant="h5" textAlign="center">
            <FormattedMessage
              id="no.entries.yet"
              defaultMessage="No entries yet"
            />
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            <FormattedMessage
              id="add.rules.to.see.points.here"
              defaultMessage="Add rules to see points here"
            />
          </Typography>
        </div>
      </Stack>
    </Box>
  );
};

export default function RankingSection({ section }: RankingSectionProps) {
  const { account, chainId } = useWeb3React();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const queryRanking = useAppRankingQuery({
    rankingId: section.settings.rankingId,
  });

  const rows = queryRanking.data?.data ? queryRanking.data?.data : [];
  const ranking = queryRanking.data?.ranking;

  console.log(ranking);

  const columns = useMemo(() => {
    return [
      {
        field: "account",
        disableReorder: true,
        sortable: false,
        hideSortIcons: true,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,

        flex: 1,
        renderHeader: () => {
          return ranking?.groupByReferral ? (
            <FormattedMessage
              id="referral.account"
              defaultMessage="Referral account"
            />
          ) : (
            <FormattedMessage id="account" defaultMessage="Account" />
          );
        },
        renderCell: ({ row }) => {
          return (
            <Link
              href={`${getBlockExplorerUrl(chainId)}/address/${row.account}`}
              target="_blank"
            >
              {truncateAddress(row.account)}
            </Link>
          );
        },
      },
      {
        field: "points",
        flex: 1,
        filterable: false,
        disableReorder: true,
        sortable: false,
        hideSortIcons: true,
        hideable: false,
        disableColumnMenu: true,
        renderHeader: () => {
          return <FormattedMessage id="points" defaultMessage="Points" />;
        },
      },
    ] as GridColDef<{
      account: string;
      points: number;
    }>[];
  }, [ranking?.groupByReferral]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h6">
          {queryRanking?.data?.ranking?.title || ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {queryRanking?.data?.ranking?.description || ""}
        </Typography>
      </Grid>
      <Grid size={12}>
        <DataGrid
          getRowId={(row: any) => row.account}
          rowCount={rows.length}
          rows={rows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          columns={columns}
          pageSizeOptions={[
            { label: "5", value: 5 },
            { label: "10", value: 10 },
            { label: "50", value: 50 },
            { label: "100", value: 100 },
          ]}
          sx={{ minHeight: 300 }}
          slots={{ noRowsOverlay: NoRows, noResultsOverlay: NoRows }}
        />
      </Grid>
    </Grid>
  );
}
