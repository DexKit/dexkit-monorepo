import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { AppErrorBoundary } from "@dexkit/ui/components/AppErrorBoundary";
import LazyTextField from "@dexkit/ui/components/LazyTextField";
import SidebarFilters from "@dexkit/ui/components/SidebarFilters";
import SidebarFiltersContent from "@dexkit/ui/components/SidebarFiltersContent";
import { AssetListCollection } from "@dexkit/ui/modules/nft/components/AssetListCollection";
import { AssetList } from "@dexkit/ui/modules/nft/components/AssetListOrderbook";
import { CollectionHeader } from "@dexkit/ui/modules/nft/components/CollectionHeader";
import CollectionPageHeader from "@dexkit/ui/modules/nft/components/CollectionPageHeader";
import { CollectionStats } from "@dexkit/ui/modules/nft/components/CollectionStats";
import { CollectionTraits } from "@dexkit/ui/modules/nft/components/CollectionTraits";
import { StoreOrdebookContainer } from "@dexkit/ui/modules/nft/components/container/StoreOrderbookContainer";
import { TableSkeleton } from "@dexkit/ui/modules/nft/components/tables/TableSkeleton";
import { CollectionPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Search from "@mui/icons-material/Search";
import { ThirdwebSDKProvider, useContractType } from "@thirdweb-dev/react";
import { Suspense, SyntheticEvent, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CollectionSyncStatus } from "@dexkit/ui/modules/nft/constants/enum";
import { useCollection } from "@dexkit/ui/modules/nft/hooks/collection";
import DarkblockWrapper from "@dexkit/ui/modules/wizard/components/DarkblockWrapper";
import { DropEditionListSection } from "./DropEditionListSection";
import NftDropSection from "./NftDropSection";

export interface CollectionSectionProps {
  section: CollectionPageSection;
}

function CollectionSection({ section }: CollectionSectionProps) {
  const chainId = NETWORK_FROM_SLUG(section.config.network as string)?.chainId;

  const {
    hideDrops,
    hideFilters,
    hideHeader,
    showPageHeader,
    hideAssets,
    disableSecondarySells,
    enableDarkblock,
    isLock,
    showCollectionStats,
    showSidebarOnDesktop,
  } = section.config;
  const address = section.config.address;
  const network = section.config.network;

  const { data: collection, isError } = useCollection(
    section.config.address,
    chainId
  );

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [search, setSearch] = useState("");

  const [buyNowChecked, setBuyNowChecked] = useState(false);

  const handleChangeBuyNow = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyNowChecked(event.target.checked);
  };

  const handleChange = (value: string) => {
    setSearch(value);
  };

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { formatMessage } = useIntl();

  const renderSidebar = (onClose?: () => void) => {
    return (
      <SidebarFilters
        title={<FormattedMessage id="filters" defaultMessage="Filters" />}
        onClose={onClose}
      >
        <SidebarFiltersContent>
          <Stack spacing={1}>
            <TextField
              fullWidth
              size="small"
              type="search"
              value={search}
              onChange={(e) => handleChange(e.target.value)}
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
            <Typography>
              <FormattedMessage defaultMessage={"Status"} id={"status"} />
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={buyNowChecked}
                    onChange={handleChangeBuyNow}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={
                  <FormattedMessage defaultMessage={"Buy now"} id={"buy.now"} />
                }
              />
            </FormGroup>
            <Typography>
              <FormattedMessage defaultMessage={"Traits"} id={"traits"} />
            </Typography>
            <CollectionTraits address={address} chainId={chainId} />
          </Stack>
        </SidebarFiltersContent>
      </SidebarFilters>
    );
  };

  const handleCloseDrawer = () => {
    setIsFiltersOpen(false);
  };

  const renderDrawer = () => {
    return (
      <Drawer
        open={isFiltersOpen}
        onClose={handleCloseDrawer}
        anchor="right"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          {renderSidebar(handleCloseDrawer)}
        </Box>
      </Drawer>
    );
  };

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  const { data: contractType } = useContractType(
    section.config.address as string
  );

  const isDrop = useMemo(() => {
    return contractType?.endsWith("drop");
  }, [contractType]);

  const [currTab, setCurrTab] = useState("collection");

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const renderCollection = (
    <>
      {!hideFilters && renderDrawer()}
      <Box pl={1} pr={1}>
        <Grid container spacing={2}>
          {showPageHeader && (
            <Grid item xs={12}>
              <CollectionPageHeader
                chainId={chainId}
                address={address as string}
              />
            </Grid>
          )}
          {!hideHeader && (
            <Grid item xs={12}>
              <CollectionHeader
                address={section.config.address}
                chainId={chainId}
                lazy
                isLock={isLock}
              />
            </Grid>
          )}
          {showCollectionStats && (
            <>
              <Grid item xs={12}>
                <CollectionStats
                  address={address as string}
                  network={network as string}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
            </>
          )}

          {isDrop && !hideDrops && (
            <Grid item xs={12}>
              <Tabs value={currTab} onChange={handleChangeTab}>
                {disableSecondarySells !== true && (
                  <Tab
                    label={
                      <FormattedMessage
                        id="collection"
                        defaultMessage="Collection"
                      />
                    }
                    value="collection"
                  />
                )}
                <Tab
                  label={
                    contractType === "nft-drop" ? (
                      <FormattedMessage id="drop" defaultMessage="Drop" />
                    ) : (
                      <FormattedMessage id="drops" defaultMessage="Drops" />
                    )
                  }
                  value="drops"
                />
              </Tabs>
            </Grid>
          )}

          {currTab === "drops" && isDrop && (
            <Grid item xs={12}>
              <Typography gutterBottom variant="body1" sx={{ fontWeight: 600 }}>
                {contractType === "nft-drop" ? (
                  <FormattedMessage id="drop" defaultMessage="Drop" />
                ) : (
                  <FormattedMessage id="drops" defaultMessage="Drops" />
                )}
              </Typography>
              {contractType === "edition-drop" && (
                <DropEditionListSection
                  section={{
                    type: "edition-drop-list-section",
                    config: {
                      address: section.config.address as string,
                      network: section.config.network as string,
                    },
                  }}
                />
              )}
              {contractType === "nft-drop" && (
                <NftDropSection
                  section={{
                    type: "nft-drop",
                    settings: {
                      address: section.config.address as string,
                      network: section.config.network as string,
                    },
                  }}
                />
              )}
            </Grid>
          )}
          {currTab === "collection" && disableSecondarySells !== true && (
            <>
              <Grid item xs={12}>
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <LazyTextField
                      TextFieldProps={{
                        size: "small",
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Search color="primary" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      onChange={handleChange}
                    />
                    {!hideFilters && (
                      <IconButton onClick={handleOpenFilters}>
                        <FilterAltIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              </Grid>
              {!hideAssets && (
                <Grid item xs={12}>
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
                      {buyNowChecked ? (
                        <StoreOrdebookContainer
                          search={search}
                          collectionAddress={address as string}
                          chainId={chainId}
                          context={"collection"}
                        />
                      ) : (
                        <>
                          {collection?.syncStatus ===
                            CollectionSyncStatus.Synced ||
                          collection?.syncStatus ===
                            CollectionSyncStatus.Syncing ? (
                            <AssetListCollection
                              contractAddress={address as string}
                              network={network as string}
                              search={search}
                            />
                          ) : (
                            <Suspense fallback={<TableSkeleton rows={4} />}>
                              <AssetList
                                contractAddress={address as string}
                                chainId={
                                  NETWORK_FROM_SLUG(network as string)?.chainId
                                }
                                search={search}
                              />
                            </Suspense>
                          )}
                        </>
                      )}
                    </AppErrorBoundary>
                  </NoSsr>
                </Grid>
              )}
            </>
          )}
          {enableDarkblock && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <NoSsr>
                  <Suspense>
                    <DarkblockWrapper
                      address={address as string}
                      network={network as string}
                    />
                  </Suspense>
                </NoSsr>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </>
  );

  if (showSidebarOnDesktop) {
    return (
      <Grid container>
        {isDesktop && disableSecondarySells !== true && (
          <Grid item xs={12} sm={2}>
            {renderSidebar()}
          </Grid>
        )}
        <Grid item xs={12} sm={disableSecondarySells !== true ? 10 : 12}>
          <Box pt={2}>{renderCollection}</Box>
        </Grid>
      </Grid>
    );
  } else {
    return <>{renderCollection}</>;
  }
}

function Wrapper({ section }: CollectionSectionProps) {
  const { signer } = useWeb3React();

  return (
    <ThirdwebSDKProvider activeChain={section.config.network} signer={signer}>
      <CollectionSection section={section} />
    </ThirdwebSDKProvider>
  );
}

export default Wrapper;
