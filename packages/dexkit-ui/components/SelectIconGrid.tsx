import { Box, Grid, Icon, IconButton, useTheme } from "@mui/material";

import { chunk } from "@dexkit/core/utils";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

export interface SelectIconGridProps {
  onSelect: (iconName: string) => void;
  value?: string;
  filters?: { query?: string; theme?: string };
}

import { MUI_ICONS } from "@dexkit/ui/constants/icons";

export default function SelectIconGrid({
  onSelect,
  value,
  filters,
}: SelectIconGridProps) {
  const icons = useMemo(() => {
    return MUI_ICONS.sort().filter((key) => {
      if (filters?.query) {
        return key.toLowerCase().indexOf(filters.query.toLowerCase()) > -1;
      }
      return true;
    });
  }, [filters]);



  const theme = useTheme();

  const renderRow = useCallback(
    (props: ListChildComponentProps<string[][]>) => {
      const { index, style, data } = props;

      const icons = data[index];

      return (
        <div style={style} key={index}>
          <Grid container spacing={2}>
            {icons?.map((iconName: string, iconIndex) => (
              <Grid size={{ xs: 6, sm: 3 }} key={`${index}-${iconIndex}`}>
                <Box
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    p: 2,
                  }}
                >
                  <IconButton
                    sx={
                      value === iconName
                        ? {
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: (theme) => theme.palette.primary.main,
                        }
                        : undefined
                    }
                    onClick={() => onSelect(iconName)}
                  >
                    <Icon baseClassName={filters?.theme}>{iconName}</Icon>
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </div>
      );
    },
    [value, theme]
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        bgcolor: "background.paper",
      }}
    >
      {(React as any).createElement(FixedSizeList, {
        height: 400,
        width: "100%",
        itemSize: 72,
        itemCount: 200,
        overscanCount: 5,
        itemData: chunk(icons, 4),
        children: renderRow
      })}
    </Box>
  );
}
