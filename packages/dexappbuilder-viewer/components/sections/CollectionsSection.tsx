import Link from "@dexkit/ui/components/AppLink";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";
import { usePreviewPlatform } from "../SectionsRenderer";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { CollectionsCardsVariant } from "./variants/CollectionsCardsVariant";
import { CollectionsCarouselVariant } from "./variants/CollectionsCarouselVariant";
import { CollectionsCompactVariant } from "./variants/CollectionsCompactVariant";
import { CollectionsGridVariant } from "./variants/CollectionsGridVariant";
import { CollectionsHeroVariant } from "./variants/CollectionsHeroVariant";
import { CollectionsListVariant } from "./variants/CollectionsListVariant";
import { CollectionsMasonryVariant } from "./variants/CollectionsMasonryVariant";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsSection({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(400));
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : isMobileDevice;

  const renderVariant = () => {
    const variant = section.variant || "grid";
    const props = { section, disabled };

    switch (variant) {
      case "list":
        return <CollectionsListVariant {...props} />;
      case "carousel":
        return <CollectionsCarouselVariant {...props} />;
      case "cards":
        return <CollectionsCardsVariant {...props} />;
      case "masonry":
        return <CollectionsMasonryVariant {...props} />;
      case "hero":
        return <CollectionsHeroVariant {...props} />;
      case "compact":
        return <CollectionsCompactVariant {...props} />;
      case "grid":
      default:
        return <CollectionsGridVariant {...props} />;
    }
  };

  return (
    <Box py={isExtraSmall ? 0.75 : isMobile ? 2 : 8}>
      <Container
        maxWidth={isMobile ? "xs" : "lg"}
        sx={{
          px: { xs: isExtraSmall ? 0.5 : 0.75, sm: 2, md: 3 },
        }}
      >
        <Grid container spacing={isExtraSmall ? 0.5 : isMobile ? 1 : 4}>
          <Grid item xs={12} sx={{ mb: isExtraSmall ? 0.5 : isMobile ? 0.75 : 0 }}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={isMobile ? 0.5 : 0}
              direction={isMobile ? "column" : "row"}
            >
              <Grid item xs={12} sm="auto" sx={{ mb: isMobile ? 0.25 : 0, textAlign: isMobile ? "center" : "left" }}>
                <Typography
                  variant={isExtraSmall ? "subtitle1" : isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: isExtraSmall ? '1rem' : '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.2
                  }}
                >
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
              <Grid item xs={12} sm="auto" sx={{ textAlign: isMobile ? "center" : "right", mb: isExtraSmall ? 0.5 : isMobile ? 0.75 : 0 }}>
                <Button
                  LinkComponent={Link}
                  href={disabled ? "javascript:void(0)" : "/collections"}
                  variant="contained"
                  color="primary"
                  size={isExtraSmall ? "small" : isMobile ? "medium" : "medium"}
                  sx={{
                    minWidth: isMobile ? '100%' : 'auto',
                    fontSize: { xs: isExtraSmall ? '0.7rem' : '0.75rem', sm: '0.875rem' },
                    py: { xs: isExtraSmall ? 0.25 : 0.5, sm: 1 },
                    minHeight: { xs: isExtraSmall ? 28 : 32, sm: 36 }
                  }}
                >
                  <FormattedMessage id="see.all" defaultMessage="See all" />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {renderVariant()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CollectionsSection;
