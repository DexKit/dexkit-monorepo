import { useIsMobile } from "@dexkit/core";
import {
  ShowCaseItem,
  ShowCasePageSection,
} from "@dexkit/ui/modules/wizard/types/section";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Container, Grid, IconButton, Stack, alpha } from "@mui/material";
import { useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
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

  const { items, alignItems, itemsSpacing } = section.settings;

  const isMobile = useIsMobile();

  const pages = useMemo(() => {
    return chunk<ShowCaseItem>(items, isMobile ? 2 : 4);
  }, [items, isMobile]);

  const handleChangeIndex = (index: number, indexLatest: number) => {
    setIndex(index);
  };

  const handleNext = () => {
    if (index + 1 === pages?.length) {
      return setIndex(0);
    }

    setIndex((index) => index + 1);
  };

  const handlePrev = () => {
    if (index - 1 === -1) {
      return setIndex(pages?.length - 1);
    }

    setIndex((index) => index - 1);
  };

  const alignItemsValue = useMemo(() => {
    const results = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    };

    return results[alignItems];
  }, [alignItems]);

  return (
    <Container sx={{ p: { xs: 0, ms: 2 } }}>
      <Box
        sx={{
          pt: section.settings.paddingTop,
          pb: section.settings.paddingBottom,
        }}
      >
        <Stack direction="row" spacing={{ sm: 2, xs: 1 }} alignItems="center">
          {!isMobile && pages.length > 1 && (
            <Box>
              <IconButton
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.action.focus, 0.25),
                }}
                onClick={handlePrev}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ flex: 1, overflowX: "hidden" }}>
            <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
              {pages.map((page, pageIndex) => (
                <Box sx={{ position: "aboslute", p: 2 }} key={pageIndex}>
                  <Grid
                    container
                    justifyContent={alignItemsValue}
                    spacing={itemsSpacing}
                  >
                    {page.map((item, itemIndex) => (
                      <Grid
                        item
                        xs={6}
                        sm={3}
                        key={`${pageIndex}-${itemIndex}`}
                      >
                        <ShowCaseCard item={item} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </SwipeableViews>
          </Box>
          {!isMobile && pages.length > 1 && (
            <Box>
              <IconButton
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.action.focus, 0.25),
                }}
                onClick={handleNext}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          )}
        </Stack>
        {pages.length > 1 && (
          <Box sx={{ position: "relative", py: 2 }}>
            <Pagination
              dots={pages?.length}
              index={index}
              onChangeIndex={(index: number) => {
                setIndex(index);
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
