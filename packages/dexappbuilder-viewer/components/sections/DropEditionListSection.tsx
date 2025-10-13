import { AppErrorBoundary } from "@dexkit/ui/components/AppErrorBoundary";
import { BaseAssetCard } from "@dexkit/ui/modules/nft/components/BaseAssetCard";
import { useAssetListFromCollection } from "@dexkit/ui/modules/nft/hooks/collection";
import { EditionDropListPageSection } from "@dexkit/ui/modules/wizard/types/section";
import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import NoSsr from "@mui/material/NoSsr";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
  section: EditionDropListPageSection;
}

export function DropEditionListSection({ section }: Props) {
  const { address, network } = section.config;
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);

  const [search, setSearch] = useState<string>();

  const { data } = useAssetListFromCollection({
    network,
    address: address,
    skip: page * perPage,
    take: perPage,
  });
  const assets = data?.assets;

  const filteredAssets = useMemo(() => {
    if (assets && search) {
      return assets.filter(
        (a) =>
          a.collectionName.indexOf(search) !== -1 ||
          a.metadata?.name.indexOf(search) !== -1
      );
    }

    return assets;
  }, [search, assets]);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const { formatMessage } = useIntl();

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            size="small"
            type="search"
            value={search}
            onChange={handleChangeSearch}
            placeholder={formatMessage({
              id: "search.in.collection",
              defaultMessage: "Search in collection",
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={12}>
          <NoSsr>
            <AppErrorBoundary
              fallbackRender={({ resetErrorBoundary, error }) => (
                <Stack justifyContent="center" alignItems="center">
                  <Typography variant="h6">
                    <FormattedMessage
                      id="something.went.wrong"
                      defaultMessage="Oops, something went wrong"
                      description="Something went wrong error message"
                    />
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {String(error)}
                  </Typography>
                  <Button color="primary" onClick={resetErrorBoundary}>
                    <FormattedMessage
                      id="try.again"
                      defaultMessage="Try again"
                      description="Try again"
                    />
                  </Button>
                </Stack>
              )}
            >
              <Grid container spacing={2}>
                {filteredAssets?.map((asset: any, index: any) => (
                  <Grid size={{ xs: 6, sm: 2 }} key={index}>
                    <BaseAssetCard
                      asset={asset}
                      onClickCardAction={(a) =>
                        router.push(
                          `/drop/edition/${network}/${address}/${a?.id || " "}`
                        )
                      }
                    />
                  </Grid>
                ))}
                {filteredAssets?.length === 0 && (
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <Stack justifyContent="center" alignItems="center">
                      <Typography variant="h6">
                        <FormattedMessage
                          id="drops.not.found"
                          defaultMessage="Drop's not found"
                        />
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <FormattedMessage
                          id="clear.filters.to.see.nft.drops"
                          defaultMessage="Clear filters to see nft drop's"
                        />
                      </Typography>
                    </Stack>
                  </Grid>
                )}
                <Grid size={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Pagination
                      page={page + 1}
                      onChange={(_ev, _page) => setPage(_page - 1)}
                      count={Math.floor((data?.total || 0) / perPage) + 1}
                    />
                  </Box>
                </Grid>
              </Grid>
            </AppErrorBoundary>
          </NoSsr>
        </Grid>
      </Grid>
    </>
  );
}
