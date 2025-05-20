import Link from "@dexkit/ui/components/AppLink";
import { Button, Card, CardContent, Grid, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";

import { CollectionFromApiCard } from "@dexkit/ui/modules/nft/components";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsSection({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderItems = () => {
    return section.items
      .filter((item) => item.type === "collection" && !item.featured)
      .map((item, index) => {
        if (item.type === "collection") {
          return (
            <Grid key={index} item xs={12} sm={6}>
              <Card elevation={isMobile ? 2 : 1} sx={{ height: '100%', mb: isMobile ? 1 : 0 }}>
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                  <CollectionFromApiCard
                    totalSupply={0}
                    variant="simple"
                    chainId={item.chainId}
                    contractAddress={item.contractAddress}
                    backgroundImageUrl={item.backgroundImageUrl}
                    title={item.title}
                    disabled={disabled}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        }
      });
  };

  const renderFeatured = () => {
    const featuredItem = section.items.find(
      (item) => item.type === "collection" && item.featured
    );

    if (featuredItem && featuredItem.type === "collection") {
      return (
        <Card elevation={isMobile ? 3 : 2} sx={{ mb: isMobile ? 2 : 0 }}>
          <CardContent sx={{ p: isMobile ? 1 : 2 }}>
            <CollectionFromApiCard
              variant="simple"
              totalSupply={0}
              chainId={featuredItem.chainId}
              contractAddress={featuredItem.contractAddress}
              backgroundImageUrl={featuredItem.backgroundImageUrl}
              title={featuredItem.title}
            />
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Box py={isMobile ? 4 : 8}>
      <Container maxWidth={isMobile ? "xs" : "lg"}>
        <Grid container spacing={isMobile ? 2 : 4} direction={isMobile ? "column" : "row"}>
          <Grid item xs={12} sx={{ mb: isMobile ? 2 : 0 }}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={isMobile ? 1 : 0}
              direction={isMobile ? "column" : "row"}
            >
              <Grid item xs={12} sm="auto" sx={{ mb: isMobile ? 1 : 0, textAlign: isMobile ? "center" : "left" }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 'bold' }}>
                  {section.title ? (
                    section.title
                  ) : (
                    <FormattedMessage
                      id="collections"
                      defaultMessage="Collections"
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} sm="auto" sx={{ textAlign: isMobile ? "center" : "right", mb: isMobile ? 2 : 0 }}>
                <Button
                  LinkComponent={Link}
                  href={disabled ? "javascript:void(0)" : "/collections"}
                  variant="contained"
                  color="primary"
                  size={isMobile ? "medium" : "medium"}
                  sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                >
                  <FormattedMessage id="see.all" defaultMessage="See all" />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Para móviles, mostrar vista previa abajo de los controles */}
          {isMobile ? (
            <Grid item xs={12}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12} sx={{ mb: 2 }}>
                  {renderFeatured()}
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {renderItems()}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            // En desktop, mantener el diseño original
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} sm={6}>
                  {renderFeatured()}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    {renderItems()}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default CollectionsSection;
