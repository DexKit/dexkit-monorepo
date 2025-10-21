import { CollectionFromApiCard } from "@dexkit/ui/modules/nft/components";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { usePreviewPlatform } from "../../SectionsRenderer";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsGridVariant({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(400));

  const [isMobileWindow, setIsMobileWindow] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobileWindow(width < 600 || document.body.clientWidth < 600);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const previewContext = usePreviewPlatform();
  const isMobile = previewContext
    ? previewContext.isMobile
    : (isMobileDevice || isMobileWindow || (typeof window !== 'undefined' && window.innerWidth < 500));

  const featuredItem = section.items.find(
    (item) => item.type === "collection" && item.featured
  );
  const regularItems = section.items.filter(
    (item) => item.type === "collection" && !item.featured
  );

  const renderCollectionCard = (item: any, isFeatured = false) => {
    if (item.type === "collection") {
      return (
        <Card
          elevation={isFeatured ? 3 : 2}
          sx={{
            height: { xs: isExtraSmall ? 200 : 220, sm: 240, md: 260 },
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              boxShadow: isFeatured ? 6 : 4,
              transform: 'translateY(-2px)',
            }
          }}
        >
          <CardContent sx={{
            p: isMobile ? 0 : { xs: isExtraSmall ? 1 : 1.25, sm: 1.5, md: 2 },
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}>
            <CollectionFromApiCard
              totalSupply={0}
              variant="simple"
              chainId={item.chainId}
              contractAddress={item.contractAddress}
              backgroundImageUrl={item.backgroundImageUrl}
              title={item.title}
              disabled={disabled}
              hideTitle={isMobile || section.hideTitle}
            />
          </CardContent>

          {isMobile && !section.hideTitle && (
            <Box
              sx={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                zIndex: 10,
                transform: 'rotate(90deg)',
                transformOrigin: 'right bottom',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  letterSpacing: '0.3px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.25,
                }}
              >
                {item.title}
              </Typography>
            </Box>
          )}
        </Card>
      );
    }
  };

  const allItems = featuredItem ? [featuredItem, ...regularItems] : regularItems;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: { xs: isExtraSmall ? 1 : 1.5, sm: 2, md: 3 },
        alignItems: 'stretch'
      }}
    >
      {allItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            minHeight: { xs: isExtraSmall ? 200 : 220, sm: 240, md: 260 }
          }}
        >
          {renderCollectionCard(item, item.type === "collection" && item.featured)}
        </Box>
      ))}
    </Box>
  );
} 