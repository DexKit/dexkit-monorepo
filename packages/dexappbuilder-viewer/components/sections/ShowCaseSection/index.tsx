import { useIsMobile } from "@dexkit/core";
import {
  ShowCaseItem,
  ShowCasePageSection,
} from "@dexkit/ui/modules/wizard/types/section";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Container, Grid, IconButton, Stack, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import { usePreviewPlatform } from "../../SectionsRenderer";
import Pagination from "../CarouselSection/Pagination";
import ShowCaseCard from "./ShowCaseCard";

function chunk<T>(arr: T[], len: number) {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}

export interface ShowCaseSectionProps {
  section: ShowCasePageSection;
}

export default function ShowCaseSection({ section }: ShowCaseSectionProps) {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

  const {
    items = [],
    layout = "grid",
    columns = { desktop: 4, tablet: 3, mobile: 2 },
    alignItems = "center",
    itemsSpacing = 2,
    showOverlay = false,
    textOverlay = false,
    textOverlayPosition = "bottom",
    textOverlayBackground = "none",
  } = section.settings;


  const isMobileDevice = useIsMobile();
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : isMobileDevice;

  const getResponsiveColumns = () => {
    if (isMobile) {
      return columns?.mobile || 2;
    }

    if (typeof window !== 'undefined') {
      if (window.innerWidth < 960) {
        return columns?.tablet || 2;
      }
    }

    return columns?.desktop || 2;
  };

  const pages = useMemo(() => {
    const cols = getResponsiveColumns();
    return chunk<ShowCaseItem>(items, cols);
  }, [items, isMobile, layout, columns]);

  const handleChangeIndex = (index: number, indexLatest: number) => {
    setIndex(index);
  };

  const handleNext = () => {
    if (index + 1 === pages?.length) {
      return setIndex(0);
    }

    setIndex((index: any) => index + 1);
  };

  const handlePrev = () => {
    if (index - 1 === -1) {
      return setIndex(pages?.length - 1);
    }

    setIndex((index: any) => index - 1);
  };

  const alignItemsValue = useMemo(() => {
    const results = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    };

    return results[alignItems];
  }, [alignItems]);

  const getSectionStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      overflow: 'hidden',
    };

    const layoutStyles = {
      grid: {
        ...baseStyles,
      },
      masonry: {
        ...baseStyles,
      },
      carousel: {
        ...baseStyles,
      },
      list: {
        ...baseStyles,
        maxWidth: '800px',
        margin: '0 auto',
      },
    };

    return layoutStyles[layout];
  };

  const getGridStyles = () => {
    const baseGridStyles = {
      container: true,
      justifyContent: alignItemsValue,
      spacing: itemsSpacing,
    };

    const layoutGridStyles = {
      grid: {
        ...baseGridStyles,
      },
      masonry: {
        ...baseGridStyles,
        sx: {
          display: 'grid',
          gridTemplateColumns: `repeat(${getResponsiveColumns()}, 1fr)`,
          gap: theme.spacing(itemsSpacing),
        },
      },
      carousel: {
        ...baseGridStyles,
      },
      list: {
        ...baseGridStyles,
        direction: 'column' as const,
        spacing: 2,
      },
    };

    return layoutGridStyles[layout];
  };

  const getItemSizing = () => {
    const layoutSizing = {
      grid: {
        size: {
          xs: 12 / getResponsiveColumns(),
          sm: 12 / Math.min(getResponsiveColumns(), 4),
          md: 12 / Math.min(getResponsiveColumns(), 6),
        },
      },
      masonry: {
        sx: {
          breakInside: 'avoid',
          marginBottom: theme.spacing(itemsSpacing),
        },
      },
      carousel: {
        size: {
          xs: 12 / getResponsiveColumns(),
          sm: 12 / Math.min(getResponsiveColumns(), 4),
          md: 12 / Math.min(getResponsiveColumns(), 6),
        },
      },
      list: {
        size: 12,
      },
    };

    return layoutSizing[layout];
  };

  const renderNavigationButtons = () => {
    if (isMobile || pages.length <= 1) return null;

    const buttonStyles = {
      bgcolor: (theme: any) => theme.alpha(theme.palette.action.focus, 0.25),
      '&:hover': {
        bgcolor: (theme: any) => theme.alpha(theme.palette.action.focus, 0.4),
      },
      '@media (max-width: 600px)': {
        width: '40px',
        height: '40px',
      },
      '@media (max-width: 480px)': {
        width: '36px',
        height: '36px',
      },
    };

    return (
      <>
        <Box>
          <IconButton
            sx={buttonStyles}
            onClick={handlePrev}
          >
            <KeyboardArrowLeftIcon
              sx={{
                '@media (max-width: 600px)': {
                  fontSize: '1.5rem',
                },
                '@media (max-width: 480px)': {
                  fontSize: '1.25rem',
                },
              }}
            />
          </IconButton>
        </Box>
        <Box>
          <IconButton
            sx={buttonStyles}
            onClick={handleNext}
          >
            <KeyboardArrowRightIcon
              sx={{
                // Responsive icon sizing
                '@media (max-width: 600px)': {
                  fontSize: '1.5rem',
                },
                '@media (max-width: 480px)': {
                  fontSize: '1.25rem',
                },
              }}
            />
          </IconButton>
        </Box>
      </>
    );
  };

  const renderPagination = () => {
    if (pages.length <= 1) return null;

    return (
      <Box sx={{
        position: "relative",
        py: 2,
        '@media (max-width: 600px)': {
          py: 1,
        },
      }}>
        <Pagination
          dots={pages?.length}
          index={index}
          onChangeIndex={(index: number) => {
            setIndex(index);
          }}
        />
      </Box>
    );
  };

  const renderContent = () => {
    const sectionSettings = {
      showOverlay,
      textOverlay,
      textOverlayPosition,
      textOverlayBackground,
      textOverlayBackgroundColor: section.settings.textOverlayBackgroundColor,
      textOverlayTextColor: section.settings.textOverlayTextColor,
      textOverlayBorderRadius: section.settings.textOverlayBorderRadius,
    };

    if (layout === "masonry") {
      return (
        <Box sx={getSectionStyles()}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: `repeat(${Math.min(getResponsiveColumns(), 2)}, 1fr)`,
                sm: `repeat(${Math.min(getResponsiveColumns(), 3)}, 1fr)`,
                md: `repeat(${getResponsiveColumns()}, 1fr)`,
              },
              gap: theme.spacing(itemsSpacing),
              '& > *': {
                breakInside: 'avoid',
                marginBottom: theme.spacing(itemsSpacing),
              },
            }}
          >
            {items.map((item, itemIndex) => (
              <Box key={itemIndex}>
                <ShowCaseCard item={item} sectionSettings={sectionSettings} />
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (layout === "list") {
      return (
        <Box sx={getSectionStyles()}>
          <Stack spacing={itemsSpacing}>
            {items.map((item, itemIndex) => (
              <Box key={itemIndex}>
                <ShowCaseCard item={item} sectionSettings={sectionSettings} />
              </Box>
            ))}
          </Stack>
        </Box>
      );
    }

    if (layout === "carousel") {
      return (
        <SwipeableViews
          index={index}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
        >
          {pages.map((page: any, pageIndex: any) => (
            <Box sx={{ position: "relative", p: 2 }} key={pageIndex}>
              <Grid {...getGridStyles()}>
                {page.map((item: any, itemIndex: any) => (
                  <Grid {...getItemSizing()} key={`${pageIndex}-${itemIndex}`}>
                    <ShowCaseCard item={item} sectionSettings={sectionSettings} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </SwipeableViews>
      );
    }

    return (
      <Box sx={{ width: '100%' }}>
        {pages.map((page: any, pageIndex: any) => (
          <Box
            sx={{
              position: "relative",
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
            key={pageIndex}
          >
            <Grid
              container
              justifyContent="center"
              spacing={itemsSpacing}
              sx={{
                maxWidth: '100%',
                width: '100%'
              }}
            >
              {page.map((item: any, itemIndex: any) => (
                <Grid
                  {...getItemSizing()}
                  key={`${pageIndex}-${itemIndex}`}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ShowCaseCard item={item} sectionSettings={sectionSettings} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Container sx={{
      p: { xs: 0, ms: 2 },
      '@media (max-width: 600px)': {
        px: 1,
      },
    }}>
      <Box
        sx={{
          pt: section.settings.paddingTop,
          pb: section.settings.paddingBottom,
          '@media (max-width: 600px)': {
            pt: Math.max(section.settings.paddingTop - 2, 1),
            pb: Math.max(section.settings.paddingBottom - 2, 1),
          },
        }}
      >
        <Stack
          direction="row"
          spacing={{ sm: 2, xs: 1 }}
          alignItems="center"
          sx={{
            '@media (max-width: 600px)': {
              spacing: 1,
            },
          }}
        >
          {renderNavigationButtons()}

          <Box sx={{
            flex: 1,
            overflowX: "hidden",
            '@media (max-width: 600px)': {
              overflowX: 'auto',
            },
          }}>
            {renderContent()}
          </Box>
        </Stack>

        {renderPagination()}
      </Box>
    </Container>
  );
}
