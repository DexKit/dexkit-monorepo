import { DexkitApiProvider } from '@dexkit/core/providers';
import { copyToClipboard } from '@dexkit/core/utils';
import { getWindowUrl } from '@dexkit/core/utils/browser';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { myAppsApi } from '@dexkit/ui/constants/api';
import CommerceContextProvider from '@dexkit/ui/modules/commerce/components/CommerceContextProvider';
import { ShareType } from '@dexkit/ui/modules/commerce/components/containers/types';
import { generateShareLink } from '@dexkit/ui/modules/commerce/components/containers/utils';
import ProductCard from '@dexkit/ui/modules/commerce/components/ProductCard';
import { useCommerceWishlist } from '@dexkit/ui/modules/commerce/hooks/useCommerceWishlist';
import useUserProduct from '@dexkit/ui/modules/commerce/hooks/useUserProduct';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

import FavoriteIcon from '@mui/icons-material/Favorite';

const ShareMenu = dynamic(
  () => import('@dexkit/ui/components/dialogs/ShareMenu'),
);

export interface CommerceProductProps {
  siteId?: number;
}

interface WishlistProductWrapperProps {
  productId: string;
  onShare: (target: HTMLElement) => void;
}

function WishlistProductWrapper({
  productId,
  onShare,
}: WishlistProductWrapperProps) {
  const {
    wishlist,
    isOnWishlist,
    handleRemoveFromWishlist,
    handleAddToWishlist,
  } = useCommerceWishlist();

  const { data: product } = useUserProduct({ id: productId });

  if (product) {
    return (
      <ProductCard
        product={product}
        isOnWinshlist={isOnWishlist(productId)}
        onShare={onShare}
        onWishlist={
          isOnWishlist(productId)
            ? handleRemoveFromWishlist(productId)
            : handleAddToWishlist(productId)
        }
      />
    );
  }

  return null;
}

export default function CommerceWishlist({ siteId }: CommerceProductProps) {
  const router = useRouter();

  const { wishlist } = useCommerceWishlist();

  const [id, setId] = useState<string>();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

    let link = '';

    if (
      ['telegram', 'whatsapp', 'facebook', 'email', 'pinterest', 'x'].includes(
        value,
      )
    ) {
      link = generateShareLink(msg, url, value as ShareType);

      window.open(link, '_blank');
    }

    if (value === 'copy') {
      copyToClipboard(url);
      enqueueSnackbar(
        <FormattedMessage id="link.copied" defaultMessage="Link copied" />,
        { variant: 'success' },
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage id="wishlist" defaultMessage="Wishlist" />
                  ),
                  uri: '/c/wishlist',
                  active: true,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {wishlist.length === 0 && (
                <Grid item xs={12}>
                  <Box>
                    <Stack alignItems="center">
                      <Box sx={{ fontSize: '3rem' }}>
                        <FavoriteIcon fontSize="inherit" />
                      </Box>
                      <Box>
                        <Typography textAlign="center" variant="h5">
                          <FormattedMessage
                            id="your.wishlist.is.empty"
                            defaultMessage="Your Wishlist is Empty"
                          />
                        </Typography>
                        <Typography
                          textAlign="center"
                          variant="body1"
                          color="text.secondary"
                        >
                          <FormattedMessage
                            id="start.adding.your.favorite.items.here"
                            defaultMessage="Start adding your favorite items here"
                          />
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              )}
              {wishlist.map((productId, index) => (
                <Grid key={index} item xs={12} sm={3}>
                  <WishlistProductWrapper
                    productId={productId}
                    onShare={handleShare(productId)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

(CommerceWishlist as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        <CommerceContextProvider>{page}</CommerceContextProvider>
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
  id?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      siteId: configResponse?.siteId ?? null,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
