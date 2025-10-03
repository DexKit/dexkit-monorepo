import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Search } from "@mui/icons-material";
import {
    Button,
    Container,
    Divider,
    InputAdornment,
    Stack,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useAssetsOrderBook } from "../../hooks";
import { AssetStoreOptions } from "../../types";
import { StoreHeader } from "../StoreHeader";
import { StoreOrderbook } from "../StoreOrderbook";

const CreateAssetOrderDialog = dynamic(
  () => import("../dialogs/CreateAssetOrderDialog")
);

export function AssetStoreContainer({
  name,
  title,
  backgroundImageURL,
  profileImageURL,
  storeAccount,

  description,
}: AssetStoreOptions) {
  const { formatMessage } = useIntl();
  const { account } = useWeb3React();
  const [search, setSearch] = useState<string>();
  const [openAssetOrderDialog, setOpenAssetOrderDialog] = useState(false);

  const assetOrderbookQuery = useAssetsOrderBook({
    maker: storeAccount?.toLowerCase(),
  });

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <CreateAssetOrderDialog
        dialogProps={{
          open: openAssetOrderDialog,
          onClose: () => setOpenAssetOrderDialog(false),
        }}
      />

      <Container>
        <Grid container spacing={2}>
          <Grid size={12}>
            <StoreHeader
              profileImageURL={profileImageURL}
              backgroundImageURL={backgroundImageURL}
              name={name}
              description={description}
              title={title}
            />
          </Grid>
          
          <Grid size={12}>
            <Divider />
          </Grid>
          
          <Grid size={12}>
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              alignContent="center"
            >
              <Grid size="auto">
                <TextField
                  fullWidth
                  size="small"
                  type="search"
                  value={search}
                  onChange={handleChangeSearch}
                  placeholder={formatMessage({
                    id: "search.in.store",
                    defaultMessage: "Search in store",
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

              {account?.toLowerCase() === storeAccount?.toLowerCase() &&
                account && (
                  <Grid size="auto">
                    <Button
                      variant="contained"
                      onClick={() => setOpenAssetOrderDialog(true)}
                    >
                      <FormattedMessage
                        id={"create.order"}
                        defaultMessage={"Create Order"}
                      />
                    </Button>
                  </Grid>
                )}
            </Stack>
          </Grid>

          <Grid size={12}>
            <StoreOrderbook
              search={search}
              orderbook={assetOrderbookQuery.data}
              isLoading={assetOrderbookQuery.isLoading}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
