import { CollectionFromApiCard } from "@dexkit/ui/modules/nft/components";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Box, Card, CardContent, Chip, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { usePreviewPlatform } from "../../SectionsRenderer";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsHeroVariant({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobileMUI = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
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
    : (isMobileMUI || isMobileWindow || (typeof window !== 'undefined' && window.innerWidth < 500));

  const featuredItem = section.items.find((item) => item.type === "collection" && item.featured);
  const regularItems = section.items.filter((item) => item.type === "collection" && !item.featured);
  const heroItem = featuredItem || regularItems[0];
  const otherItems = featuredItem ? regularItems : regularItems.slice(1);
  const sidebarItems = otherItems.slice(0, 4);
  const additionalItems = otherItems.slice(4);

  const getHeroTypographyVariant = () => {
    if (isMobile) return "h5";
    if (isTablet) return "h4";
    return "h3";
  };

  return (
    <Stack spacing={{ xs: isExtraSmall ? 0.75 : 1, sm: 2, md: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: { xs: isExtraSmall ? 0.75 : 1, sm: 2, md: 3 } 
      }}>
        {heroItem && heroItem.type === "collection" && (
          <Box sx={{ 
            width: { xs: '100%', md: '66.666%' },
            flex: { xs: 'none', md: '0 0 66.666%' }
          }}>
            <Card
              elevation={4}
              sx={{
                height: { xs: isExtraSmall ? 200 : 240, sm: 320, md: 500 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  backgroundImage: `url(${heroItem.backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
                  }
                }}
              >
                {!isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: { sm: 20, md: 24 },
                      left: { sm: 20, md: 24 },
                      right: { sm: 20, md: 24 },
                      color: 'white',
                      zIndex: 1,
                    }}
                  >
                    <Stack spacing={{ sm: 1, md: 2 }}>
                      {featuredItem && !section.hideTitle && (
                        <Chip
                          label="Featured Collection"
                          color="primary"
                          size="small"
                          sx={{
                            alignSelf: 'flex-start',
                            fontWeight: 'bold',
                            fontSize: { sm: '0.8rem', md: '0.875rem' },
                            height: { sm: 24, md: 28 }
                          }}
                        />
                      )}
                      {!section.hideTitle && (
                        <>
                          <Typography
                            variant={getHeroTypographyVariant()}
                            fontWeight="bold"
                            sx={{
                              fontSize: { sm: '2rem', md: '2.5rem' },
                              lineHeight: 1.1,
                              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {heroItem.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              opacity: 0.95,
                              fontSize: { sm: '1rem', md: '1.1rem' },
                              textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                            }}
                          >
                            Discover this amazing collection
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </Box>
                )}

                {isMobile && !section.hideTitle && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 25,
                      bottom: 12,
                      zIndex: 10,
                      transform: 'rotate(90deg)',
                      transformOrigin: 'right bottom',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                        letterSpacing: '0.4px',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 0.25,
                      }}
                    >
                      {heroItem.title}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        )}

        <Box sx={{ 
          width: { xs: '100%', md: '33.333%' },
          flex: { xs: 'none', md: '0 0 33.333%' }
        }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: '1fr' },
            gap: { xs: isExtraSmall ? 0.5 : 0.75, sm: 1.5, md: 2 },
            pt: 1
          }}>
            {sidebarItems.map((item, index) => {
              if (item.type === "collection") {
                return (
                  <Box key={index}>
                    <Card
                      elevation={2}
                      sx={{
                        height: { xs: isExtraSmall ? 70 : 80, sm: 100, md: 115 },
                        transition: 'transform 0.2s ease-in-out',
                        position: 'relative',
                        overflow: isMobile ? 'visible' : 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: isMobile ? 0 : { xs: isExtraSmall ? 0.5 : 0.75, sm: 1, md: 1.5 }, height: '100%', overflow: 'hidden' }}>
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
                            right: 20,
                            bottom: 6,
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
                              fontSize: '0.65rem',
                              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                              letterSpacing: '0.2px',
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
                  </Box>
                );
              }
              return null;
            })}
          </Box>
        </Box>
      </Box>

      {additionalItems.length > 0 && (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: isExtraSmall ? 0.5 : 0.75, sm: 1.5, md: 2 },
          pt: 1
        }}>
          {additionalItems.map((item, index) => {
            if (item.type === "collection") {
              return (
                <Box key={index + 4}>
                  <Card
                    elevation={2}
                    sx={{
                      height: { xs: isExtraSmall ? 90 : 100, sm: 120, md: 150 },
                      transition: 'transform 0.2s ease-in-out',
                      position: 'relative',
                      overflow: isMobile ? 'visible' : 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 0 : { xs: isExtraSmall ? 0.5 : 0.75, sm: 1, md: 1.5 }, height: '100%', overflow: 'hidden' }}>
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
                          right: 20,
                          bottom: 6,
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
                            fontSize: '0.65rem',
                            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                            letterSpacing: '0.2px',
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
                </Box>
              );
            }
            return null;
          })}
        </Box>
      )}
    </Stack>
  );
} 