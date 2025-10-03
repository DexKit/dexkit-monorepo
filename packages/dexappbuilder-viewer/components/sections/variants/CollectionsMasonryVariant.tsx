import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Box, Card, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { usePreviewPlatform } from "../../SectionsRenderer";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsMasonryVariant({ section, disabled }: Props) {
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

  const allItems = section.items.filter((item) => item.type === "collection");

  return (
    <Box
      sx={{
        columnCount: { xs: isExtraSmall ? 1 : 2, sm: 2, md: 3, lg: 4 },
        columnGap: { xs: isExtraSmall ? 1 : 1.5, sm: 2, md: 2.5 },
        columnFill: 'balance',
        '& > *': {
          breakInside: 'avoid',
          mb: { xs: isExtraSmall ? 1 : 1.5, sm: 2, md: 2.5 },
          display: 'inline-block',
          width: '100%'
        }
      }}
    >
      {allItems.map((item, index) => {
        if (item.type === "collection") {
          const heights = [200, 250, 300, 180, 220, 280, 240, 260];
          const randomHeight = heights[index % heights.length];
          
          return (
            <Card
              key={index}
              elevation={3}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  minHeight: { xs: randomHeight * 0.8, sm: randomHeight * 0.85, md: randomHeight },
                  backgroundImage: `url(${item.backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)',
                  }
                }}
              >
                <Chip
                  label={NETWORK_SLUG(item.chainId)?.toUpperCase()}
                  size="small"
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    top: { xs: 6, sm: 8, md: 10 },
                    right: { xs: 6, sm: 8, md: 10 },
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    height: { xs: 18, sm: 20, md: 22 },
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: 'rgba(0,0,0,0.8)',
                    borderColor: 'rgba(0,0,0,0.2)',
                    fontWeight: 'bold',
                    zIndex: 3
                  }}
                />

                {item.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: { xs: 30, sm: 32, md: 34 },
                      right: { xs: 6, sm: 8, md: 10 },
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      zIndex: 4
                    }}
                  />
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: { xs: isExtraSmall ? 1 : 1.25, sm: 1.5, md: 2 },
                    zIndex: 1,
                  }}
                >
                  {!section.hideTitle && (
                    <>
                      {isMobile ? (
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 25,
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
                            fontWeight="bold"
                            sx={{
                              color: 'white',
                              fontSize: '0.75rem',
                              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                              letterSpacing: '0.3px',
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              px: 1,
                              py: 0.25,
                              borderRadius: 0.25,
                            }}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          fontWeight="bold"
                          sx={{
                            color: 'white',
                            fontSize: { xs: isExtraSmall ? '0.9rem' : '1rem', sm: '1.1rem', md: '1.25rem' },
                            lineHeight: 1.2,
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.title}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Card>
          );
        }
        return null;
      })}
    </Box>
  );
} 