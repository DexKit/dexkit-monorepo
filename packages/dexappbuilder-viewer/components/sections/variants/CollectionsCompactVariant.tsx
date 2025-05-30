import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Avatar, Box, Chip, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { usePreviewPlatform } from "../../SectionsRenderer";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsCompactVariant({ section, disabled }: Props) {
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
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: { xs: 'nowrap', sm: 'wrap' },
        gap: { xs: isExtraSmall ? 0.75 : 1, sm: 1.5, md: 2 },
        justifyContent: 'center',
        alignItems: { xs: 'center', sm: 'flex-start' },
        pt: 0.25,
      }}
    >
      {allItems.map((item, index) => {
        if (item.type === "collection") {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: isExtraSmall ? 0.75 : 1, sm: 1, md: 1.5 },
                p: { xs: isExtraSmall ? 0.75 : 1, sm: 1, md: 1.5 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                width: { xs: '90%', sm: 'auto' },
                minWidth: { xs: 'auto', sm: 180, md: 200 },
                maxWidth: { xs: '90%', sm: 260, md: 280 },
                minHeight: { xs: isExtraSmall ? 48 : 56, sm: 48, md: 56 },
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                }
              }}
            >
              <Avatar
                src={item.backgroundImageUrl}
                sx={{
                  width: { xs: isExtraSmall ? 36 : 40, sm: 40, md: 48 },
                  height: { xs: isExtraSmall ? 36 : 40, sm: 40, md: 48 },
                  borderRadius: 1.5
                }}
                variant="rounded"
              />

              <Stack sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: { xs: isExtraSmall ? '0.75rem' : '0.85rem', sm: '0.8rem', md: '0.875rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {item.title}
                  </Typography>
                  {item.featured && (
                    <Chip
                      label="★"
                      size="small"
                      color="primary"
                      sx={{
                        minWidth: { xs: isExtraSmall ? 16 : 18, sm: 20, md: 24 },
                        height: { xs: isExtraSmall ? 14 : 16, sm: 16, md: 20 },
                        '& .MuiChip-label': {
                          px: 0.2,
                          fontSize: { xs: isExtraSmall ? '0.6rem' : '0.65rem', sm: '0.65rem', md: '0.75rem' }
                        }
                      }}
                    />
                  )}
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: isExtraSmall ? '0.6rem' : '0.65rem', sm: '0.65rem', md: '0.75rem' },
                    lineHeight: 1.2
                  }}
                >
                  {isExtraSmall
                    ? `${item.contractAddress.slice(0, 4)}...${item.contractAddress.slice(-3)}`
                    : `${item.contractAddress.slice(0, 6)}...${item.contractAddress.slice(-4)}`
                  }
                </Typography>
              </Stack>
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
}