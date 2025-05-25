import { AppLink as Link } from "@dexkit/ui/components";
import { Box, Button, Card, CardContent, Container, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

import {
  AssetFromApi,
  CollectionFromApiCard,
} from "@dexkit/ui/modules/nft/components";
import { CallToActionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";

interface Props {
  section: CallToActionAppPageSection;
  disabled?: boolean;
}

export function CallToActionSection({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!section || typeof section !== 'object') {
    return null;
  }

  const renderItems = () => {
    if (!section.items || !Array.isArray(section.items) || section.items.length === 0) {
      return null;
    }

    return section.items.map((item, index: number) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      if (item.type === "asset" && item.tokenId !== undefined) {
        return (
          <Grid item xs={6} sm={4} md={3} key={index}>
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
          <Grid item xs={12} sm={6} key={index}>
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
      return null;
    });
  };

  const hasItems = section.items && Array.isArray(section.items) && section.items.length > 0;

  return (
    <Box
      py={isMobile ? 2 : 4}
      px={0}
      width="100%"
      sx={(theme) => ({
        bgcolor:
          section.variant === "dark"
            ? theme.palette.text.primary
            : theme.palette.background.default,
        color:
          section.variant === "dark"
            ? theme.palette.background.default
            : theme.palette.text.primary,
      })}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: 0, width: '100%' }}>
        {isMobile ? (
          <Grid container spacing={1} direction="column" alignItems="flex-start" justifyContent="flex-start">
            <Grid item xs={12} sx={{ textAlign: 'left', mb: 1, pl: 1 }}>
              <Typography
                variant="body1"
                color={section.variant === "dark" ? "secondary" : "primary"}
                sx={{ mb: 1 }}
              >
                {section.subtitle}
              </Typography>
              <Typography
                color="inherit"
                variant="h4"
                sx={{
                  fontSize: "1.75rem",
                  lineHeight: 1.2,
                  mb: 2,
                  fontWeight: 'bold'
                }}
              >
                {section.title}
              </Typography>
              <Button
                LinkComponent={Link}
                target={section.button?.openInNewPage ? "_blank" : undefined}
                href={
                  disabled ? "javascript:void(0)" : section.button?.url || ""
                }
                variant="contained"
                color="primary"
                size="medium"
                sx={{ px: 3, py: 1, mb: 2 }}
              >
                {section.button?.title || ""}
              </Button>
            </Grid>

            {hasItems && (
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="center">
                  {renderItems()}
                </Grid>
              </Grid>
            )}
          </Grid>
        ) : (
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    color={section.variant === "dark" ? "secondary" : "primary"}
                  >
                    {section.subtitle}
                  </Typography>
                  <Typography
                    color="inherit"
                    variant="h2"
                    sx={{
                      mb: 2
                    }}
                  >
                    {section.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    LinkComponent={Link}
                    target={section.button?.openInNewPage ? "_blank" : undefined}
                    href={
                      disabled ? "javascript:void(0)" : section.button?.url || ""
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 3 }}
                  >
                    {section.button?.title || ""}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {hasItems && (
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} justifyContent="center">
                  {renderItems()}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default CallToActionSection;
