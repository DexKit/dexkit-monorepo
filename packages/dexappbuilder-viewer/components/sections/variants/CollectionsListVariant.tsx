import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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

export function CollectionsListVariant({ section, disabled }: Props) {
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
    <List sx={{ width: '100%', p: 0 }}>
      {allItems.map((item, index) => {
        if (item.type === "collection") {
          return (
            <ListItem
              key={index}
              sx={{
                mb: { xs: isExtraSmall ? 0.25 : 0.5, sm: 1, md: 1.5 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                p: { xs: isExtraSmall ? 0.5 : 0.75, sm: 1.5, md: 2 },
                minHeight: { xs: isExtraSmall ? 50 : 60, sm: 70, md: 90 },
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemAvatar sx={{ minWidth: { xs: isExtraSmall ? 40 : 48, sm: 58, md: 78 } }}>
                <Avatar
                  src={item.backgroundImageUrl}
                  sx={{
                    width: { xs: isExtraSmall ? 32 : 40, sm: 50, md: 70 },
                    height: { xs: isExtraSmall ? 32 : 40, sm: 50, md: 70 },
                    borderRadius: 2
                  }}
                  variant="rounded"
                />
              </ListItemAvatar>

              <ListItemText
                sx={{ ml: { xs: isExtraSmall ? 0.25 : 0.5, sm: 1.5, md: 2 } }}
                primary={
                  <Stack direction="row" alignItems="center" spacing={0.25} sx={{ mb: { xs: 0.05, sm: 0.15, md: 0.25 } }}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      component="div"
                      sx={{
                        fontSize: { xs: isExtraSmall ? '0.75rem' : '0.85rem', sm: '1.1rem', md: '1.25rem' },
                        lineHeight: 1.1,
                        fontWeight: 'medium'
                      }}
                    >
                      {item.title}
                    </Typography>
                    {item.featured && (
                      <Chip
                        label="★"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontSize: { xs: '0.5rem', sm: '0.65rem' },
                          height: { xs: 14, sm: 18 },
                          minWidth: { xs: 14, sm: 18 }
                        }}
                      />
                    )}
                  </Stack>
                }
                secondary={
                  <Stack direction="column" spacing={{ xs: 0.05, sm: 0.15, md: 0.25 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: isExtraSmall ? '0.6rem' : '0.65rem', sm: '0.8rem', md: '0.875rem' },
                        lineHeight: 1.1
                      }}
                    >
                      Network: {NETWORK_SLUG(item.chainId)?.toUpperCase()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: { xs: isExtraSmall ? '0.5rem' : '0.55rem', sm: '0.7rem', md: '0.75rem' },
                        wordBreak: 'break-all',
                        lineHeight: 1.1
                      }}
                    >
                      {isExtraSmall
                        ? `${item.contractAddress.slice(0, 3)}...${item.contractAddress.slice(-2)}`
                        : `${item.contractAddress.slice(0, 5)}...${item.contractAddress.slice(-3)}`
                      }
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          );
        }
        return null;
      })}
    </List>
  );
} 