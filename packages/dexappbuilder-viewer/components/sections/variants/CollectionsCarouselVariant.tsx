import { CollectionFromApiCard } from "@dexkit/ui/modules/nft/components";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Card, CardContent, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { usePreviewPlatform } from "../../SectionsRenderer";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsCarouselVariant({ section, disabled }: Props) {
  const theme = useTheme();
  const isMobileMUI = useMediaQuery(theme.breakpoints.down('sm'));

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allItems = section.items.filter((item) => item.type === "collection");

  const needsScrolling = allItems.length > (isMobile ? 1 : 3);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  useEffect(() => {
    if (needsScrolling) {
      updateScrollButtons();
    }
  }, [needsScrolling, allItems.length]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = isMobile ? 220 : 320;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = isMobile ? 220 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box position="relative">
      {needsScrolling && (
        <Box sx={{ display: 'block' }}>
          <IconButton
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            sx={{
              position: 'absolute',
              left: { xs: -20, md: -50 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: 3,
              width: { xs: 36, md: 48 },
              height: { xs: 36, md: 48 },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
                boxShadow: 4,
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.5)',
              }
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' }, color: 'rgba(0,0,0,0.7)' }} />
          </IconButton>

          <IconButton
            onClick={scrollRight}
            disabled={!canScrollRight}
            sx={{
              position: 'absolute',
              right: { xs: -20, md: -50 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: 3,
              width: { xs: 36, md: 48 },
              height: { xs: 36, md: 48 },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
                boxShadow: 4,
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.5)',
              }
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' }, color: 'rgba(0,0,0,0.7)' }} />
          </IconButton>
        </Box>
      )}

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          overflowX: needsScrolling ? 'auto' : 'hidden',
          scrollBehavior: 'smooth',
          gap: { xs: 1, sm: 2 },
          pb: 1,
          pt: 1,
          px: { xs: needsScrolling ? 1 : 0, sm: 0 },
          pr: needsScrolling ? { xs: 1, sm: 2 } : 0,
          justifyContent: needsScrolling ? 'flex-start' : 'center',
          '&::-webkit-scrollbar': {
            height: needsScrolling ? { xs: 4, sm: 8 } : 0,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            }
          },
        }}
      >
        {allItems.map((item, index) => {
          if (item.type === "collection") {
            return (
              <Card
                key={index}
                elevation={2}
                sx={{
                  minWidth: { xs: 200, sm: 280, md: 300 },
                  width: { xs: 200, sm: 280, md: 300 },
                  height: { xs: 160, sm: 200, md: 240 },
                  flexShrink: needsScrolling ? 0 : 1,
                  maxWidth: needsScrolling ? 'none' : { xs: 200, sm: 280, md: 300 },
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ p: isMobile ? 0 : { xs: 1, sm: 1.5, md: 2 }, height: '100%', overflow: 'hidden' }}>
                  <CollectionFromApiCard
                    totalSupply={0}
                    variant="simple"
                    chainId={item.chainId}
                    contractAddress={item.contractAddress}
                    backgroundImageUrl={item.backgroundImageUrl}
                    title={item.title}
                    disabled={disabled}
                    hideTitle={isMobile}
                  />
                </CardContent>

                {isMobile && !section.hideTitle && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 20,
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
          return null;
        })}
      </Box>
    </Box>
  );
} 