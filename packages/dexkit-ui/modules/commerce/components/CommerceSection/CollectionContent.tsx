import {
  Box,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import LazyTextField from "@dexkit/ui/components/LazyTextField";
import Search from "@mui/icons-material/Search";
import { useState } from "react";
import ProductCard from "../ProductCard";

import useCollectionProductsList from "../../hooks/useCollectionProductsList";
import { useCommerceWishlist } from "../../hooks/useCommerceWishlist";

export interface CollectionContentProps {
  id: string;
}

export default function CollectionContent({ id }: CollectionContentProps) {
  const { formatMessage } = useIntl();

  const [filters, setFilters] = useState<{
    query: string;
    page: number;
    pageSize: number;
  }>({ query: "", pageSize: 10, page: 0 });

  const { data: products } = useCollectionProductsList({
    id,
    limit: filters.pageSize,
    page: filters.page,
    query: filters.query,
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters((values: any) => ({
      ...values,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

  const {
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isOnWishlist,
    wishlist,
  } = useCommerceWishlist();

  return (
    <Container>
      <Box sx={{ position: "relative" }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Box>
              <Stack direction="row" justifyContent="flex-end">
                <LazyTextField
                  onChange={(value) =>
                    setFilters((filters: any) => ({ ...filters, query: value }))
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

          <Grid size={12}>
            <Grid container spacing={2}>
              {products && products?.totalItems > 0 ? (
                products?.items?.map((product: any, key: any) => (
                  <Grid key={key} size={{ xs: 12, sm: 3 }}>
                    <ProductCard
                      isOnWinshlist={isOnWishlist(product.id)}
                      product={product}
                      onWishlist={
                        isOnWishlist(product.id)
                          ? handleRemoveFromWishlist(product.id)
                          : handleAddToWishlist(product.id)
                      }
                      onShare={() => { }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid size={12}>
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
          <Grid size={12}>
            <TablePagination
              component="div"
              count={products?.totalItems ?? 0}
              page={products?.currentPage ?? 0}
              onPageChange={(e, value) => {
                setFilters((values: any) => ({ ...values, page: value }));
              }}
              rowsPerPage={filters.pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
