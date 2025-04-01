import { Stack } from "@mui/material";
import PaginationDot from "./PaginationDot";

export interface PaginationProps {
  dots: number;
  index: number;
  onChangeIndex: (index: number) => void;
}

export default function Pagination({
  onChangeIndex,
  index,
  dots,
}: PaginationProps) {
  return (
    <Stack
      spacing={0.5}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      {new Array(dots).fill(null).map((_, i: number) => (
        <PaginationDot
          active={index === i}
          onClick={() => onChangeIndex(i)}
          key={i}
        />
      ))}
    </Stack>
  );
}
