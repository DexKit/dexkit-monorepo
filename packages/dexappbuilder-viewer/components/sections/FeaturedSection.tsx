import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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

  const renderAssetCards = () => {
    return items
      .filter((item) => item.type === "asset")
      .map((item, index: number) => {
        const assetItem = item as any;
        return (
          <Box key={index}>
            <Card elevation={isMobile ? 2 : 1} sx={{ height: "100%" }}>
              <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                <AssetFromApi
                  chainId={item.chainId}
                  contractAddress={item.contractAddress}
                  tokenId={assetItem.tokenId}
                  disabled={disabled}
                />
                <Typography variant="subtitle2" align="center" sx={{ mt: 1 }}>
                  {item.title || `#${assetItem.tokenId}`}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      });
  };

  const renderBannerCard = () => {
    const bannerItem = items.find((item) => item.type === "collection");
    if (!bannerItem) return null;
    return (
      <Box>
        <Card elevation={isMobile ? 2 : 1} sx={{ height: "100%" }}>
          <CardContent sx={{ p: isMobile ? 1 : 2 }}>
            <CollectionFromApiCard
              totalSupply={0}
              contractAddress={bannerItem.contractAddress}
              chainId={bannerItem.chainId}
              title={bannerItem.title}
              backgroundImageUrl={bannerItem?.backgroundImageUrl}
              disabled={disabled}
            />
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box bgcolor="#111" color="#fff" py={isMobile ? 2 : 4} px={0} width="100%">
      <Container maxWidth="xl" disableGutters sx={{ px: 0, width: "100%" }}>
        <Box sx={{ px: isMobile ? 2 : 1 }}>
          <Typography
            align="left"
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            sx={{
              fontSize: isMobile ? "1.75rem" : undefined,
              mb: isMobile ? 1 : 2,
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: isMobile ? 2 : 3,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: `repeat(${Math.min(items.filter((item) => item.type === "asset").length, 4)}, 1fr)`,
                },
                gap: isMobile ? 1 : 1.5,
                maxWidth: "1200px",
                width: "100%",
              }}
            >
              {renderAssetCards()}
            </Box>
          </Box>

          {renderBannerCard()}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturedSection;
