import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useCallback, useEffect, useState } from "react";

export function usePositionPaginator(pageSize = 5) {
  const [position, setPosition] = useState({ offset: 0, limit: pageSize });

  const handleNext = useCallback(() => {
    setPosition((value: any) => ({ ...value, offset: value.offset + pageSize }));
  }, [pageSize]);

  const handlePrevious = useCallback(() => {
    if (position.offset - pageSize >= 0) {
      setPosition((value: any) => ({ ...value, offset: value.offset - pageSize }));
    }
  }, [position, pageSize]);

  return { position, handleNext, handlePrevious, pageSize };
}

export function useIsMobile() {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down("sm"));
}

export function useDebounce<T>(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
