import { Box, Card, CardContent, Container, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

import AssetFromApi from "@dexkit/ui/modules/nft/components/AssetFromApi";
import { CollectionFromApiCard } from "@dexkit/ui/modules/nft/components/CollectionFromApi";
import { SectionItem } from "@dexkit/ui/modules/wizard/types/config";

interface Props {
  title: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
  items: SectionItem[];
}

export function FeaturedSection({ title, items, disabled }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderItems = () => {
    return items.map((item, index: number) => {
      if (item.type === "asset" && item.tokenId !== undefined) {
        return (
          <Grid item xs={12} sm={4} md={3} key={index} sx={{ mb: isMobile ? 2 : 0 }}>
            <Card elevation={isMobile ? 2 : 1} sx={{ height: '100%' }}>
              <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                <AssetFromApi
                  chainId={item.chainId}
                  contractAddress={item.contractAddress}
                  tokenId={item.tokenId}
                  disabled={disabled}
                />
                <Typography variant="subtitle2" align="center" sx={{ mt: 1 }}>
                  {item.title || `#${item.tokenId}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      } else if (item.type === "collection") {
        return (
          <Grid item xs={12} sm={6} key={index} sx={{ mb: isMobile ? 2 : 0 }}>
            <Card elevation={isMobile ? 2 : 1} sx={{ height: '100%' }}>
              <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                <CollectionFromApiCard
                  totalSupply={0}
                  contractAddress={item.contractAddress}
                  chainId={item.chainId}
                  title={item.title}
                  backgroundImageUrl={item.backgroundImageUrl}
                  disabled={disabled}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      }
    });
  };

  return (
    <Box bgcolor="#111" color="#fff" py={isMobile ? 2 : 4} px={0} width="100%">
      <Container maxWidth="xl" disableGutters sx={{ px: 0, width: '100%' }}>
        <Grid container spacing={isMobile ? 1 : 2} direction={isMobile ? "column" : "row"} justifyContent="flex-start">
          <Grid item xs={12} sx={{ mb: isMobile ? 1 : 2 }}>
            <Typography
              align="left"
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              sx={{ fontSize: isMobile ? "1.75rem" : undefined, pl: 1 }}
            >
              {title}
            </Typography>
          </Grid>

          {isMobile ? (
            <Grid item xs={12}>
              <Grid container spacing={1} justifyContent="center">
                {renderItems()}
              </Grid>
            </Grid>
          ) : (
            renderItems()
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturedSection;
