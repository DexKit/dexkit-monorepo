import { AppLink as Link } from "@dexkit/ui/components";
import { Box, Button, Card, CardContent, Container, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { memo, useMemo } from "react";

import {
  AssetFromApi,
  CollectionFromApiCard,
} from "@dexkit/ui/modules/nft/components";
import { CallToActionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { usePreviewPlatform } from "../SectionsRenderer";

interface Props {
  section: CallToActionAppPageSection;
  disabled?: boolean;
}

const CallToActionSection = memo(function CallToActionSection({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : isMobileDevice;

  if (!section || typeof section !== 'object') {
    return null;
  }

  const hasItems = useMemo(() => 
    section.items && Array.isArray(section.items) && section.items.length > 0,
    [section.items]
  );

  const renderItems = useMemo(() => {
    if (!hasItems) {
      return [];
    }

    return section.items.map((item, index: number) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      if (item.type === "asset" && item.tokenId !== undefined) {
        return (
          <Card 
            key={index}
            elevation={isMobile ? 2 : 1} 
            sx={{ 
              height: '100%',
              aspectRatio: '1/1',
              minHeight: isMobile ? '200px' : '100px',
              width: '100%'
            }}
          >
            <CardContent sx={{ 
              p: isMobile ? 2 : 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <AssetFromApi
                chainId={item.chainId}
                contractAddress={item.contractAddress}
                tokenId={item.tokenId}
                disabled={disabled}
              />
              <Typography variant="subtitle2" align="center" sx={{ mt: 1, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                {item.title || `#${item.tokenId}`}
              </Typography>
            </CardContent>
          </Card>
        );
      } else if (item.type === "collection") {
        return (
          <Card 
            key={index}
            elevation={isMobile ? 2 : 1} 
            sx={{ 
              height: '100%',
              aspectRatio: '1/1',
              minHeight: isMobile ? '200px' : '100px',
              width: '100%'
            }}
          >
            <CardContent sx={{ 
              p: isMobile ? 2 : 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
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
        );
      }
      return null;
    });
  }, [hasItems, section.items, isMobile, disabled]);

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
        <Box sx={{ px: 1 }}>
          {isMobile ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 3,
              px: 2
            }}>
              <Box sx={{ 
                width: '100%',
                maxWidth: '400px'
              }}>
                <Typography
                  variant="h6"
                  color={section.variant === "dark" ? "secondary" : "primary"}
                  sx={{ mb: 1.5, fontSize: '1rem' }}
                >
                  {section.subtitle}
                </Typography>
                <Typography
                  color="inherit"
                  variant="h4"
                  sx={{
                    fontSize: "1.75rem",
                    lineHeight: 1.2,
                    mb: 3,
                    fontWeight: 'bold'
                  }}
                >
                  {section.title}
                </Typography>
              </Box>

              {hasItems && (
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2.5,
                  width: '100%',
                  maxWidth: '450px'
                }}>
                  {renderItems}
                </Box>
              )}

              <Button
                LinkComponent={Link}
                target={section.button?.openInNewPage ? "_blank" : undefined}
                href={
                  disabled ? "javascript:void(0)" : section.button?.url || ""
                }
                variant="contained"
                color="primary"
                size="medium"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  width: '100%',
                  maxWidth: '250px',
                  color: 'white !important',
                  '&:hover': {
                    color: 'white !important'
                  }
                }}
              >
                {section.button?.title || ""}
              </Button>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              minHeight: '300px'
            }}>
              <Box sx={{ 
                flex: '0 0 auto',
                minWidth: '300px',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'left'
              }}>
                <Typography
                  variant="h5"
                  color={section.variant === "dark" ? "secondary" : "primary"}
                  sx={{ mb: 1.5, fontSize: '1.25rem' }}
                >
                  {section.subtitle}
                </Typography>
                <Typography
                  color="inherit"
                  variant="h2"
                  sx={{
                    fontSize: "3rem",
                    lineHeight: 1.2,
                    mb: 3,
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
                  sx={{ 
                    px: 3, 
                    py: 1.5,
                    minWidth: '200px',
                    alignSelf: 'flex-start',
                    color: 'white !important',
                    '&:hover': {
                      color: 'white !important'
                    }
                  }}
                >
                  {section.button?.title || ""}
                </Button>
              </Box>

              {hasItems && (
                <Box sx={{ 
                  flex: '1 1 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1.5,
                    maxWidth: '600px',
                    width: '100%'
                  }}>
                    {renderItems}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
});

export { CallToActionSection };
export default CallToActionSection;
