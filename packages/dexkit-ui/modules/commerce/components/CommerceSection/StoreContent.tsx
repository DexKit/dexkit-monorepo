import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import LazyTextField from "@dexkit/ui/components/LazyTextField";
import Search from "@mui/icons-material/Search";
import { useCallback, useContext, useState } from "react";
import useCategoriesBySite from "../../hooks/useCategoriesBySite";
import useProductsBySite from "../../hooks/useProductsBySite";
import { ProductCategoryType } from "../../types";
import ProductCard from "../ProductCard";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SiteContext } from "../../../../providers/SiteProvider";
import { useCommerceWishlist } from "../../hooks/useCommerceWishlist";
import FiltersSection from "./FiltersSection";

import { copyToClipboard } from "@dexkit/core/utils";
import { getWindowUrl } from "@dexkit/core/utils/browser";
import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import { ShareType } from "../containers/types";
import { generateShareLink } from "../containers/utils";

const ShareMenu = dynamic(
  () => import("@dexkit/ui/components/dialogs/ShareMenu")
);

export const DEFAULT_FILTERS = {
  query: "",
  categories: [],
  pageSize: 10,
  page: 0,
  sort: "",
};

export interface StoreContentProps {}

export default function StoreContent({}: StoreContentProps) {
  const { formatMessage } = useIntl();

  const [filters, setFilters] = useState<{
    query: string;
    categories: ProductCategoryType[];
    page: number;
    pageSize: number;
    sort: string;
  }>(DEFAULT_FILTERS);

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = () => {
    setShowFilters((value) => !value);
  };

  const handleClose = () => {
    handleToggleFilters();
  };

  const handleChangeCategories = (categories: ProductCategoryType[]) => {
    setFilters((values) => ({ ...values, categories }));
  };

  const { siteId } = useContext(SiteContext);
  const { data: categories } = useCategoriesBySite({ siteId: siteId ?? 0 });

  const { data: products } = useProductsBySite({
    siteId: siteId ?? 0,
    limit: filters.pageSize,
    sort: filters.sort,
    page: filters.page,
    query: filters.query,
    categories: filters.categories.map((c) => c.id ?? ""),
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters((values) => ({
      ...values,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

  const handleChangeSort = (e: SelectChangeEvent<string>) => {
    setFilters((values) => ({
      ...values,
      sort: e.target.value,
    }));
  };

  const handleChangeFilters = (filters: {
    query: string;
    categories: ProductCategoryType[];
    page: number;
    pageSize: number;
    sort: string;
  }) => {
    setFilters(filters);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handelCloseFilters = () => {
    setShowFilters(false);
  };

  const {
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isOnWishlist,
    wishlist,
  } = useCommerceWishlist();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [id, setId] = useState<string>();

  const handleShare = useCallback((id: string) => {
    return (el: HTMLElement) => {
      setId(id);
      setAnchorEl(el);
    };
  }, []);

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setId(undefined);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleShareContent = (value: string) => {
    const url = `${getWindowUrl()}/c/product/${id}`;
    const msg = `There is the product link: ${url}`;

    let link = "";

    if (
      ["telegram", "whatsapp", "facebook", "email", "pinterest", "x"].includes(
        value
      )
    ) {
      link = generateShareLink(msg, url, value as ShareType);

      window.open(link, "_blank");
    }

    if (value === "copy") {
      copyToClipboard(url);
      enqueueSnackbar(
        <FormattedMessage id="link.copied" defaultMessage="Link copied" />,
        { variant: "success" }
      );
    }

    setAnchorEl(null);
  };

  return (
    <>
      {Boolean(anchorEl) && (
        <ShareMenu
          MenuProps={{
            anchorEl,
            open: Boolean(anchorEl),
            onClose: handleCloseMenu,
          }}
          onClick={handleShareContent}
        />
      )}

      <Container>
        <Grid container spacing={2} alignItems="stretch">
          {showFilters && (
            <Grid item xs={12} sm={3}>
              <Box sx={{ height: "100%" }}>
                <FiltersSection
                  categories={categories?.items ?? []}
                  filters={filters}
                  onChange={handleChangeFilters}
                  onClear={handleClear}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={12} sm={showFilters ? 9 : 12}>
            <Box sx={{ position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <Stack direction="row" justifyContent="flex-end">
                      <IconButton onClick={handleToggleFilters}>
                        <FilterAltIcon />
                      </IconButton>
                      <LazyTextField
                        onChange={(value) =>
                          setFilters((filters) => ({
                            ...filters,
                            query: value,
                          }))
                        }
                        value={filters.query}
                        TextFieldProps={{
                          placeholder: formatMessage({
                            id: "search",
                            defaultMessage: "Search",
                          }),
                          variant: "standard",
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Stack direction="row" justifyContent="flex-end">
                      <Select
                        displayEmpty
                        onChange={handleChangeSort}
                        value={filters.sort}
                      >
                        <MenuItem value="">
                          <FormattedMessage
                            id="Created"
                            defaultMessage="Created"
                          />
                        </MenuItem>
                        <MenuItem value="asc">
                          <FormattedMessage
                            id="low.to.high"
                            defaultMessage="Low to High"
                          />
                        </MenuItem>
                        <MenuItem value="desc">
                          <FormattedMessage
                            id="high.to.low"
                            defaultMessage="High to low"
                          />
                        </MenuItem>
                      </Select>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {products && products?.totalItems > 0 ? (
                      products?.items?.map((product, key) => (
                        <Grid key={key} item xs={12} sm={3}>
                          <ProductCard
                            isOnWinshlist={isOnWishlist(product.id)}
                            product={product}
                            onWishlist={
                              isOnWishlist(product.id)
                                ? handleRemoveFromWishlist(product.id)
                                : handleAddToWishlist(product.id)
                            }
                            onShare={handleShare(product.id)}
                          />
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Box>
                          <Stack sx={{ py: 2 }}>
                            <Typography textAlign="center" variant="h5">
                              <FormattedMessage
                                id="no.products"
                                defaultMessage="No Products"
                              />
                            </Typography>
                            <Typography
                              textAlign="center"
                              variant="body1"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="no.products.to.show"
                                defaultMessage="No products to show"
                              />
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TablePagination
                    component="div"
                    count={products?.totalItems ?? 0}
                    page={products?.currentPage ?? 0}
                    onPageChange={(e, value) => {
                      setFilters((values) => ({ ...values, page: value }));
                    }}
                    rowsPerPage={filters.pageSize}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
