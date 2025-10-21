import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePreviewPlatform } from "../../SectionsRenderer";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsCardsVariant({ section, disabled }: Props) {
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
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: isExtraSmall ? 1 : 1.5, sm: 2, md: 3 },
      pt: 1,
      width: '100%'
    }}>
      {allItems.map((item, index) => {
        if (item.type === "collection") {
          return (
            <Box key={index} sx={{
              width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'calc(33.333% - 16px)' },
              flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 8px)', lg: '0 0 calc(33.333% - 16px)' }
            }}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  minHeight: { xs: isExtraSmall ? 200 : 220, sm: 240, md: 260 },
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    backgroundImage: `url(${item.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    borderRadius: isMobile ? '4px' : '4px 4px 0 0',
                    overflow: 'hidden',
                    minHeight: isMobile ? '180px' : 'auto',
                    flex: 1
                  }}
                >
                  {isMobile && (
                    <Chip
                      label={NETWORK_SLUG(item.chainId)?.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        fontSize: '0.6rem',
                        height: 18,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: 'rgba(0,0,0,0.8)',
                        borderColor: 'rgba(0,0,0,0.2)',
                        fontWeight: 'bold',
                        zIndex: 5
                      }}
                    />
                  )}

                  {item.featured && (
                    <Chip
                      label="Featured"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: { xs: 30, sm: 32, md: 34 },
                        left: { xs: 6, sm: 8, md: 10 },
                        fontWeight: 'bold',
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' },
                        zIndex: 6
                      }}
                    />
                  )}

                  {isMobile && (
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
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
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
                  )}
                </Box>

                {!isMobile && (
                  <CardContent
                    sx={{
                      p: { sm: 1.75, md: 2 },
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Stack spacing={{ sm: 1.25, md: 1.5 }} sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="bold"
                        sx={{
                          fontSize: { sm: '1.2rem', md: '1.3rem' },
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Chip
                          label={NETWORK_SLUG(item.chainId)?.toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { sm: '0.7rem', md: '0.75rem' },
                            height: { sm: 22, md: 26 }
                          }}
                        />
                      </Stack>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          wordBreak: 'break-all',
                          fontFamily: 'monospace',
                          fontSize: { sm: '0.75rem', md: '0.8rem' },
                          lineHeight: 1.3
                        }}
                      >
                        {item.contractAddress}
                      </Typography>
                    </Stack>
                  </CardContent>
                )}
              </Card>
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
} 